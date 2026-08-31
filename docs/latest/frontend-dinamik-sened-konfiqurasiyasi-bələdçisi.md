# Dinamik Sənəd Konfiqurasiyası — Frontend Bələdçisi

Bu, iki, ayrı tərəfə aiddir: **Admin panel** (super_admin, icazə üçün, sənəd siyahısını təyin edir) və **Vətəndaş tərəfi** (dinamik siyahıya görə, fayl yükləyir).

---

## HİSSƏ 1 — Admin panel

### 1.1. Mövcud sənəd növlərini çək (seçim üçün)

```
GET /api/admin/document-types
Authorization: Bearer <super_admin_token>
```
```json
{ "data": [{ "id": 1, "name": "Obyekt üzərində mülkiyyət, istifadə və ya icarə hüququnu təsdiq edən sənədin surəti" }] }
```

Bunu, "İcazə yarat/redaktə et" formasında, **axtarışlı, çox-seçimli (multi-select)** bir sahədə göstər — admin, mövcud adlardan, birini/bir neçəsini, seçə bilsin.

### 1.2. Siyahıda olmayan, yeni bir sənəd adı lazımdırsa

```
POST /api/admin/document-types
{ "name": "Yeni sənəd adı" }
```
```json
{ "data": { "id": 23, "name": "Yeni sənəd adı" } }
```
Yeni yaranan `id`-ni, seçilmiş siyahıya, əlavə et.

### 1.3. İcazə yaradarkən/redaktə edərkən — seçilən ID-ləri, göndər

```
POST /api/admin/permit-services            (yaratma)
POST /api/admin/permit-services/{id}       (redaktə, _method: PUT ilə)
```
Digər sahələrlə (ad, kateqoriya və s.) birlikdə, **yeni, məcburi** sahə:
```json
{
  "document_type_ids": [3, 7, 12]
}
```
**Diqqət — sıra, əhəmiyyətlidir:** massivdəki, sıra, vətəndaşa, göstəriləcək, sənədlərin, öz sırasını təyin edir.

### 1.4. "Sənəd sayı" — ARTIQ, AYRICA BİR SAHƏ DEYİL

Köhnə, `document_count` (admin-in, əl ilə yazdığı, rəqəm) sahəsi, formadan, **çıxarılıb.** Bunu, formada, göstərmə — say, artıq, 1.3-də seçilən, `document_type_ids` massivinin, öz uzunluğundan, **avtomatik** bəllidir, ayrıca yazılmasına, ehtiyac yoxdur.

---

## HİSSƏ 2 — Vətəndaş tərəfi

### 2.1. İcazənin, hansı sənədləri tələb etdiyini gör

```
GET /api/permit-services/{id}
```
ya da, artıq, draft yaradılıbsa:
```
GET /api/permit-applications/{id}
```
Hər ikisinin, cavabında, indi, yeni bir massiv var:
```json
{
  "documentTypes": [
    { "id": 3, "name": "Bağlanmış müqavilənin (kontraktın) surəti" },
    { "id": 7, "name": "Lisenziya və icazə şərtlərinin yerinə yetirilməsini təsdiq edən sənədlər" }
  ]
}
```
Formada, **hər elementə görə, öz, ayrıca, adlandırılmış yükləmə xanasını** göstər (sərbəst, "sənəd əlavə et" düyməsi, ARTIQ, DÜZGÜN DEYİL).

### 2.1.1. İcazənin, öz detalında, "Neçə sənəd lazımdır" göstəricisi

Saytın, front tərəfində, icazənin, öz, detal səhifəsində (vətəndaş, hələ, müraciət yaratmazdan əvvəl, icazəyə baxarkən), *"Bu icazə üçün, N ədəd sənəd lazımdır"* kimi, bir mətn göstərmək üçün — **ayrıca, bir sorğuya, ehtiyac yoxdur.** Elə, yuxarıdakı, `documentTypes` massivinin, öz **uzunluğunu** (`.length`) götür:

```js
const documentCount = permitService.documentTypes.length;
// "Bu icazə üçün, 3 ədəd sənəd lazımdır" — 3, elə, bu ədəddir
```

Bu, backend-in, ayrıca, göndərdiyi bir rəqəm deyil — frontend, bunu, öz tərəfində, massivin uzunluğuna görə, hesablayır.

### 2.2. Fayl yüklə — `document_type`, ARTIQ, `document_type_id`-dir

```
POST /api/permit-applications/{id}/files
```
`form-data`:

| Key | Type | Value |
|---|---|---|
| `document_type_id` | Text | `3` (2.1-dəki, konkret elementin, öz ID-si) |
| `file` | **File** | PDF |

**Diqqət — sərbəst mətn, ARTIQ QƏBUL OLUNMUR** — göndərilən ID, DƏQIQ, o icazənin, öz siyahısına aid olmalıdır, əks halda, `422` xətası gələcək.

### 2.3. Fayl ölçüsü — artıq, HƏR İCAZƏDƏ, EYNİ DEYİL

| İcazə | Maks. ölçü |
|---|---|
| PS-013 (Neft emalı) | **25 MB** |
| Qalan, bütün icazələr | **10 MB** |

Bu limiti, aşan bir fayl göndərsən, backend, `422`, konkret, "maksimum, XMB ola bilər" mesajı ilə, rədd edəcək.

### 2.4. Göndərmə (submit) — əskik sənədlər, indi, ADLARI ilə göstərilir

```
POST /api/permit-applications/{id}/submit
```
Hər tələb olunan sənəd, yüklənməyibsə:
```json
{
  "status": "error",
  "message": "Müraciət natamamdır, bütün addımları tamamlayın.",
  "errors": {
    "files": "Aşağıdakı sənədlər, hələ, yüklənməyib: Bağlanmış müqavilənin (kontraktın) surəti, Lisenziya və icazə şərtlərinin yerinə yetirilməsini təsdiq edən sənədlər"
  }
}
```
Bu mesajı, olduğu kimi, göstər — vətəndaş, dəqiq, **hansı sənədin** əskik olduğunu, görəcək.
