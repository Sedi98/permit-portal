# Admin Panel — İcraçı Rolu (Bələdçi)

Bu sənəd, `executor` (icraçı) rolu ilə daxil olan istifadəçinin admin paneldə addım-addım nə görəcəyini, hansı düymələrin olacağını, onlara basılanda nə baş verdiyini, hansı endpoint-in çağırılacağını və **həmin endpoint-in tam olaraq nə qaytardığını** izah edir.

**Ən vacib prinsip:** icraçının bir müraciətdə hansı halda olması (əsas / müştərək / nəzarət) onun nə edə biləcəyini dəyişir. Bir icraçı, bir müraciətdə əsas, başqasında müştərək ola bilər.

---

## 1. Menyu strukturu

```
Əsas səhifə
Lövhə                          → GET /api/admin/statistics
Müraciətlər
  ├─ Yeni daxil olanlar        → GET /api/admin/permit-applications?status=assigned
  ├─ İcrada olanlar            → GET /api/admin/permit-applications?status=under_review
  └─ Göndərilmişlər            → GET /api/admin/permit-applications?status=in_document_flow
```

Bu üç bənd, eyni endpoint-in fərqli status filtrləridir. İcraçı, heç bir parametr göndərməsə də, backend onu avtomatik **yalnız özünə təyin olunan** (əsas, müştərək, nəzarət) müraciətlərlə süzür — başqasının müraciətləri heç görünmür.

**`GET /permit-applications` cavabı (siyahı ekranı üçün):**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 12,
        "application_no": "2026/AA-0042",
        "applicant_full_name": "Elçin Məmmədov Ata oğlu",
        "status": "assigned",
        "submitted_at": "2026-07-30T09:00:00.000000Z",
        "permit_service": { "id": 3, "name": "..." }
      }
    ],
    "current_page": 1,
    "total": 1
  }
}
```

> ⚠️ Bir neçə statusu **birdən** filtrləmək (`?status=under_review,awaiting_revision` kimi) real sınaqla təsdiqlənməlidir — bunu bu sessiyada birlikdə sınamamışıq. Təsdiqlənməzsə, hər status üçün ayrı sorğu atılıb nəticələr frontend tərəfdə birləşdirilə bilər.

---

## 2. Müraciət detalını açanda — öz rolunu necə görəcəksən

Bir müraciətin üstünə klikləyəndə, bu endpoint çağırılır:

```
GET /api/admin/permit-applications/{id}
```

**Cavab (əlaqədar hissə):**
```json
{
  "status": "success",
  "data": {
    "id": 12,
    "application_no": "2026/AA-0042",
    "status": "assigned",
    "applicant_full_name": "Elçin Məmmədov Ata oğlu",

    "assignees": [
      {
        "user_id": 3,
        "assignment_role": "main",
        "user": { "id": 3, "name": "Səbinə Rzayeva" }
      },
      {
        "user_id": 4,
        "assignment_role": "joint",
        "user": { "id": 4, "name": "Aygün Əliyeva" }
      }
    ]
  }
}
```

**Nə etməli:** `assignees` massivində, öz `user_id`-ni (login zamanı əldə etdiyin öz ID-nlə eyni) tap. Tapdığın sətirdəki `assignment_role`-a görə, səhifənin yuxarısında bir yazı göstər:

| `assignment_role` dəyəri | Ekranda yazılacaq |
|---|---|
| `main` | Sizin rolunuz: Əsas icraçı |
| `joint` | Sizin rolunuz: Müştərək icraçı |
| `observer` | Sizin rolunuz: Nəzarət |

Bu yazı vacibdir, çünki 4-cü və 5-ci bölmələrdəki düymələr yalnız `main` olanda göstərilməlidir.

---

## 3. Ekran: "Yeni daxil olanlar" (status = `assigned`)

Detal səhifəsini açanda (`GET /permit-applications/{id}`, yuxarıdakı endpoint), bundan əlavə bu sahələr də göstərilir:

```json
{
  "data": {
    "first_name": "Vüqar", "last_name": "Həsənov", "father_name": "Kamal oğlu",
    "files": [
      { "id": 5, "original_name": "kimlik.pdf" },
      { "id": 6, "original_name": "erizeceyi.pdf" }
    ],
    "status_histories": [
      {
        "old_status": "forwarded",
        "new_status": "assigned",
        "note": "Təcili baxılsın, müştəri şikayət edib.",
        "changed_by": { "name": "Şöbə Müdiri Adı" },
        "created_at": "2026-07-30T10:00:00.000000Z"
      }
    ]
  }
}
```

Ekranda göstərilir:
- **Müraciət edənin məlumatları** (`first_name`, `last_name`, `father_name` və s.)
- **Rəhbər qeydi** — `status_histories` massivində, `new_status: "assigned"` olan sətrin `note` sahəsi. Bunu "Rəhbər qeydi" başlığı altında göstər.
- **Yüklənmiş sənədlər** (`files`) — bu ekranda yalnız baxmaq/endirmək üçün, **Qəbul/Rədd düyməsi YOXDUR.**

### Ən altda: "Baxılmağa başla" düyməsi (tək düymə)

```
POST /api/admin/permit-applications/{id}/status
```
**Göndərilir:**
```json
{ "status": "under_review" }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Müraciətin statusu dəyişdirildi.",
  "data": { "id": 12, "status": "under_review" }
}
```
Müraciət "Yeni daxil olanlar"-dan çıxıb "İcrada olanlar"-a keçir. Başqa düymə (imtina, dayandır) bu statusda göstərilməməlidir.

---

## 4. Ekran: "İcrada olanlar" (status = `under_review`)

Detal səhifəsi 3-cü bölmə ilə eynidir, **əlavə olaraq**, hər sənədin yanında (yalnız **əsas** icraçıya görünən) iki düymə var.

### "Qəbul et"

```
POST /api/admin/permit-applications/{id}/files/{fileId}/review
```
**Göndərilir:**
```json
{ "review_status": "accepted" }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Sənəd işarələndi.",
  "data": { "id": 5, "review_status": "accepted", "review_note": null }
}
```

### "Rədd et"

Əvvəlcə səbəb yazmaq üçün sahə açılır (məcburi). Sonra:
```
POST /api/admin/permit-applications/{id}/files/{fileId}/review
```
**Göndərilir:**
```json
{ "review_status": "rejected", "review_note": "Şəkil aydın deyil, yenidən yüklənməlidir." }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Sənəd işarələndi.",
  "data": { "id": 6, "review_status": "rejected", "review_note": "Şəkil aydın deyil, yenidən yüklənməlidir." }
}
```

Rədd edilən sənədlərin səbəbi, "Çatışmazlıq" növlü sənəd hazırlananda avtomatik o sənədin mətninə əlavə olunur.

**Yalnız əsas icraçı:** müştərək/nəzarət bu iki düyməni basmağa çalışsa, backend `404` qaytarır (müraciəti "tapmır").

---

## 5. "Sənəd hazırla" (yalnız əsas icraçı, "İcrada olanlar"da ən altda)

Basılanda forma açılır: **Sənəd növü** (dropdown) + **Mətn** (yazı sahəsi).

```
POST /api/admin/permit-applications/{id}/documents
```
**Göndərilir:**
```json
{ "type": "deficiency", "body": "Aşağıdakı sənədlərdə çatışmazlıq var..." }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Sənəd hazırlandı və viza dövrəsinə göndərildi.",
  "data": {
    "id": 9,
    "type": "deficiency",
    "status": "draft",
    "visas": [
      { "department": { "id": 1, "name": "İqtisadiyyat şöbəsi" } },
      { "department": { "id": 2, "name": "Hüquq şöbəsi" } }
    ]
  }
}
```

> ⚠️ **Dropdown-un tam seçim siyahısı** (`type` sahəsinin bütün mümkün dəyərləri) hələ təsdiqlənməyib — `deficiency` (çatışmazlıq) və `permit` (icazə) dəqiqdir, tam siyahı `PrepareDocumentRequest` faylı görüləndə əlavə olunacaq.

Göndəriləndən sonra, avtomatik olaraq:
- Müraciətin statusu `under_review` → `in_document_flow` olur.
- Sənəd, viza verən **bütün** şöbələrə paralel göndərilir (yuxarıdakı nümunədə görünən `visas` massivi bunu göstərir) — icraçı hansı şöbəyə gedəcəyini seçmir.

Müraciət indi "Göndərilmişlər" bölməsinə keçir.

---

## 6. Ekran: "Göndərilmişlər" (status = `in_document_flow`, `awaiting_payment`, `completed`, `rejected`)

```
GET /api/admin/permit-applications?status=in_document_flow
```
(cavab formatı 1-ci bölmədəki kimidir)

Adətən əməliyyat düyməsi yoxdur — sadəcə baxış. (İstisna ola bilər: ödəniş təsdiqi, bax 10-cu bölmə.)

---

## 7. Status keçidləri — xülasə cədvəl

| Keçid | Necə edilir | Endpoint |
|---|---|---|
| `assigned` → `under_review` | "Baxılmağa başla" düyməsi | `POST /status` |
| `under_review` → `in_document_flow` | "Sənəd hazırla" (avtomatik yan-effekt) | `POST /documents` |
| `under_review` → `awaiting_revision` | Çatışmazlıq axını | `POST /status` |
| `awaiting_revision` → `under_review` | Vətəndaş düzəlişdən sonra | `POST /status` |

---

## 8. Müştərək və Nəzarət icraçı

Eyni menyunu, eyni siyahını, eyni müraciət detalını (2-ci bölmədəki nişanla birlikdə) görürlər. Fərq yalnız düymələrdədir: 4-cü və 5-ci bölmədəki düymələri **görmürlər/basa bilmirlər.**

Hazırda müştərək və nəzarət arasında **davranış fərqi yoxdur** — hər ikisi yalnız baxır. (Spesifikasiyaya görə, müştərək icraçı gələcəkdə "rəy vermə" funksiyası alacaq — bu, hələ qurulmayıb, sonraya saxlanılıb.)

---

## 9. Status adları (azərbaycanca göstərmək üçün)

| `status` dəyəri | Göstəriləcək ad |
|---|---|
| `assigned` | İcraçı təyin olundu |
| `under_review` | Baxılmaqdadır |
| `in_document_flow` | Sənəd dövriyyəsində |
| `awaiting_payment` | Ödəniş gözlənilir |
| `awaiting_revision` | Çatışmazlığın aradan qaldırılması gözlənilir |
| `completed` | İcra olundu |
| `rejected` | İmtina edildi |

---

## 10. Açıq qalan suallar

1. **Sənəd növlərinin tam siyahısı** — dropdown üçün dəqiqləşdirilməlidir.
2. **Çoxsaylı status filtri** (`?status=a,b`) — real sınaqla təsdiqlənməlidir.
3. **"Baxılmağa başla" və "Sənəd hazırla"nı yalnız əsas icraçı etməlidirmi?** Hazırda status dəyişmə (bölmə 3) müştərək/nəzarətə də texniki olaraq açıqdır.
4. **Ödənişi kim təsdiqləyir** — icraçı, nazir müavini, yoxsa hər ikisi?
