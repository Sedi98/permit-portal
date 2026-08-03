# Admin Panel — Nazir Müavini Rolu (Bələdçi)

Bu sənəd, `deputy_minister` rolu ilə daxil olan istifadəçinin admin paneldə addım-addım nə görəcəyini, hansı düymələrin olacağını, onlara basılanda nə baş verdiyini və hər addımda hansı endpoint-in çağırılacağını izah edir.

> ⚠️ **Ümumi qeyd:** Bəzi biznes-qaydalar (xüsusən 6-cı bölmədəki "İmtina" və "Dayandır" izahları) yazılı spesifikasiya ilə deyil, kodun öz məntiqi ilə əsaslandırılıb — bunlar **təsdiqlənməmişdir**, müştəri ilə yoxlanılana qədər ehtiyatla yanaşılmalıdır.

---

## 1. Menyu

```
Əsas səhifə                          → GET /api/admin/permit-applications  (filtrsiz — hamısı)
Lövhə                                → GET /api/admin/statistics
Müraciətlər
  ├─ Yeni (yönləndirmə gözləyir)     → GET /api/admin/permit-applications?status=registered
  ├─ Yönləndirilmişlər               → GET /api/admin/permit-applications?status=forwarded
  └─ İcra edilmişlər                 → GET /api/admin/permit-applications?status=completed
İmza gözləyən sənədlər               → GET /api/admin/sign-queue
Ödəniş təsdiqi gözləyənlər           → GET /api/admin/permit-applications?status=awaiting_payment
```

**Vacib:** nazir müavini heç bir avtomatik filtrə tabe deyil — `GET /permit-applications`-a nə göndərsə, **bütün** nazirliyin müraciətlərini görür (icraçı/şöbə müdirindən fərqli olaraq, onların görüşü öz təyinatına/şöbəsinə görə avtomatik məhdudlaşır).

---

## 2. "Əsas səhifə" açanda — bütün müraciətlər

```
GET /api/admin/permit-applications
```
**Qayıdır:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 12,
        "application_no": "2026/AA-0042",
        "applicant_full_name": "Elçin Məmmədov Ata oğlu",
        "status": "registered",
        "submitted_at": "2026-07-30T09:00:00.000000Z",
        "permit_service": { "id": 3, "name": "..." }
      }
    ],
    "current_page": 1,
    "total": 152
  }
}

---

## 3. "Əsas səhifədə" kartlar — statistika

```
GET /api/admin/statistics
```
**Qayıdır:**
```json
{
  "status": "success",
  "data": {
    "total": 152,
    "pending": 12,
    "in_progress": 34,
    "completed": 98,
    "rejected": 5,
    "suspended": 3,
    "unprocessed": 1
  }
}
```
Bu rəqəmlər, "Əsas səhifə" səhifəsinin əsas kartlarını doldurur.

---

## 4. "Müraciətlər" altındakı üç bənd

Eyni siyahı ekranı (2-ci bölmədəki format), sadəcə fərqli status filtri ilə:

```
GET /api/admin/permit-applications?status=registered   (Yeni)
GET /api/admin/permit-applications?status=forwarded     (Yönləndirilmişlər)
GET /api/admin/permit-applications?status=completed     (İcra edilmişlər)
```

---

## 5. "Yeni" siyahısından bir müraciətin üstünə klikləyəndə — detal

```
GET /api/admin/permit-applications/{id}
```
**Qayıdır:**
```json
{
  "status": "success",
  "data": {
    "id": 12,
    "application_no": "2026/AA-0042",
    "applicant_type": "physical",
    "status": "registered",
    "applicant_full_name": "Elçin Məmmədov Ata oğlu",

    "first_name": "Elçin", "last_name": "Məmmədov", "father_name": "Ata oğlu",
    "fin": "5555555", "id_series": "AA1234567",

    "voen": null, "legal_entity_name": null, "legal_address": null,

    "submitted_at": "2026-07-30T09:00:00.000000Z",
    "department_id": null,
    "payment_amount": null,

    "permit_service": { "id": 3, "name": "..." },
    "phones": [ { "phone": "0501234567" } ],
    "files": [
      { "id": 1, "original_name": "sened1.pdf" }
    ],
    "documents": [],
    "status_histories": [
      { "old_status": null, "new_status": "registered", "changed_by": null, "created_at": "..." }
    ]
  }
}
```

Ekranda göstərilir: müraciət edənin məlumatları, yüklənmiş sənədlər (`files` — baxmaq/endirmək üçün).

**Diqqət:** `department_id`, `payment_amount` bu mərhələdə boşdur (sonrakı addımlarda dolur). `documents` (rəsmi, QR-lı sənədlər) də boşdur — bunlar yalnız iş axınının sonunda yaranır, `files` (vətəndaşın yüklədiyi) ilə qarışdırılmasın.

---

## 6. Detal ekranında düymələr — statusa görə dəyişir

**Qayda: düymələr yalnız müraciətin cari statusuna uyğun göstərilməlidir.** Uyğun olmayanda basılsa, backend `422` qaytarır.

### `registered` statusunda

#### "Şöbəyə yönləndir" düyməsi (əsas hərəkət)

Basılanda, şöbə seçimi açılır. Dropdown-u doldurmaq üçün:
```
GET /api/admin/departments
```
```json
{ "status": "success", "data": [
  { "id": 1, "name": "İqtisadiyyat şöbəsi", "code": "ECON" },
  { "id": 2, "name": "Hüquq şöbəsi", "code": "LEGAL" }
]}
```

Şöbə seçilib (könüllü qeyd yazılıb) "Göndər" basılanda:
```
POST /api/admin/permit-applications/{id}/forward
```
**Göndərilir:**
```json
{ "department_id": 1, "note": "Təcili baxılsın." }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Müraciət şöbəyə yönləndirildi.",
  "data": { "id": 12, "status": "forwarded", "department": { "id": 1, "name": "İqtisadiyyat şöbəsi" } }
}
```
Müraciət "Yeni"dən çıxıb "Yönləndirilmişlər"ə keçir.

#### "İmtina et" ⚠️ və "Dayandır" ⚠️

```
POST /api/admin/permit-applications/{id}/status
```
İmtina üçün göndərilir: `{ "status": "rejected" }`
Dayandırma üçün göndərilir: `{ "status": "suspended" }`

**Bu iki düymənin nə vaxt, hansı əsasla işlədiləcəyi (səbəb yazmaq məcburidirmi, ikisi arasında istifadəçiyə necə fərq izah edilməlidir) hələ təsdiqlənməyib.** Backend texniki olaraq icazə verir (body-də başqa sahə tələb etmir), amma bu iki düymənin UI mətnini/izahını hazırlamazdan əvvəl bizdən soruşun.

### `forwarded` statusunda

Nazir müavininin bu statusda birbaşa hərəkəti yoxdur — növbəti addımı (icraçı təyini) şöbə müdiri edir.

---

## 7. "İmza gözləyən sənədlər" səhifəsi

### Siyahı ekranı

```
GET /api/admin/sign-queue
```
**Qayıdır:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 9,
        "type": "permit",
        "status": "pending_sign",
        "body": "...",
        "application": {
          "id": 12,
          "application_no": "2026/AA-0042",
          "permit_service": { "name": "Tikinti icazəsi" }
        },
        "prepared_by": { "id": 3, "name": "Elçin Məmmədov" },
        "visas": [
          { "department": { "name": "İqtisadiyyat şöbəsi" }, "status": "approved", "note": null },
          { "department": { "name": "Hüquq şöbəsi" }, "status": "approved", "note": "Uyğundur." }
        ]
      }
    ]
  }
}
```

Cədvəldə hər sətirdə: **müraciət nömrəsi, icazə növü, sənəd növü, hazırlayan icraçı.** Bu siyahıda görünən hər sənəd artıq **hər iki şöbədən** viza alıb (əks halda bura düşməzdi).

### Sətrin üstünə klikləyəndə — detal (iki mənbədən)

**Mənbə 1 — sənədin özü, artıq yuxarıdakı sətirdə var:** `type`, `body`, `prepared_by`, `visas` (hansı şöbə nə vaxt, hansı qeydlə təsdiqləyib).

**Mənbə 2 — vətəndaşın məlumatları, yüklənmiş fayllar (əgər göstərmək istəyirsənsə), ayrıca sorğu lazımdır:**
```
GET /api/admin/permit-applications/{applicationId}
```
(digər bütün ekranlarda istifadə etdiyimiz eyni endpoint)

Ekranda göstərilir: müraciət edənin adı, sənədin mətni, hər iki şöbənin viza qeydi (təsdiq tarixçəsi kimi), və ən altda **"İmzala"** düyməsi.

### "İmzala" düyməsi

```
POST /api/admin/documents/{documentId}/sign
```
**Heç bir body göndərilmir** — sadəcə sənədin ID-si URL-dədir.

**Qayıdır:**
```json
{
  "status": "success",
  "message": "Sənəd imzalandı.",
  "data": {
    "id": 9,
    "status": "sent",
    "document_number": "2026/OUT-00123",
    "signed_at": "2026-07-30T14:00:00.000000Z"
  }
}
```

### İmzadan sonra — müraciət HARA gedir (sənəd növünə görə dəyişir)

Bu, vacibdir: "İmzala" basılandan sonra, **müraciətin öz statusu**, imzalanan sənədin **növünə görə** fərqli yerlərə gedir:

| Sənəd növü (`type`) | Azərbaycanca | İmzadan sonra müraciətin statusu |
|---|---|---|
| `service_letter` | Xidməti məktub | `awaiting_payment` — Ödəniş gözlənilir |
| `deficiency` | Çatışmazlıq bildirişi | `awaiting_revision` — Vətəndaşdan düzəliş gözlənilir |
| `rejection` | İmtina məktubu | `rejected` — İmtina edildi |
| `permit` | İcazə sənədi | `completed` — İcra olundu (+ QR/barkodlu rəsmi PDF avtomatik yaradılır) |

Yəni frontend, "İmzala" basıldıqdan sonra, müraciətin hansı bölməyə (Ödəniş gözləyənlər / İcra edilmişlər / s.) düşəcəyini, imzalanan sənədin `type` sahəsinə görə əvvəlcədən bilə bilər.

---

## 8. "Ödəniş təsdiqi gözləyənlər" səhifəsi

```
GET /api/admin/permit-applications?status=awaiting_payment
```
(cavab formatı 2-ci bölmədəki kimi)

Detala girib **"Ödənişi təsdiqlə"** basılanda:
```
POST /api/admin/permit-applications/{id}/confirm-payment
```
**Göndərilir** (məbləğ könüllüdür):
```json
{ "amount": 150.00 }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Ödəniş təsdiqləndi, icazə sənədi viza dövrəsinə göndərildi.",
  "data": {
    "id": 15,
    "visas": [
      { "department": { "id": 1, "name": "İqtisadiyyat şöbəsi" } },
      { "department": { "id": 2, "name": "Hüquq şöbəsi" } }
    ]
  }
}
```

> ⚠️ Bu endpoint, route-lara görə **icraçıya da** açıqdır (yalnız nazir müavininə xas deyil). Bunun qəsdən belə olub-olmadığı hələ təsdiqlənməyib.

---

## 9. Status adları (azərbaycanca göstərmək üçün)

| `status` dəyəri | Göstəriləcək ad |
|---|---|
| `registered` | Qeydiyyata alındı |
| `forwarded` | Şöbəyə yönləndirildi |
| `assigned` | İcraçı təyin olundu |
| `under_review` | Baxılmaqdadır |
| `in_document_flow` | Sənəd dövriyyəsində |
| `awaiting_payment` | Ödəniş gözlənilir |
| `awaiting_revision` | Çatışmazlığın aradan qaldırılması gözlənilir |
| `completed` | İcra olundu |
| `rejected` | İmtina edildi |
| `unprocessed` | Baxılmamış saxlanıldı |
| `suspended` | Dayandırıldı |

---

## 10. Açıq qalan suallar

1. İmtina/Dayandır düymələrinin dəqiq iş prinsipi və UI mətni (bax 6-cı bölmə).
2. `sign-queue`-nun tam cavabı hələ real sorğu ilə sınanmayıb, amma `DocumentVisaService`-in kodundan çıxan sahələr (`status`, `acted_by`, `note`, `acted_at`) etibarlı əsasa malikdir — real sınaq, format fərqindən çox, kiçik təfərrüatları (sahə adları) dəqiqləşdirəcək.
3. Ödəniş təsdiqinin icraçı ilə paylaşılması qəsdənmi (bax 8-ci bölmə).
