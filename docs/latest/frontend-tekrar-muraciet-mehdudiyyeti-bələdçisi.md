# Eyni İcazəyə, Təkrar Müraciət — Məhdudiyyət (Frontend Bələdçisi)

## Nə dəyişdi

```
POST /api/permit-applications
{ "permit_service_id": 3, "applicant_type": "physical" }
```

İndi, əgər, giriş etmiş vətəndaşın, **eyni `permit_service_id`** üzrə, artıq, **aktiv** (tamamlanmamış) bir draft-ı ya müraciəti varsa, bu sorğu, **yeni bir sətir yaratmır** — əvəzinə, xəta qaytarır:

```json
{
  "status": "error",
  "message": "Bu icazə üzrə, artıq, aktiv bir müraciətiniz/qaralamanız var. Yeni müraciət yaratmazdan əvvəl, mövcud olanı tamamlayın."
}
```
HTTP status: **422**

## "Aktiv" nə deməkdir

**`completed`-dən başqa, bütün statuslar** — yəni, `draft`, `registered`, `assigned`, ..., `awaiting_signature`. Yalnız, bir icazə, **tam, sonuna qədər tamamlanandan sonra**, həmin icazə növünə, yenidən, müraciət etmək, mümkün olur.

## Frontend-də, necə işlədilməli

Vətəndaş, "Yeni müraciət" düyməsinə basıb, bu, `422` xətasını alsa:

1. Xəta mesajını, olduğu kimi, göstər (yuxarıdakı, hazır, Azərbaycanca mətn).
2. Mümkünsə, vətəndaşı, birbaşa, **"Qaralamalarım"** ya **"Tamamlanmamış müraciətlərim"** səhifəsinə yönləndir — çünki, çox güman, o, elə, öz, mövcud müraciətini axtarır, sadəcə, hardan davam edəcəyini, tapmır.

## Diqqət — VÖEN-ə görə, AYRILMIR

Bu, `permit_service_id`-nin, özünə görə yoxlanılır — vətəndaşın, **fərqli VÖEN-ləri (şirkətləri)** olsa belə, eyni icazəyə, ikinci, paralel bir müraciət, aça bilmir. Bu, bilərəkdən belədir.
