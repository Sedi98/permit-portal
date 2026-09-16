"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

const FILLED_STAR_ICON = "/icons/apply/rating/star-filled.svg";
const OUTLINE_STAR_ICON = "/icons/apply/rating/star-outline.svg";
const RATING_VALUES = [1, 2, 3, 4, 5] as const;

export type RatingValue = (typeof RATING_VALUES)[number];

export type RatingStepValues = {
  rating: RatingValue;
  comment: string;
};

export type RatingStepProps = {
  initialRating?: RatingValue;
  initialComment?: string;
  onSkip?: () => void;
  onSubmit?: (values: RatingStepValues) => void | Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
};

const RatingStep = ({
  initialRating,
  initialComment = "",
  onSkip,
  onSubmit,
  isSubmitting = false,
  error,
}: RatingStepProps) => {
  const [rating, setRating] = useState<RatingValue | null>(initialRating ?? null);
  const [comment, setComment] = useState(initialComment);
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = () => {
    setShowValidation(true);
    if (!rating) return;

    void onSubmit?.({ rating, comment: comment.trim() });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <section className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 rounded-xl border border-[#dfdfdf] bg-white p-4 sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-lg bg-[#f9fafc]">
          <Image
            src={FILLED_STAR_ICON}
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </div>

        <header className="flex w-full flex-col items-center gap-2.5 text-center">
          <h1 className="w-full text-2xl font-bold leading-8 text-[#1f1f1f]">
            Xidmətdən məmnun qaldınızmı?
          </h1>
          <p className="w-full text-base font-normal leading-6 text-[#797979]">
            Müraciətiniz uğurla göndərildi. Prosesi qiymətləndirməyinizi xahiş edirik.
          </p>
        </header>

        <fieldset
          className="flex w-full flex-col items-center gap-2.5 rounded-lg border border-transparent p-2 data-[invalid=true]:border-destructive data-[invalid=true]:ring-2 data-[invalid=true]:ring-destructive/20"
          data-invalid={showValidation && !rating}
          aria-invalid={showValidation && !rating}
        >
          <legend className="sr-only">Xidmət üçün ulduz reytinqi seçin</legend>
          <div className="flex items-center gap-[13.958px]">
            {RATING_VALUES.map((value) => {
              const isSelected = rating !== null && value <= rating;

              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} ulduz`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  className="size-[33.5px] shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:ring-offset-2"
                >
                  <Image
                    src={isSelected ? FILLED_STAR_ICON : OUTLINE_STAR_ICON}
                    alt=""
                    width={34}
                    height={34}
                    aria-hidden="true"
                    className="size-[33.5px]"
                  />
                </button>
              );
            })}
          </div>
          <p
            className="min-h-6 text-center text-base font-normal leading-6 text-[#3a74a8]"
            aria-live="polite"
          >
            {rating ? `${rating} ulduz seçildi` : "Ulduz seçin"}
          </p>
          {showValidation && !rating ? <FieldError>Qiymətləndirmək üçün ulduz seçin.</FieldError> : null}
        </fieldset>

        <div className="w-full">
          {error ? (
            <p className="mb-3 text-sm text-[#d90b0b]" role="alert">
              {error}
            </p>
          ) : null}
          <label htmlFor="rating-comment" className="sr-only">
            Xidmət haqqında rəy
          </label>
          <textarea
            id="rating-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Rəyinizi yazın (istəyə baxın)"
            className="h-[110px] w-full resize-none rounded-lg border-0 bg-[#f5f5f5] px-4 py-3 text-base font-normal leading-6 text-[#1f1f1f] outline-none placeholder:text-[#797979] focus-visible:ring-2 focus-visible:ring-[#286aa6]/30"
          />
        </div>

        <footer className="flex w-full gap-5">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="h-12 min-w-0 flex-1 rounded-lg border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            Keç
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 min-w-0 flex-1 rounded-lg bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6] disabled:bg-[#5388b8] disabled:text-[#bcbcbc] disabled:opacity-100"
          >
            Göndər
          </Button>
        </footer>
      </section>
    </div>
  );
};

export default RatingStep;
