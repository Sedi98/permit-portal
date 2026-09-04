# Ödəniş → Təsdiq → İmza → PDF → Endirmə — Tam Zəncir (Frontend Bələdçisi)

Bu, icraçının, ödəniş cədvəlini hazırlamasından, Nazir müavininin, son imzasına, VƏ, vətəndaşın, öz, PDF-i, endirməsinə qədər, **bütün, 7 addımı**, əhatə edir.

---

## 1. İcraçı, ödəniş cədvəlini hazırlayır (Viza + İmza tələb olunur)

```
POST /admin/permit-applications/{id}/confirmation-sequences
{
  "type": "payment",
  "amount": 50,
  "body": "...",
  "participants": [{"user_id": X, "role": "visa"}, {"user_id": Y, "role": "sign"}]
}
```
→ status: **`payment_confirmation`**

**Ön şərt:** bu, yalnız, "Xidməti Məruzə" (report), artıq, tamamlanmış olan, müraciətlərdə, mümkündür — əks halda, `422` xətası gələcək.

---

## 2. Viza + İmza, tamamlananda — ödəniş tapşırığı, vətəndaşa göndərilir

Hər ikisi, öz növbələrində, təsdiqlədikdə, avtomatik:

→ status: **`awaiting_payment`**

Vətəndaş, indi, öz, "Ödəniş Tapşırığı/Daxil Olanlar" səhifəsində, bu müraciəti, hesab-faktura ilə birlikdə, görür.

### Bu səhifə üçün — endpoint

```
GET /api/permit-applications?status=awaiting_payment
Authorization: Bearer <token>
```

### Cavab

```json
{
  "status": "success",
  "data": [
    {
      "id": 12,
      "status": "awaiting_payment",
      "application_no": "D/O-İ-3/2026",
      "invoice_no": "INV-12-20260829143000",
      "payment_amount": "50.00",
      "permit_service": { "id": 3, "name": "Elektrik enerjisinin ötürülməsinə icazə" }
    }
  ]
}
```

| Sahə | Hesab-fakturada, necə göstərilir |
|---|---|
| `application_no` | Müraciətin, öz nömrəsi |
| `invoice_no` | Hesab-fakturanın, öz nömrəsi (E-Rüsum, real işə düşəndə, rəsmi formatda; hazırda, müvəqqəti, öz-daxili formatda) |
| `payment_amount` | Ödəniləcək, məbləğ (AZN) |
| `permit_service.name` | Hansı icazəyə görə, ödəniş tələb olunur |

**Diqqət — bu massivin, hər elementi, elə, adi, `GET /permit-applications` cavabının, öz strukturudur** (yalnız, `?status=awaiting_payment` süzgəci ilə) — ayrıca, fərqli bir format, ya, endpoint, deyil.

---

## 3. Vətəndaş, detala girir, "Ödədim" basır

Vətəndaş, 2-ci addımdakı, siyahıda, konkret müraciətin, **"Detal"** düyməsinə basır — bu, aşağıdakı endpoint-i çağırır:

```
GET /api/permit-applications/{id}
```
```json
{
  "status": "awaiting_payment",
  "application_no": "D/O-İ-3/2026",
  "invoice_no": "INV-12-20260829143000",
  "payment_amount": "50.00",
  "permit_service": { "name": "..." }
}
```

Detal səhifəsində, hesab-faktura (yuxarıdakı, `invoice_no`/`payment_amount`), göstərilir, ən altda, **"Ödədim"** düyməsi olur. Vətəndaş, bunu, basır:

```
POST /api/permit-applications/{id}/pay
```
→ status: **`payment_review`**

> Bu, hazırda, **sınaq rejimindədir** — real, ASAN Pay inteqrasiyası, hələ, edilməyib, düymə, sadəcə, statusu dəyişir.

---

## 4. İcraçı, ödənişi (bank qəbzini) yoxlayır, təsdiqləyir (Viza/İmza, LAZIM DEYİL)

```
POST /admin/permit-applications/{id}/confirm-payment-received
```
→ status: **`awaiting_signature`**

**Diqqət — bu addım, 1-ci addımdan, FƏRQLİDİR:** burada, heç bir, yeni, `ConfirmationSequence` yaranmır, viza/imza gözlənilmir — **yalnız, təyin olunmuş icraçının, öz, tək təsdiqi**, kifayətdir.

---

## 5. Müraciət, "İmzalanmamışlar" siyahısına düşür

```
GET /admin/permit-applications-awaiting-signature
```

**Diqqət — bu siyahı, konkret, bir adama "yönləndirilmir"** — `deputy_minister` rolunda olan, **istənilən** istifadəçi, bunu, görüb, imzalaya bilər (fərqli olaraq, digər, "kimə təyin olunub" məntiqli siyahılardan).

---

## 6. Nazir müavini, imzalayır — PDF, avtomatik yaranır

```
POST /admin/permit-applications/{id}/sign
```
→ status: **`completed`**

Bu, andaca, **üç şey**, avtomatik baş verir:
1. QR-kodlu, rəsmi PDF sənədi, yaranır.
2. Vətəndaşa, bildiriş gedir: *"İcazəniz hazırdır"* (bu bildirişin, öz `data`-sında, birbaşa, `permit_application_id` VƏ `document_id`, hər ikisi var — endirmə linkini, dərhal, qurmaq olar).
3. Vətəndaşın, "Tamamlanmış Müraciətlər" siyahısında, bu sənəd, "Endir" düyməsi ilə, görünür.

---

## 7. Vətəndaş, PDF-i, necə endirir

Bunu, **iki, fərqli yerdən** edə bilər:

### 7.1. Bildirişdən, birbaşa

Vətəndaş, mərhələ 6-da, gələn, "İcazəniz hazırdır" bildirişinə klikləyir. Bildirişin, öz `data` sahəsində, ikisi, birlikdə var:
```json
{ "permit_application_id": 12, "document_id": 3 }
```
Bu, **əlavə, heç bir sorğu etmədən**, birbaşa, endirmə linkini, qurmağa, kifayət edir.

### 7.2. "Tamamlanmış Müraciətlər" siyahısından

```
GET /api/permit-applications?status=completed
```
Bu, siyahının, **hər sətrində**, artıq, sənəd məlumatı, birbaşa gəlir:
```json
{
  "id": 12,
  "application_no": "D/O-İ-3/2026",
  "documents": [{ "id": 3, "document_number": "D/O-İ-3/2026", "generated_at": "..." }]
}
```
Frontend, hər sətirdə, **"Detal" əvəzinə (ya, ona əlavə), birbaşa, "Endir" düyməsi** göstərməlidir — vətəndaş, siyahıdan, çıxmadan, PDF-i, endirə bilməlidir.

### 7.3. Real, endirmə sorğusu (hər iki yoldan, eyni)

```
GET /api/permit-applications/{permit_application_id}/documents/{document_id}/download
```

Bu endpoint JSON deyil, birbaşa PDF faylı qaytarır. Sorğu `fetch`/`axios` ilə `Authorization` header-i göndərilərək edilməli, cavab `blob` kimi alınmalı və klient tərəfdə müvəqqəti endirmə linki yaradılmalıdır. `window.location.href` istifadə edilməməlidir, çünki bu üsulla tələb olunan `Authorization` header-i göndərilmir.

```ts
const response = await axios.get(downloadUrl, {
  responseType: "blob",
  headers: { Authorization: `Bearer ${token}` },
});
const url = window.URL.createObjectURL(response.data);
const link = document.createElement("a");
link.href = url;
link.download = "icaze.pdf";
document.body.appendChild(link);
link.click();
link.remove();
window.URL.revokeObjectURL(url);
```

---

## Status Xülasəsi

| # | Status | Kim, nə edir |
|---|---|---|
| 1 | `payment_confirmation` | Viza+imza, gözlənilir |
| 2 | `awaiting_payment` | Vətəndaş, ödəməli |
| 3 | `payment_review` | İcraçı, yoxlamalı |
| 4 | `awaiting_signature` | Nazir müavini, imzalamalı |
| 5 | `completed` | PDF, hazırdır — bax, 7-ci bölmə, "necə endirilir" |
