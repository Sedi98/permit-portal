'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ProgressStepper } from '@/components/progress-stepper'
import { useAuth } from '@/features/auth/context'
import {
  createPhysicalApplication,
  submitApplication,
  updateApplicationContact,
  updateApplicationTradeDetail,
  uploadApplicationFile,
  type PhysicalApplicant,
} from '@/features/apply/api'
import ContactInformation, {
  type ContactInformationValues,
} from '@/app-pages/apply/steps/contact-information'
import CheckoutStep, {
  type CheckoutDocument,
} from '@/app-pages/apply/steps/checkout-step'
import ConfirmationStep from '@/app-pages/apply/steps/confirmation-step'
import DocumentsStep, {
  type SelectedApplicationDocument,
} from '@/app-pages/apply/steps/documents-step'
import OperationStep, {
  type OperationInformationValues,
} from '@/app-pages/apply/steps/operations-step'
import PersonalInformation, {
  type PersonalInformationValues,
} from '@/app-pages/apply/steps/personal-information'
import RatingStep from '@/app-pages/apply/steps/rating-step'
import SuccessStep from '@/app-pages/apply/steps/success-step'
import ToDraftStep from '@/app-pages/apply/steps/to-draft-step'

type ApplyPermissionPageProps = {
  id: string
}

type ApplyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7
type ApplyView = ApplyStep | 'rating'

type SubmissionResult = {
  application_no: string
  status: string
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response

    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data

      if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
        return data.message
      }
    }
  }

  return error instanceof Error ? error.message : 'Müraciət zamanı xəta baş verdi.'
}

const ApplyPermissionPage = ({ id }: ApplyPermissionPageProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const isAuthenticated = Boolean(user)
  const permitServiceId = Number(id)
  const isValidPermitServiceId = Number.isInteger(permitServiceId) && permitServiceId > 0
  const creationKey = useRef<string | null>(null)
  const [application, setApplication] = useState<PhysicalApplicant | null>(null)
  const [personalInformation, setPersonalInformation] = useState<PersonalInformationValues>({})
  const [contactInformation, setContactInformation] = useState<ContactInformationValues>({
    email: '',
    phones: [''],
  })
  const [operationInformation, setOperationInformation] = useState<OperationInformationValues | undefined>()
  const [documents, setDocuments] = useState<SelectedApplicationDocument[]>([])
  const [submission, setSubmission] = useState<SubmissionResult | null>(null)
  const [step, setStep] = useState<ApplyView>(1)
  const [isCreating, setIsCreating] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('ApplyPermissionPage auth data:', {
      permitServiceId: id,
      loading,
      user,
    })
  }, [id, loading, user])

  useEffect(() => {
    if (loading || creationKey.current === id) {
      return
    }

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (!isValidPermitServiceId) {
      return
    }

    let cancelled = false
    const creationTimer = window.setTimeout(() => {
      if (cancelled || creationKey.current === id) return

      creationKey.current = id
      setIsCreating(true)
      setError(null)

      void createPhysicalApplication(permitServiceId)
        .then((response) => {
          if (cancelled) return

          setApplication(response.data)
          setPersonalInformation({
            fin: response.data.fin,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            fatherName: response.data.father_name,
          })
        })
        .catch((requestError: unknown) => {
          if (cancelled) return

          creationKey.current = null
          setError(getErrorMessage(requestError))
        })
        .finally(() => {
          if (!cancelled) setIsCreating(false)
        })
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(creationTimer)
    }
  }, [id, isAuthenticated, isValidPermitServiceId, loading, permitServiceId, router])

  const handleContactNext = async (values: ContactInformationValues) => {
    if (!application) return

    setIsSubmitting(true)
    setError(null)

    try {
      await updateApplicationContact(application.id, {
        email: values.email,
        phones: values.phones.map((phone) => ({ phone })),
      })
      setContactInformation(values)
      setStep(permitServiceId === 1 ? 3 : 4)
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOperationNext = async (values: OperationInformationValues) => {
    if (!application) return

    setIsSubmitting(true)
    setError(null)

    try {
      await updateApplicationTradeDetail(application.id, {
        trade_detail: {
          operation_type: values.operationType,
          goods_category: values.goodsCategory,
          goods_name_volume: values.goodsNameVolume,
        },
      })
      setOperationInformation(values)
      setStep(4)
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDocumentUpload = async (documentType: string, file: File) => {
    if (!application) return

    try {
      await uploadApplicationFile(application.id, documentType, file)
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    }
  }

  const handleSubmit = async () => {
    if (!application) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await submitApplication(application.id)
      setSubmission(response.data)
      setStep(7)
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkoutDocuments: CheckoutDocument[] = documents.map((document) => ({
    name: document.name,
    size: document.size,
    type: 'PDF',
  }))

  const applicantName = [personalInformation.lastName, personalInformation.firstName]
    .filter(Boolean)
    .join(' ')

  if (!isValidPermitServiceId) {
    return (
      <main className="mx-auto flex min-h-[40vh] w-full max-w-7xl items-center justify-center px-4 pb-10">
        <p className="text-sm text-[#d90b0b]" role="alert">İcazə identifikatoru düzgün deyil.</p>
      </main>
    )
  }

  if (isCreating) {
    return (
      <main className="mx-auto flex min-h-[40vh] w-full max-w-7xl items-center justify-center px-4 pb-10">
        <p className="text-sm text-[#797979]" role="status">Müraciət yaradılır...</p>
      </main>
    )
  }

  return (
    <main className="flex w-full flex-col items-center pb-10">
      {typeof step === 'number' && step < 7 ? <ProgressStepper activeStep={step} /> : null}

      {error ? (
        <div className="mx-4 mb-6 w-full max-w-7xl rounded-xl bg-[#fef1f1] p-3 text-sm text-[#d90b0b]" role="alert">
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
          onBack={() => setStep(permitServiceId === 1 ? 3 : 2)}
          onUpload={handleDocumentUpload}
          onNext={(selectedDocuments) => {
            setDocuments(selectedDocuments)
            setStep(5)
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
          applicantName={applicantName || '—'}
          documentCount={documents.length}
          onBack={() => setStep(5)}
          onSaveDraft={() => setStep(7)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : null}

      {step === 7 ? submission ? (
        <SuccessStep
          applicationNumber={submission.application_no}
          onApplications={() => window.location.assign('/applications')}
          onRate={() => setStep('rating')}
        />
      ) : (
        <ToDraftStep
          completedSteps={`${permitServiceId === 1 ? 6 : 5}/6 tamamlandı`}
          onContinue={() => setStep(6)}
          onDrafts={() => window.location.assign('/applications')}
        />
      ) : null}

      {step === 'rating' ? (
        <RatingStep
          onSkip={() => window.location.assign('/')}
          onSubmit={() => window.location.assign('/')}
        />
      ) : null}

      <p className="sr-only">İcazə xidməti identifikatoru: {id}</p>
    </main>
  )
}

export default ApplyPermissionPage
