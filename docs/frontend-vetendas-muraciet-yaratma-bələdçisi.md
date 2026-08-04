# Vətəndaş Portalı — Müraciət Yaratma Axını (Addım-addım)

Fiziki şəxsin, mygov ID ilə giriş etdikdən sonra, müraciət yaradana qədər keçdiyi bütün yol.


<!-- burda  ana sehifede icazelerin gosterilmesi endpointi nezerde tutulur addim 0 icazeni getirmek -->
---
## ADDIM 0 — 15 İcazəni gətirmək

```
GET /api/permit-services
```

**Cavab (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "code": "PS-001",
      "name": "İxrac nəzarəti haqqında...",
      "slug": "ixrac-nezareti",
      "category": "permit",
      "category_label": "İcazə",
      "is_active": true
    },
    {
      "id": 15,
      "code": "PS-015",
      "name": "...",
      "category": "certificate",
      "category_label": "Şəhadətnamə",
      "is_active": true
    }
  ]
}
```

**15 icazənidə buradan götürüb, Id-lərini görə bilərsən.**

## ADDIM 1 — İcazə seçimi

**Ekran:** vətəndaş saytda 15 icazədən birini seçir, **"Müraciət et"** düyməsinə basır.

**Sonra:** kiçik bir seçim çıxır — **"Fiziki şəxs" / "Hüquqi şəxs"**. Vətəndaş **"Fiziki şəxs"** seçir və **"Müraciət et"** basır.

**Backend-ə sorğu:**
```
POST /api/permit-applications
Authorization: Bearer {token}
```
```json
{
  "permit_service_id": 3,
  "applicant_type": "physical"
}
```

**Cavab (201):**
```json
{
  "status": "success",
  "message": "Qaralama yaradıldı.",
  "data": {
    "id": 42,
    "status": "draft",
    "permit_service_id": 3,
    "applicant_type": "physical",
    "fin": "2G6N0NQ",
    "first_name": "ÜLVİ",
    "last_name": "ƏLİLİ",
    "father_name": "NATİQ OĞLU",
    "email": null
  }
}
```

**Frontend nə etməlidir:** `data.id` (burada `42`) yadda saxlanılır — bundan sonrakı **bütün** sorğularda bu ID işlədiləcək.

**Açılan səhifə:** Addım 2 (Şəxsiyyət məlumatları).

---

## ADDIM 2 — Şəxsiyyət məlumatları (1/6)

**Ekranda göstərilir** (Addım 1-in cavabından, əlavə sorğu YOXDUR):
```
FİN:       2G6N0NQ
Ad:        ÜLVİ
Soyad:     ƏLİLİ
Ata adı:   NATİQ OĞLU
```
Bunlar **oxunan mətndir, input deyil** — vətəndaş dəyişə bilmir, sadəcə baxır.

**Düymə:** "İrəli"

**Backend-ə sorğu:** **YOXDUR.** Bu addımda saxlanılacaq bir şey yoxdur, məlumat artıq bazadadır.

**Açılan səhifə:** Addım 3 (Əlaqə məlumatları).

---

## ADDIM 3 — Əlaqə məlumatları (2/6)

**Ekranda:** mobil nömrə(lər) üçün inputlar (maksimum 3), e-poçt üçün input.

**Düymə:** "İrəli"

**Backend-ə sorğu:**
```
PUT /api/permit-applications/42
Authorization: Bearer {token}
```
```json
{
  "email": "vetendas@mail.az",
  "phones": [
    { "phone": "+994705495589" },
    { "phone": "+994551234567" }
  ]
}
```

**Cavab (200):**
```json
{
  "status": "success",
  "message": "Məlumatlar saxlanıldı.",
  "data": {
    "id": 42,
    "email": "vetendas@mail.az",
    "phones": [
      { "id": 1, "phone": "+994705495589" },
      { "id": 2, "phone": "+994551234567" }
    ]
  }
}
```

**Xəta halı (422):**
```json
{
  "message": "Verilən məlumatlar düzgün deyil.",
  "errors": { "phones.0.phone": ["Mobil telefon nömrəsi +994XXXXXXXXX formatında olmalıdır."] }
}
```

**Açılan səhifə:** Addım 4 (Əməliyyat və mal məlumatları).

---

## ADDIM 4 — Əməliyyat və mal məlumatları (3/6)

> Bu addım **yalnız `permit_service_id = 1`** olan icazə üçündür. Digər icazələrdə bu addım atlanır, birbaşa Addım 5-ə keçilir.

**Ekranda:** əməliyyat növü (dropdown), mal kateqoriyası (3 radio seçimdən biri), malın adı və həcmi (mətn sahəsi).

**Düymə:** "İrəli"

**Backend-ə sorğu:**
```
PUT /api/permit-applications/42
```
```json
{
  "trade_detail": {
    "operation_type": "import",
    "goods_category": "Nüvə materialları, texnologiyaları, qurğuları, radioaktiv ionlaşdırıcı şüa mənbələri və izotoplar, partlayıcı maddələr və vasitələr",
    "goods_name_volume": "500 ədəd, 2 ton"
  }
}
```

`operation_type` mümkün dəyərləri: `export`, `import`, `re_export`, `re_import`, `transit`

**Cavab (200):**
```json
{
  "status": "success",
  "message": "Məlumatlar saxlanıldı.",
  "data": {
    "id": 42,
    "trade_detail": {
      "operation_type": "import",
      "goods_category": "Nüvə materialları...",
      "goods_name_volume": "500 ədəd, 2 ton"
    }
  }
}
```

**Açılan səhifə:** Addım 5 (Sənədlər).

---

## ADDIM 5 — Sənədlərin yüklənməsi (4/6)

**Ekranda:** hər tələb olunan sənəd üçün ayrıca yükləmə qutusu (Müraciət ərizəsi, VÖEN şəhadətnaməsi, Texniki spesifikasiya və s.).

**Vacib:** hər fayl **seçilən kimi, dərhal** yüklənir (proqres göstəricisi ilə) — "İrəli" gözlənilmir.

**Hər fayl üçün backend-ə sorğu:**
```
POST /api/permit-applications/42/files
Authorization: Bearer {token}
Content-Type: multipart/form-data
```
```
document_type: muraciet_arizasi
file: (PDF faylı, maksimum 10MB)
```

**Cavab (201):**
```json
{
  "status": "success",
  "message": "Fayl uğurla yükləndi.",
  "data": {
    "id": 7,
    "document_type": "muraciet_arizasi",
    "original_name": "erize.pdf",
    "size": 643072,
    "review_status": "pending"
  }
}
```
Frontend, `data.id`-ni saxlayır (silmək/dəyişmək üçün lazımdır).

**Faylı dəyişmək** (yenidən yükləmə ikonası):
```
PUT /api/permit-applications/42/files/7
```
```
file: (yeni PDF)
```

**Faylı silmək** (zibil qutusu):
```
DELETE /api/permit-applications/42/files/7
```
Cavab: `{ "status": "success", "message": "Fayl silindi." }`

**Düymə:** "İrəli" → backend-ə sorğu **YOXDUR** (fayllar onsuz da yüklənib).

**Açılan səhifə:** Addım 6 (Nəzərdən keçir).

---

## ADDIM 6 — Nəzərdən keçir (5/6)

**Ekranda:** indiyə qədər daxil edilmiş bütün məlumatların xülasəsi.

**Backend-ə sorğu (məlumatı təzələmək üçün):**
```
GET /api/permit-applications/42
Authorization: Bearer {token}
```

**Cavab (200):**
```json
{
  "status": "success",
  "data": {
    "id": 42,
    "status": "draft",
    "fin": "2G6N0NQ",
    "first_name": "ÜLVİ",
    "last_name": "ƏLİLİ",
    "father_name": "NATİQ OĞLU",
    "email": "vetendas@mail.az",
    "phones": [{ "phone": "+994705495589" }],
    "trade_detail": { "operation_type": "import", "...": "..." },
    "permit_service": { "id": 3, "name": "..." }
  }
}
```

> Fayl siyahısı bu cavabda **gəlmir** — ayrıca çağır: `GET /api/permit-applications/42/files`

**Düymə:** "İrəli"

**Açılan səhifə:** Addım 7 (Təsdiq).

---

## ADDIM 7 — Təsdiq və göndərmə (6/6)

**Ekranda:** "Müraciəti göndərməyə razısınız?" + xülasə.

**Düymə:** "Göndər"

**Backend-ə sorğu:**
```
POST /api/permit-applications/42/submit
Authorization: Bearer {token}
```
**Body YOXDUR** — boş sorğudur.

**Uğurlu cavab (200):**
```json
{
  "status": "success",
  "message": "Müraciət uğurla göndərildi.",
  "data": {
    "id": 42,
    "status": "registered",
    "application_no": "İ-14/2026",
    "submitted_at": "2026-08-02T10:15:00.000000Z"
  }
}
```

**Natamam olsa (422):**
```json
{
  "status": "error",
  "message": "Müraciət natamamdır, bütün addımları tamamlayın.",
  "errors": {
    "email": "Daxil edilməlidir.",
    "phones": "Ən azı bir nömrə lazımdır.",
    "files": "Ən azı bir sənəd yüklənməlidir."
  }
}
```

**Açılan səhifə:** "Müraciət göndərildi!" ekranı — `application_no` və `status` göstərilir, "Müraciətlərimə keç" / "Ana səhifəyə qayıt" düymələri ilə.

---

## Vətəndaş yarımçıq çıxsa nə olur

Draft, Addım 1-də **artıq yaradılıb** — vətəndaş istənilən addımda brauzeri bağlasa, ona qədər saxlanılan məlumat **itmir.**

**"Qaralamalar" səhifəsi:**
```
GET /api/permit-applications?status=draft
```
Hər sətirdə: icazə növü adı, son dəyişiklik tarixi (`updated_at`).

**"Davam et" basılanda:** `GET /api/permit-applications/{id}` çağırılır, forma dolu sahələrlə yenidən açılır.

**Zibil qutusu: (Qaralamadaki müraciəti silmək butonu)**
```
DELETE /api/permit-applications/{id}
```

---
 
## "Müraciətlərimə keç" — göndərilmiş müraciətlərin siyahısı
 
Vətəndaş, göndərdiyi (artıq `draft` olmayan) bütün müraciətlərini burada görür — "Müraciət göndərildi!" ekranındakı "Müraciətlərimə keç" düyməsi, həm də saytın öz menyusundakı "Müraciətlərim" bəndi, bura aparır.
 
```
GET /api/permit-applications
Authorization: Bearer {token}
```
 
**Cavab (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 42,
      "application_no": "İ-14/2026",
      "status": "under_review",
      "submitted_at": "2026-08-02T10:15:00.000000Z",
      "permit_service": { "id": 3, "name": "..." },
      "assigned_user": null
    },
    {
      "id": 39,
      "application_no": "İ-9/2026",
      "status": "completed",
      "submitted_at": "2026-07-20T09:00:00.000000Z",
      "permit_service": { "id": 7, "name": "..." }
    }
  ]
}
```
 
Hər sətirdə göstərilir: müraciət nömrəsi, icazə növü (`permit_service.name`), status (bax status adları cədvəli, əvvəlki bələdçilərdə), göndərilmə tarixi.
 
### ⚠️ Diqqət — bu siyahı, DRAFT-ları da qaytara bilər
 
`GET /permit-applications`, heç bir `status` parametri göndərilməsə, vətəndaşın **bütün** müraciətlərini (draft daxil) qaytarır — backend-də "draft-ları çıxar" kimi ayrıca bir filtr **yoxdur.**
 
Yəni "Müraciətlərim" səhifəsində, **yalnız göndərilmiş olanları** göstərmək istəyirsənsə (draft-lar öz "Qaralamalar" bölməsində qalsın deyə), frontend, cavabdakı massivdən, `status === "draft"` olan sətirləri **özü, client tərəfdə süzməlidir** — backend bunu etmir.
 
### Status üzrə tab/filtr istəsən
 
Eyni endpoint, `?status=` ilə də çağırıla bilər (məsələn "Tamamlanmışlar" tabı üçün):
```
GET /api/permit-applications?status=completed
```
 
### Bir sətrin üstünə klikləyəndə — detal
 
```
GET /api/permit-applications/{id}
```
Bu, Addım 6-da ("Nəzərdən keçir") istifadə etdiyimiz **eyni** endpoint-dir (bax yuxarı) — cavab formatı eynidir. Unutma: fayl siyahısı bu cavabda **gəlmir**, ayrıca çağırılmalıdır: `GET /api/permit-applications/{id}/files`.
 
---

## Heç vaxt göndərilməməli sahələr

`PUT` sorğusunda bunları göndərmə — backend onları **görməzdən gəlir**, heç bir təsiri olmayacaq:

- `fin`, `first_name`, `last_name`, `father_name` — Addım 1-də, backend özü, mygov ID məlumatından yazıb
- `applicant_type` — Addım 1-də, bir dəfə seçilib, dəyişdirilə bilmir (fikrini dəyişsə, draftı silib yenisini yaratmalıdır)
