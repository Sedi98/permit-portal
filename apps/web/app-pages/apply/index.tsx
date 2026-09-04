"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProgressStepper } from "@/components/progress-stepper";
import { useAuth } from "@/features/auth/context";
import { getPermitService } from "@/features/permit-services/api";
import { usePermitService } from "@/features/permit-services/hooks";
import type {
  ConfiguredDocumentType,
  DocumentType,
  PermitServiceDetail,
} from "@/features/permit-services/types";
import {
  createPhysicalApplication,
  getApplication,
  replaceApplicationFile,
  resubmitApplication,
  submitApplication,
  submitServiceRating,
  updateApplicationContact,
  updateApplicationTradeDetail,
  uploadApplicationFile,
  type ApplicationDetails,
  type ApplicationFile,
} from "@/features/apply/api";
import ContactInformation, {
  type ContactInformationValues,
} from "@/app-pages/apply/steps/contact-information";
import CheckoutStep, {
  type CheckoutDocument,
} from "@/app-pages/apply/steps/checkout-step";
import ConfirmationStep from "@/app-pages/apply/steps/confirmation-step";
import DocumentsStep, {
  type SelectedApplicationDocument,
} from "@/app-pages/apply/steps/documents-step";
import OperationStep, {
  type OperationInformationValues,
} from "@/app-pages/apply/steps/operations-step";
import PersonalInformation, {
  type PersonalInformationValues,
} from "@/app-pages/apply/steps/personal-information";
import RatingStep from "@/app-pages/apply/steps/rating-step";
import type { RatingStepValues } from "@/app-pages/apply/steps/rating-step";
import SuccessStep from "@/app-pages/apply/steps/success-step";
import ToDraftStep from "@/app-pages/apply/steps/to-draft-step";
import { Button } from "@/components/ui/button";

type ApplyPermissionPageProps = {
  id: string;
  isExistingApplication?: boolean;
  initialPermitService?: PermitServiceDetail;
};

type ApplyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ApplyView = ApplyStep | "rating";

type SubmissionResult = {
  application_no: string;
  status: string;
};

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "errors" in data &&
        typeof data.errors === "object" &&
        data.errors !== null &&
        "files" in data.errors &&
        typeof data.errors.files === "string"
      ) {
        return data.errors.files;
      }

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }
    }
  }

  return error instanceof Error
    ? error.message
    : "Müraciət zamanı xəta baş verdi.";
}

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;

    if (
      typeof response === "object" &&
      response !== null &&
      "status" in response &&
      typeof response.status === "number"
    ) {
      return response.status;
    }
  }

  return undefined;
}

function getConfiguredDocumentTypes(
  application: ApplicationDetails,
  permitService?: PermitServiceDetail,
): DocumentType[] {
  const documentTypes: ConfiguredDocumentType[] =
    application.documentTypes ??
    application.permit_service?.documentTypes ??
    application.permit_service?.document_types ??
    permitService?.documentTypes ??
    permitService?.document_types ??
    [];

  return [...documentTypes]
    .sort(
      (first, second) =>
        (first.pivot?.display_order ?? 0) -
        (second.pivot?.display_order ?? 0),
    )
    .map(({ id, name }) => ({ id, name }));
}

function getSelectedApplicationDocuments(
  files: ApplicationFile[] | undefined,
): SelectedApplicationDocument[] {
  const documentsByType = new Map<number, SelectedApplicationDocument>();

  for (const file of files ?? []) {
    documentsByType.set(file.document_type_id, {
      documentTypeId: file.document_type_id,
      documentTypeName: file.document_type ?? "Sənəd",
      fileId: file.id,
      name: file.original_name,
      size: file.size,
      path: file.path,
      reviewNote: file.review_note,
      reviewStatus: file.review_status,
      reviewStatusLabel: file.review_status_label,
    });
  }

  return [...documentsByType.values()];
}

function getFirstIncompleteStep(
  application: ApplicationDetails,
  permitServiceId: number | undefined,
  documentTypes: DocumentType[],
  documents: SelectedApplicationDocument[],
): ApplyStep {
  const hasPersonalInformation = Boolean(
    application.fin?.trim() &&
      application.first_name?.trim() &&
      application.last_name?.trim(),
  );
  if (!hasPersonalInformation) return 1;

  const hasContactInformation = Boolean(
    application.email?.trim() &&
      application.phones?.some(({ phone }) => phone.trim()),
  );
  if (!hasContactInformation) return 2;

  if (
    permitServiceId === 1 &&
    (!application.trade_detail?.operation_type ||
      !application.trade_detail.goods_category?.trim() ||
      !application.trade_detail.goods_name_volume?.trim())
  ) {
    return 3;
  }

  const documentsByType = new Map(
    documents.map((document) => [document.documentTypeId, document]),
  );
  const hasAllDocuments =
    documentTypes.length > 0 &&
    documentTypes.every((documentType) => {
      const document = documentsByType.get(documentType.id);
      return document && document.reviewStatus !== "rejected";
    });

  return hasAllDocuments ? 5 : 4;
}

const ApplyPermissionPage = ({
  id,
  isExistingApplication = false,
  initialPermitService,
}: ApplyPermissionPageProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = Boolean(user);
  const routeId = Number(id);
  const [permitServiceId, setPermitServiceId] = useState<number | null>(
    isExistingApplication ? null : routeId,
  );
  const isValidRouteId = Number.isInteger(routeId) && routeId > 0;
  const creationKey = useRef<string | null>(null);
  const [application, setApplication] = useState<ApplicationDetails | null>(
    null,
  );
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformationValues>({});
  const [contactInformation, setContactInformation] =
    useState<ContactInformationValues>({
      email: "",
      phones: [""],
    });
  const [operationInformation, setOperationInformation] = useState<
    OperationInformationValues | undefined
  >();
  const [documents, setDocuments] = useState<SelectedApplicationDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(
    initialPermitService?.documentTypes ?? [],
  );
  const [permitServiceCode, setPermitServiceCode] = useState<string | null>(
    initialPermitService?.code ?? null,
  );
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [step, setStep] = useState<ApplyView>(1);
  const [firstAvailableStep, setFirstAvailableStep] = useState<ApplyStep>(1);
  const [isCreating, setIsCreating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreationError, setShowCreationError] = useState(false);
  const isRevisionApplication =
    isExistingApplication && application?.status === "awaiting_revision";
  const permitServiceQuery = usePermitService(permitServiceId);
  const selectedPermitService =
    permitServiceQuery.data?.data ?? initialPermitService;

  useEffect(() => {
    if (loading || creationKey.current === id) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isValidRouteId) {
      return;
    }

    let cancelled = false;
    const creationTimer = window.setTimeout(() => {
      if (cancelled || creationKey.current === id) return;

      creationKey.current = id;
      setIsCreating(true);
      setError(null);
      setShowCreationError(false);

      const handleApplication = (
        response: { data: ApplicationDetails },
        permitService?: PermitServiceDetail,
      ) => {
        const data = response.data as ApplicationDetails;

        if (cancelled) return;

        const resolvedPermitServiceId =
          data.permit_service?.id ?? permitService?.id;
        const configuredDocumentTypes = getConfiguredDocumentTypes(
          data,
          permitService,
        );
        const selectedDocuments = getSelectedApplicationDocuments(data.files);

        setApplication(response.data);
        if (resolvedPermitServiceId) {
          setPermitServiceId(resolvedPermitServiceId);
        }
        setDocumentTypes(configuredDocumentTypes);
        setDocuments(selectedDocuments);
        setPermitServiceCode(
          data.permit_service?.code ?? permitService?.code ?? null,
        );
        setPersonalInformation({
          fin: data.fin,
          firstName: data.first_name,
          lastName: data.last_name,
          fatherName: data.father_name,
        });
        if (isExistingApplication) {
          setContactInformation({
            email: data.email ?? "",
            phones: data.phones?.map(({ phone }) => phone) ?? [""],
          });
          if (data.trade_detail) {
            setOperationInformation({
              operationType: data.trade_detail.operation_type ?? "import",
              goodsCategory: data.trade_detail.goods_category ?? "nuclear",
              goodsNameVolume: data.trade_detail.goods_name_volume ?? "",
            });
          }

          const initialStep = getFirstIncompleteStep(
            data,
            resolvedPermitServiceId,
            configuredDocumentTypes,
            selectedDocuments,
          );
          setFirstAvailableStep(initialStep);
          setStep(initialStep);
        }
      };

      void (async () => {
        if (!isExistingApplication) {
          const creationResponse = await createPhysicalApplication(routeId);

          console.log("POST /permit-applications", creationResponse);

          const response = await getApplication(creationResponse.data.id);

          console.log(
            `GET /permit-applications/${creationResponse.data.id}`,
            response,
          );
          handleApplication(response, initialPermitService);
          return;
        }

        const response = await getApplication(routeId);

        const serviceId = response.data.permit_service?.id;
        const applicationDocumentTypes = getConfiguredDocumentTypes(
          response.data,
        );
        const needsPermitService =
          serviceId &&
          (!response.data.permit_service?.code ||
            applicationDocumentTypes.length === 0);
        const permitService = needsPermitService
          ? await getPermitService(serviceId)
              .then((serviceResponse) => serviceResponse.data)
              .catch(() => undefined)
          : undefined;
        handleApplication(response, permitService);
      })()
        .catch((requestError: unknown) => {
          if (cancelled) return;

          creationKey.current = null;
          setError(getErrorMessage(requestError));
          setShowCreationError(
            !isExistingApplication && getErrorStatus(requestError) === 422,
          );
        })
        .finally(() => {
          if (!cancelled) setIsCreating(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(creationTimer);
    };
  }, [
    id,
    initialPermitService,
    isAuthenticated,
    isExistingApplication,
    isValidRouteId,
    loading,
    routeId,
    router,
  ]);

  const handleContactNext = async (values: ContactInformationValues) => {
    if (!application) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateApplicationContact(application.id, {
        email: values.email,
        phones: values.phones.map((phone) => ({ phone })),
      });
      setContactInformation(values);
      setStep(permitServiceId === 1 ? 3 : 4);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOperationNext = async (values: OperationInformationValues) => {
    if (!application) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateApplicationTradeDetail(application.id, {
        trade_detail: {
          operation_type: values.operationType,
          goods_category: values.goodsCategory,
          goods_name_volume: values.goodsNameVolume,
        },
      });
      setOperationInformation(values);
      setStep(4);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (documentTypeId: number, file: File) => {
    if (!application) return;

    setError(null);
    try {
      await uploadApplicationFile(application.id, documentTypeId, file);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
      throw requestError;
    }
  };

  const handleDocumentReplace = async (
    document: SelectedApplicationDocument,
    file: File,
  ) => {
    if (!application || !document.fileId) {
      throw new Error("Sənədin identifikatoru tapılmadı.");
    }

    setError(null);
    try {
      await replaceApplicationFile(application.id, document.fileId, file);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
      throw requestError;
    }
  };

  const handleSubmit = async () => {
    if (!application) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (isRevisionApplication) {
        const response = await resubmitApplication(application.id);
        setSubmission({
          application_no: application.application_no ?? "",
          status: response.data.status,
        });
      } else {
        const response = await submitApplication(application.id);
        setSubmission(response.data);
      }
      setStep(7);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingSubmit = async ({ rating, comment }: RatingStepValues) => {
    if (!application) return;

    setIsRatingSubmitting(true);
    setRatingError(null);

    try {
      await submitServiceRating(application.id, rating, comment);
      window.location.assign("/");
    } catch (requestError: unknown) {
      setRatingError(getErrorMessage(requestError));
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const checkoutDocuments: CheckoutDocument[] = documents.map((document) => ({
    documentTypeName: document.documentTypeName,
    name: document.name,
    size: document.size,
    type: "PDF",
  }));

  const applicantName = [
    personalInformation.lastName,
    personalInformation.firstName,
  ]
    .filter(Boolean)
    .join(" ");
  const maxFileSizeMb =
    permitServiceCode === "PS-013" || permitServiceId === 13 ? 25 : 10;

  if (isCreating) {
    return (
      <main className="mx-auto flex min-h-[40vh] w-full max-w-7xl items-center justify-center px-4 pb-10">
        <p className="text-sm text-[#797979]" role="status">
          Müraciət yaradılır...
        </p>
      </main>
    );
  }

  if (showCreationError) {
    return (
      <main className="flex w-full flex-col items-center py-10 md:py-25">
        <div className="mx-auto w-full max-w-7xl px-4">
          <section className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 rounded-xl border border-[#dfdfdf] bg-white p-4 text-center sm:p-8">
            <p className="w-full text-base font-medium text-[#d90b0b]" role="alert">
              {error ?? "Müraciət yaratmaq mümkün olmadı."}
            </p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Button
                asChild
                className="h-12 w-full rounded-lg bg-[#286aa6] px-5 py-3 text-base font-semibold text-white hover:bg-[#1f5688]"
              >
                <Link href="/drafts">Qaralamalara bax</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-lg border-[#dfdfdf] bg-white px-5 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
              >
                <Link href="/applications">Müraciətlər</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!isValidRouteId || permitServiceId === null) {
    return (
      <main className="mx-auto flex min-h-[40vh] w-full max-w-7xl items-center justify-center px-4 pb-10">
        <p className="text-sm text-[#d90b0b]" role="alert">
          İcazə identifikatoru düzgün deyil.
        </p>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-col items-center pb-10">
      {typeof step === "number" && step < 7 ? (
        <ProgressStepper activeStep={step} />
      ) : null}

      {error ? (
        <div
          className="mx-4 mb-6 w-full max-w-7xl rounded-xl bg-[#fef1f1] p-3 text-sm text-[#d90b0b]"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <PersonalInformation
          values={personalInformation}
          onNext={() => setStep(2)}
          isNextDisabled={!application}
        />
      ) : null}

      {step === 2 ? (
        <ContactInformation
          initialValues={contactInformation}
          onBack={() => setStep(1)}
          onNext={handleContactNext}
          isSubmitting={isSubmitting}
          isBackDisabled={firstAvailableStep === 2}
        />
      ) : null}

      {step === 3 ? (
        <OperationStep
          initialValues={operationInformation}
          onBack={() => setStep(2)}
          onNext={handleOperationNext}
          isSubmitting={isSubmitting}
          isBackDisabled={firstAvailableStep === 3}
        />
      ) : null}

      {step === 4 ? (
        <DocumentsStep
          documentTypes={documentTypes}
          initialDocuments={documents}
          maxFileSizeMb={maxFileSizeMb}
          onBack={() => setStep(permitServiceId === 1 ? 3 : 2)}
          onUpload={handleDocumentUpload}
          onReplace={handleDocumentReplace}
          isBackDisabled={firstAvailableStep === 4}
          onNext={(selectedDocuments) => {
            setDocuments(selectedDocuments);
            setStep(5);
          }}
        />
      ) : null}

      {step === 5 ? (
        <CheckoutStep
          documents={checkoutDocuments}
          personalInformation={personalInformation}
          contactInformation={contactInformation}
          operationInformation={operationInformation}
          onBack={() => setStep(4)}
          onNext={() => setStep(6)}
          isBackDisabled={firstAvailableStep === 5}
        />
      ) : null}

      {step === 6 ? (
        <ConfirmationStep
          permitServiceName={selectedPermitService?.name}
          reviewDurationDays={selectedPermitService?.review_duration_days}
          applicantName={applicantName || "—"}
          documentCount={documents.length}
          onBack={() => setStep(5)}
          onSaveDraft={() => setStep(7)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isBackDisabled={firstAvailableStep === 6}
          submitLabel={
            isRevisionApplication ? "Yenidən göndər" : "Göndər"
          }
        />
      ) : null}

      {step === 7 ? (
        submission ? (
          <SuccessStep
            permitServiceName={selectedPermitService?.name}
            applicationNumber={submission.application_no}
            onApplications={() => window.location.assign("/applications")}
            onRate={() => setStep("rating")}
          />
        ) : (
          <ToDraftStep
            permitServiceName={selectedPermitService?.name}
            completedSteps={`${permitServiceId === 1 ? 6 : 5}/6 tamamlandı`}
            onContinue={() => setStep(6)}
            onDrafts={() => window.location.assign("/applications")}
          />
        )
      ) : null}

      {step === "rating" ? (
        <RatingStep
          onSkip={() => window.location.assign("/")}
          onSubmit={handleRatingSubmit}
          isSubmitting={isRatingSubmitting}
          error={ratingError}
        />
      ) : null}

      <p className="sr-only">İcazə xidməti identifikatoru: {permitServiceId}</p>
    </main>
  );
};

export default ApplyPermissionPage;
