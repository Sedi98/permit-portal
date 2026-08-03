# Admin Panel — Şöbə Müdiri Rolu (Bələdçi)

Bu sənəd, `department_head` rolu ilə daxil olan istifadəçinin admin paneldə addım-addım nə görəcəyini, hansı düymələrin olacağını, onlara basılanda nə baş verdiyini və hər addımda hansı endpoint-in çağırılacağını izah edir.

**Şöbə müdirinin iki, bir-birindən AYRI məsuliyyəti var:**
1. Öz şöbəsinə yönləndirilən müraciətlərə icraçı təyin etmək.
2. Öz şöbəsinə viza üçün gələn sənədləri təsdiqləmək/geri qaytarmaq.

Bunlar **fərqli ekranlardır** — 2-ci məsuliyyət, 1-ci ilə eyni müraciətə aid olmaya bilər (viza, icraçının hazırladığı sənəd üzərindən, viza verən HƏR şöbəyə paralel gedir, təkcə həmin müraciəti təyin edən şöbə müdirinə yox).

---

## 1. Menyu

```
Əsas səhifə
Lövhə                                → GET /api/admin/statistics
Müraciətlər
  ├─ Yeni (icraçı təyini gözləyir)   → GET /api/admin/permit-applications?status=forwarded
  ├─ İcrada olanlar                  → ?status=assigned / under_review / in_document_flow
  └─ İcra edilmişlər                 → ?status=completed
Viza gözləyən sənədlər               → GET /api/admin/visa-queue
```

**Vacib:** şöbə müdiri, heç bir parametr göndərmədən, avtomatik olaraq yalnız **öz şöbəsinə** aid müraciətləri görür (`GET /statistics` da eyni qaydada öz şöbəsinə görə süzülür).

---

## 2. "Yeni" siyahısını açanda

```
GET /api/admin/permit-applications?status=forwarded
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
        "status": "forwarded",
        "submitted_at": "2026-07-30T09:00:00.000000Z",
        "permit_service": { "id": 3, "name": "..." }
      }
    ],
    "total": 4
  }
}
```

---

## 3. Bir sətrin üstünə klikləyəndə — detal

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
    "status": "forwarded",
    "applicant_full_name": "Elçin Məmmədov Ata oğlu",
    "department_id": 1,
    "files": [
      { "id": 1, "original_name": "sened1.pdf" }
    ],
    "status_histories": [
      {
        "old_status": "registered", "new_status": "forwarded",
        "note": "Təcili baxılsın.",
        "changed_by": { "name": "Nazir Müavini Adı" },
        "created_at": "..."
      }
    ]
  }
}
```

Ekranda göstərilir: müraciət edənin məlumatları, yüklənmiş sənədlər (baxmaq üçün), nazir müavininin yönləndirmə qeydi (`status_histories`-dəki `note`).

**Bu statusda YALNIZ BİR düymə olmalıdır: "İcraçı təyin et".** Status keçid qaydalarına görə, `forwarded`-dan başqa heç bir hərəkət (imtina, dayandırma) şöbə müdirinə aid deyil.

---

## 4. "İcraçı təyin et" düyməsi

Basılanda, forma açılır. Dropdown-u doldurmaq üçün:

```
GET /api/admin/executors
```
**Qayıdır** (avtomatik olaraq yalnız öz şöbənin icraçıları ilə):
```json
{
  "status": "success",
  "data": [
    { "id": 3, "name": "Elçin Məmmədov", "fin": "1234567", "department_id": 1 },
    { "id": 4, "name": "Aygün Əliyeva", "fin": "2345678", "department_id": 1 }
  ]
}
```

İstifadəçi UI-də istərsə addım-addım irəliləsin (əvvəl əsas icraçını seç, sonra qalanlardan müştərək/nəzarət seç) — bu, əla UX-dir. Amma **"Yönləndir" düyməsi basılanda, hamısı BİR dəfəyə, tək bir sorğuda göndərilir:**

```
POST /api/admin/permit-applications/{id}/assign
```
**Göndərilir:**
```json
{
  "assignees": [
    { "user_id": 3, "assignment_role": "main" },
    { "user_id": 4, "assignment_role": "joint" }
  ],
  "note": "Təcili baxılsın, müştəri şikayət edib."
}
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "İcraçılar təyin edildi.",
  "data": {
    "id": 12,
    "status": "assigned",
    "assignees": [
      { "user_id": 3, "assignment_role": "main", "user": { "id": 3, "name": "Elçin Məmmədov" } },
      { "user_id": 4, "assignment_role": "joint", "user": { "id": 4, "name": "Aygün Əliyeva" } }
    ]
  }
}
```

**Sahələrin izahı:**

| Sahə | Qeyd |
|---|---|
| `assignees[].user_id` | İcraçının ID-si (yuxarıdakı dropdown-dan) |
| `assignees[].assignment_role` | `main` (əsas), `joint` (müştərək), `observer` (nəzarət) |
| `note` | **Tək, ümumi qeyd** — bütün əməliyyata aiddir, konkret icraçıya yox |

**Validasiya xətası (422) verə biləcək hallar:**
- Dəqiq **bir** `main` seçilməyibsə (heç, ya bir neçə).
- Eyni icraçı təkrar seçilibsə.
- Seçilən icraçılardan biri **başqa şöbəyə** aiddirsə (xəta mesajında adı ilə birlikdə göstərilir).

### ⚠️ Bilinən məhdudiyyət

Spesifikasiyaya görə, əsas icraçı, sənədi viza mərhələsinə göndərəndə YENİDƏN müştərək icraçı əlavə edə bilməlidir. **Bu, hələ qurulmayıb** — sistem yalnız bu ilkin, bir dəfəlik təyinatı dəstəkləyir.

---

## 5. "Viza gözləyən sənədlər" səhifəsini açanda — siyahı

```
GET /api/admin/visa-queue
```
> ⚠️ Cavabın tam sahə strukturu (`document_visas` cədvəlinin bütün sahələri) real sınaqla təsdiqlənməyib. Məlum olan sahələr: `id`, `status`, və yüklənən əlaqələr — `document.application.permitService`, `department`.

**Gözlənilən görünüş (qismən təsdiqlənmiş):**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 3,
        "status": "pending",
        "document": {
          "id": 9,
          "type": "deficiency",
          "body": "Aşağıdakı sənədlərdə çatışmazlıq aşkarlanmışdır...",
          "application": {
            "id": 12,
            "application_no": "2026/AA-0042",
            "permit_service": { "name": "Tikinti icazəsi" }
          }
        },
        "department": { "id": 1, "name": "İqtisadiyyat şöbəsi" }
      }
    ]
  }
}
```

Bu ekranda **yalnız cədvəl** göstərilir, hər sətirdə:

| Sütun | Haradan gəlir |
|---|---|
| Müraciət nömrəsi | `document.application.application_no` |
| İcazə növü | `document.application.permit_service.name` |
| Sənəd növü | `document.type` |

Status sütununa ehtiyac yoxdur — bu siyahıda olan hər sənəd artıq "gözləyən" statusundadır. Sətirlərdə vətəndaşın adı, telefonu, yüklədiyi fayllar **göstərilmir** — bunlar yalnız detala girəndə (6-cı bölmə) əlavə sorğu ilə gəlir.

---

## 6. Sətrin üstünə klikləyəndə — detal (İKİ mənbədən birləşən ekran)

Diqqət: bu ekranı qurmaq üçün **iki ayrı sorğu** lazımdır, çünki `visa-queue` müraciətin tam məlumatını (fayllar daxil) vermir.

**Mənbə 1 — sənədin özü (mətn), artıq 5-ci bölmədəki sətirdə var, təkrar sorğuya ehtiyac yoxdur:**
`document.type`, `document.body` — sənin təsdiqləyəcəyin əsl mətn budur.

**Mənbə 2 — müraciətin tam detalı (vətəndaş, yüklənmiş fayllar), ayrıca çağırılmalıdır:**
```
GET /api/admin/permit-applications/{applicationId}
```
(`applicationId` — 5-ci bölmədəki sətirdən, `document.application.id`)

**Qayıdır** (digər bütün ekranlarda istifadə etdiyimiz eyni endpoint, eyni format):
```json
{
  "status": "success",
  "data": {
    "id": 12,
    "applicant_full_name": "Elçin Məmmədov Ata oğlu",
    "first_name": "Elçin", "last_name": "Məmmədov",
    "phones": [ { "phone": "0501234567" } ],
    "files": [
      { "id": 1, "original_name": "sened1.pdf" }
    ]
  }
}
```

### Ekranın görünüşü — iki mənbə birləşir

```
┌─────────────────────────────────────┐
│  Müraciət edən: Elçin Məmmədov        │  ← Mənbə 2
│  İcazə növü: Tikinti icazəsi          │  ← Mənbə 2
│  Yüklənmiş sənədlər: [sened1.pdf]     │  ← Mənbə 2 (baxmaq/endirmək üçün)
│                                        │
│  ── Baxılan sənəd (viza üçün) ──       │
│  Növ: Çatışmazlıq                     │  ← Mənbə 1
│  Mətn: "Aşağıdakı sənədlərdə..."       │  ← Mənbə 1
│                                        │
│         [ Viza ver ]   [ Geri qaytar ] │
└─────────────────────────────────────┘
```

---

## 7. Ən altda — iki düymə

### "Viza ver"

```
POST /api/admin/visas/{visaId}/approve
```
**Göndərilir** (qeyd könüllüdür):
```json
{ "note": "Uyğundur." }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Viza verildi.",
  "data": { "id": 3, "status": "approved", "document": { "id": 9, "...": "..." } }
}
```

### "Geri qaytar" (etiraz)

```
POST /api/admin/visas/{visaId}/return
```
**Göndərilir** (qeyd **məcburidir** — səbəbsiz geri qaytarma qəbul edilmir):
```json
{ "note": "Ünvan sənədi ilə uyğun gəlmir, düzəldilməlidir." }
```
**Qayıdır:**
```json
{
  "status": "success",
  "message": "Sənəd geri qaytarıldı.",
  "data": { "id": 3, "status": "returned", "document": { "id": 9, "...": "..." } }
}
```

**Hər iki düymədə:** viza artıq öz şöbəsinə aid deyilsə (`404`), ya da artıq emal edilibsə (`422`), uyğun xəta qayıdır.

---

## 8. "Viza ver" / "Geri qaytar" — müraciətin özünə təsiri

Bu, frontend üçün vacibdir, çünki **düymə basıldıqdan sonra müraciət hara "yoxa çıxır"** sualının cavabıdır.

### Hər iki şöbə "Viza ver" desə

1. Bir şöbə (məs. İqtisadiyyat) "Viza ver" edir → **yalnız onun öz viza qeydi** təsdiqlənir. **Müraciətin statusu dəyişmir** — `in_document_flow` olaraq qalır.
2. İkinci şöbə (Hüquq) də "Viza ver" edir → indi **hər iki** şöbə təsdiqləyib. **Sənədin** (müraciətin yox!) öz statusu dəyişir, nazir müavininin "İmza gözləyən sənədlər" siyahısına düşür.
3. Müraciətin öz statusu, bütün bu proses boyu, **heç dəyişmədən** `in_document_flow` olaraq qalır — frontend, müraciətin özündə status dəyişikliyi gözləməsin.

**Yalnız bir şöbə edibsə, digəri hələ etməyibsə:** heç bir görünən dəyişiklik olmur, sənəd sadəcə ikinci şöbənin hərəkətini gözləyir.

### Bir şöbə "Geri qaytar" desə

1. Hansı şöbə edirsə, onun öz viza qeydi "geri qaytarıldı" olur.
2. **Müraciətin statusu `under_review`-a düşür** — icraçının "İcrada olanlar" siyahısına geri qayıdır.
3. İcraçı, müraciəti açanda, hansı şöbənin, nə səbəbdən geri qaytardığını, tarixçə bölməsində (Rəhbər qeydi kimi göstərdiyimiz eyni yerdə) görür.
4. İcraçı düzəldib, yenidən "Sənəd hazırla" edəndə — bu, **yeni bir sənəd** yaradır (köhnəsinin üzərinə yazılmır). Hər iki şöbədən (İqtisadiyyat əvvəl artıq təsdiqləmiş olsa belə) **yenidən** viza tələb olunur — köhnə təsdiq yeni sənəd üçün keçərli sayılmır.

---

## 9. Status adları (azərbaycanca göstərmək üçün)

| `status` dəyəri | Göstəriləcək ad |
|---|---|
| `forwarded` | Şöbəyə yönləndirildi |
| `assigned` | İcraçı təyin olundu |
| `under_review` | Baxılmaqdadır |
| `in_document_flow` | Sənəd dövriyyəsində |
| `awaiting_payment` | Ödəniş gözlənilir |
| `completed` | İcra olundu |

---

## 10. Açıq qalan suallar

1. `document_visas`-ın tam sahə siyahısı — real sınaqla təsdiqlənməlidir.
2. Müştərək icraçının prosesin sonrakı mərhələsində əlavə edilməsi funksionallığı hələ yoxdur (bax 4-cü bölmə).
