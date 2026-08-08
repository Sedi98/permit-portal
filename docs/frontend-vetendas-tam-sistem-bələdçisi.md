# Vətəndaş Portalı — Tam Sistem Bələdçisi (Yenilənmiş İş Axını)

Bu sənəd, vətəndaşın, giriş etdikdən sonra, **bütün** portalda nə görəcəyini, hansı düymələrin olacağını, onlara basılanda nə baş verdiyini izah edir.

> **Giriş və "Yeni müraciət" haqqında:** bunlar, ayrıca sənədlərdə, ətraflı izah olunub — `frontend-vetendas-mygov-id-giris-bələdçisi.md` və `frontend-vetendas-muraciet-yaratma-bələdçisi.md`. Bu sənəd, onları təkrarlamır, **onlardan sonra** gələn hər şeyi (müraciətin, göndərildikdən sonra keçdiyi bütün yol) əhatə edir.

---

## 1. Sol menyu — altı səhifə

### 1.1. Qaralamalar

```
GET /api/permit-applications?status=draft
```
Yarımçıq, hələ göndərilməmiş müraciətlər. "Davam et" — bax, "Müraciət Yaratma Bələdçisi".

### 1.2. Tamamlanmamış müraciətlər

```
GET /api/permit-applications?status_group=in_progress
```
Göndərilmiş, hələ prosesdə olan (nə tamamlanmış, nə imtina olunmuş) hər şey.

### 1.3. Tamamlanmış müraciətlər (icazələr)

```
GET /api/permit-applications?status=completed
```
Bax, 6-cı bölmə — bura düşən hər müraciətin, QR-lı sənədi endirmək düyməsi var.

### 1.4. Çatışmazlıq haqqında bildiriş

```
GET /api/permit-applications?status=awaiting_revision
```
Bura düşən hər müraciətin, bildiriş mətni və fayl dəyişmə imkanı var — bax, 4-cü bölmə.

### 1.5. Ödəniş Tapşırığı / Daxil olanlar

```
GET /api/permit-applications?status=awaiting_payment
```
Bura düşən hər müraciətin, hesab-fakturası və "Ödəniş et" düyməsi var — bax, 5-ci bölmə.

### 1.6. Ödəniş tarixçəsi

```
GET /api/permit-applications?status_group=payment_history
```
Bu, **statusa görə yox**, "heç vaxt ödəniş edilibmi?" sualına görə süzülür — yəni, artıq `payment_review`/`awaiting_signature`/`completed` mərhələsinə keçmiş müraciətlər də, ödəniş etdiyi üçün, **bu siyahıda qalmağa davam edir.** Hər sətirdə: `invoice_no`, `payment_amount`, `paid_at`.

---

## 2. Bir müraciətin üstünə klikləyəndə — detal

```
GET /api/permit-applications/{id}
```

**Cavab (tam):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "status": "awaiting_revision",
    "application_no": "D/O-İ-V-1/2026",
    "email": "vetendas@test.az",
    "payment_amount": null,
    "invoice_no": null,
    "phones": [{ "phone": "+994509987187" }],
    "permit_service": { "id": 3, "name": "..." },
    "confirmationSequences": [
      {
        "id": 1,
        "type": "deficiency",
        "title": null,
        "body": "İdxal/İxrac müqaviləsinin surəti aydın deyil, yenidən yüklənməlidir.",
        "status": "completed"
      }
    ],
    "documents": [],
    "status_histories": [ ... ]
  }
}
```

**Ekranda, statusdan asılı olmayaraq, HƏMİŞƏ göstərilir:** müraciət nömrəsi, icazə növü, status (bax 4-cü bölmə, adları cədvəli).

**Fayl siyahısı, bu cavabda YOXDUR** — ayrıca çağırılmalıdır: `GET /permit-applications/{id}/files`.

---

<!-- Müraciət kartı elementinin alt sağ tərəfi nəzərdə tutulur  -->
## 3. Status-a görə, ekranın altında nə var

| Status | Ekranın altında | Bax |
|---|---|---|
| `draft` | "Davam et" (formaya qayıdır) | Yaratma bələdçisi |
| `registered`, `assigned`, `report_confirmation`, `payment_confirmation`, `payment_review`, `awaiting_signature` | **Heç nə** — sadəcə "Prosesdədir" mesajı | — |
| `awaiting_revision` | Çatışmazlıq bildirişi + fayl dəyişmə | 4-cü bölmə |
| `awaiting_payment` | Hesab-faktura + "Ödəniş et" | 5-ci bölmə |
| `completed` | QR-lı sənədi endir | 6-cı bölmə |

**Ortadakı statuslarda ("Prosesdədir"), heç bir düymə göstərmə** — bunlar, admin tərəfin öz daxili iş mərhələləridir, vətəndaşın edəcəyi bir şey yoxdur.

---

## 4. Çatışmazlıq haqqında bildiriş (`status: awaiting_revision`)

### Bildirişin mətni — 2-ci bölmədəki cavabdan

`confirmationSequences` massivində, `type: "deficiency"` olan sətrin `body`-si — bunu, "Çatışmazlıq" adlı bir bölmədə göstər.

### Yüklənmiş sənədlər — YALNIZ rədd edilən qarşısında "Dəyiş"

```
GET /permit-applications/{id}/files
```
Hər faylın öz `review_status`-u var. Frontend, **yalnız** `review_status: "rejected"` olanların qarşısında, **"Dəyiş"** düyməsi göstərir (`accepted` olanların qarşısında, heç bir düymə yoxdur).

### "Dəyiş" basılanda

> ⚠️ PHP, əsl `PUT` sorğularında fayl oxumur — `_method: PUT` hiyləsi lazımdır.

```
POST /permit-applications/{id}/files/{fileId}
```
```
form-data:
_method: PUT
file: (yeni PDF)
```
**Nəticə:** faylın `review_status`-u, avtomatik, yenidən **`pending`**-ə düşür.

### Ən altda — "Yenidən Göndər"

```
POST /permit-applications/{id}/resubmit
```
**Body yoxdur.**

**Cavab (200):**
```json
{
  "status": "success",
  "message": "Müraciət yenidən göndərildi.",
  "data": { "id": 1, "status": "assigned" }
}
```

**Diqqət:** `application_no` **dəyişmir.** Müraciət, **direkt**, əvvəlki icraçıya (nazir müavininə yox) düşür — vətəndaş, bunu izləmir, sadəcə bilməli olduğu, statusun `assigned`-ə keçdiyidir.

---

## 5. Ödəniş Tapşırığı (`status: awaiting_payment`)

### Hesab-faktura — 2-ci bölmədəki cavabdan

`invoice_no` və `payment_amount` sahələri, artıq, detal cavabında var — ayrıca sorğu lazım deyil.

### Ən altda — "Ödəniş et"

> ⚠️ İlkin versiyada, real ASAN Pay YOXDUR — bu düymə, sadəcə, "ödəndi" işarəsi qoyur.

```
POST /permit-applications/{id}/pay
```
**Body yoxdur.**

**Cavab (200):**
```json
{
  "status": "success",
  "message": "Ödəniş qeydə alındı.",
  "data": { "id": 1, "status": "payment_review", "paid_at": "..." }
}
```

Bundan sonra, müraciət, icraçının yoxlamasını gözləyir (vətəndaş tərəfdə, heç bir əlavə hərəkət yoxdur).

---

## 6. Tamamlanmış — QR-lı sənədi endirmək

### Sənədin ID-sini tap — 2-ci bölmədəki cavabdan

`documents` massivi (`status: completed` olanda, artıq boş deyil):
```json
"documents": [
  {
    "id": 1,
    "document_number": "...",
    "generated_at": "..."
  }
]
```

### Endir

```
GET /permit-applications/{id}/documents/{documentId}/download
```
(`documentId` — yuxarıdakı `documents[0].id`)

Bu, birbaşa, PDF faylının özünü qaytarır (brauzer, "yadda saxla" dialoqu açır).

---

## 7. Status adları (azərbaycanca göstərmək üçün)

| `status` dəyəri | Göstəriləcək ad |
|---|---|
| `draft` | Qaralama |
| `registered` | Qeydiyyata alındı |
| `assigned` | İcraçıya həvalə edilib |
| `deficiency_confirmation` | Çatışmazlıq bildirişi hazırlanır |
| `awaiting_revision` | Düzəliş gözlənilir |
| `report_confirmation` | Baxılır |
| `payment_confirmation` | Ödəniş tapşırığı hazırlanır |
| `awaiting_payment` | Ödəniş gözlənilir |
| `payment_review` | Ödəniş yoxlanılır |
| `awaiting_signature` | Rəsmiləşdirilir |
| `completed` | İcazə verildi |

---
