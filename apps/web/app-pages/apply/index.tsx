"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProgressStepper } from "@/components/progress-stepper";
import { useAuth } from "@/features/auth/context";
import { getPermitService } from "@/features/permit-services/api";
import type {
  DocumentType,
  PermitServiceDetail,
} from "@/features/permit-services/types";
import {
  createPhysicalApplication,
  getApplication,
  submitApplication,
  submitServiceRating,
  updateApplicationContact,
  updateApplicationTradeDetail,
  uploadApplicationFile,
  type ApplicationDetails,
  type PhysicalApplicant,
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

type ApplyPermissionPageProps = {
  id: string;
  isDraft?: boolean;
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

const ApplyPermissionPage = ({
  id,
  isDraft = false,
  initialPermitService,
}: ApplyPermissionPageProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = Boolean(user);
  const routeId = Number(id);
  const [permitServiceId, setPermitServiceId] = useState<number | null>(
    isDraft ? null : routeId,
  );
  const isValidRouteId = Number.isInteger(routeId) && routeId > 0;
  const creationKey = useRef<string | null>(null);
  const [application, setApplication] = useState<PhysicalApplicant | null>(
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
  const [isCreating, setIsCreating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreationError, setShowCreationError] = useState(false);

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
        response: { data: PhysicalApplicant | ApplicationDetails },
        permitService?: PermitServiceDetail,
      ) => {
        const data = response.data as ApplicationDetails;

        if (cancelled) return;

        setApplication(response.data);
        if (data.permit_service?.id) {
          setPermitServiceId(data.permit_service.id);
        }
        setDocumentTypes(data.documentTypes ?? permitService?.documentTypes ?? []);
        setPermitServiceCode(
          data.permit_service?.code ?? permitService?.code ?? null,
        );
        setPersonalInformation({
          fin: data.fin,
          firstName: data.first_name,
          lastName: data.last_name,
          fatherName: data.father_name,
        });
        if (isDraft) {
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
        }
      };

      void (async () => {
        if (!isDraft) {
          const response = await createPhysicalApplication(routeId);
          handleApplication(response, initialPermitService);
          return;
        }

        const response = await getApplication(routeId);
        const serviceId = response.data.permit_service?.id;
        const needsPermitService =
          serviceId &&
          (!response.data.permit_service?.code ||
            !response.data.documentTypes?.length);
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
            !isDraft && getErrorStatus(requestError) === 422,
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
    isDraft,
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

  const handleSubmit = async () => {
    if (!application) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitApplication(application.id);
      setSubmission(response.data);
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
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col items-center justify-center gap-5 px-4 pb-10 text-center">
        <p
          className="max-w-xl text-base font-medium text-[#d90b0b]"
          role="alert"
        >
          {error ?? "Müraciət yaratmaq mümkün olmadı."}
        </p>
        <Link
          href="/drafts"
          className="flex h-12 min-w-[150px] items-center justify-center rounded-lg bg-[#286aa6] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1f5688] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none"
        >
          Qaralamalar
        </Link>
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
        />
      ) : null}

      {step === 3 ? (
        <OperationStep
          initialValues={operationInformation}
          onBack={() => setStep(2)}
          onNext={handleOperationNext}
          isSubmitting={isSubmitting}
        />
      ) : null}

      {step === 4 ? (
        <DocumentsStep
          documentTypes={documentTypes}
          initialDocuments={documents}
          maxFileSizeMb={maxFileSizeMb}
          onBack={() => setStep(permitServiceId === 1 ? 3 : 2)}
          onUpload={handleDocumentUpload}
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
        />
      ) : null}

      {step === 6 ? (
        <ConfirmationStep
          applicantName={applicantName || "—"}
          documentCount={documents.length}
          onBack={() => setStep(5)}
          onSaveDraft={() => setStep(7)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : null}

      {step === 7 ? (
        submission ? (
          <SuccessStep
            applicationNumber={submission.application_no}
            onApplications={() => window.location.assign("/applications")}
            onRate={() => setStep("rating")}
          />
        ) : (
          <ToDraftStep
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
