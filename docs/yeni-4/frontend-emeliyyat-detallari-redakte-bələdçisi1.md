# Əməliyyat Detallarının Görünməsi, Redaktəsi və Sənədin Önizləməsi (yalnız PS-001) — Frontend Bələdçisi

## Ümumi kontekst

PS-001 ("İxrac nəzarətinə düşən malların ixracı, idxalı..." icazəsi), vətəndaşın, müraciət yaradarkən, əl ilə doldurduğu, **4, əlavə sahəyə** malikdir (bu, digər, 14 icazədə, ümumiyyətlə, mövcud deyil). Bu sənəd, icraçının, öz, admin panelində, **(1) bu sahələri, necə görəcəyini**, **(2) ödəniş mərhələsində, onlarda, səhv aşkar etsə, necə düzəldə biləcəyini**, VƏ, **(3) sənədin, son, imzalanmamış (QR-kodsuz) görünüşünü, necə önizləyə biləcəyini**, izah edir.

---

## 1-ci hissə — İcraçı, bu datanı, harada, necə görür

### Addım 1 — Müraciətin, PS-001 olub-olmadığını, yoxla

```
GET /admin/permit-applications/{id}
```

Cavabda, `permit_service_id`-yə bax:
```json
{
  "id": 42,
  "permit_service_id": 1,
  "status": "assigned"
}
```
**`permit_service_id !== 1` olarsa** — bu bölmə, frontend-də, ÜMUMİYYƏTLƏ, göstərilməməlidir (aşağıdakı, heç, bir addım, aid deyil).

### Addım 2 — Əməliyyat detallarını, oxu

Eyni, `GET /admin/permit-applications/{id}` cavabında, **`tradeDetail`** obyekti, gəlir:

```json
{
  "id": 42,
  "permit_service_id": 1,
  "status": "assigned",
  "tradeDetail": {
    "id": 7,
    "permit_application_id": 42,
    "operation_type": "import",
    "goods_category": "Kimyəvi maddələr",
    "goods_name_volume": "500 kq natrium hidroksid",
    "usage_info": null,
    "remaining_info": null
  }
}
```

| Sahə | Ekranda göstər |
|---|---|
| `operation_type` | Əməliyyatın növü — xam dəyəri (`import`, `export`, `re_export`, `re_import`, `transit`), aşağıdakı, cədvəldəki, Azərbaycanca ada, çevir |
| `goods_category` | Malların kateqoriyası |
| `goods_name_volume` | Malın adı və həcmi |
| `usage_info` | İstifadə barədə məlumat |
| `remaining_info` | Qalıq barədə məlumat |

### `operation_type`-in, öz, tərcümə cədvəli

| Xam dəyər | Azərbaycanca |
|---|---|
| `export` | İxrac |
| `import` | İdxal |
| `re_export` | Təkrar ixrac |
| `re_import` | Təkrar idxal |
| `transit` | Tranzit |

### Hansı sahə, hansı əməliyyat növündə, göstərilməlidir

Bütün 4 sahə, həmişə, cavabda, gəlir, amma, **məzmunca, aktual olanlar**, `operation_type`-dan, asılıdır:

| `operation_type` | Aktual olan sahələr |
|---|---|
| İstənilən | `goods_category` (həmişə) |
| `import` (İdxal) | + `goods_name_volume` |
| `re_import` (Təkrar idxal) | + `usage_info`, `remaining_info` |

Digər hallarda, `goods_name_volume`/`usage_info`/`remaining_info`, adətən, `null` gəlir — bunları, boş, ya, "—" kimi göstər, xəta deyil.

---

## 2-ci hissə — İcraçı, bunları, necə düzəldir

### ⚠️ Bu, YALNIZ, statusu `payment_review` olan müraciətlərdə, mümkündür

Redaktə düyməsini/formasını, YALNIZ, `status === "payment_review"` olanda göstər — digər, bütün statuslarda (o cümlədən, `assigned`), bu, backend tərəfindən, rədd olunacaq.

### Endpoint

```
PUT /admin/permit-applications/{id}/trade-detail
Authorization: Bearer <admin_token>
```

### Göndərilə bilən sahələr (hamısı, könüllü, YALNIZ, dəyişdirilən, göndərilə bilər)

```json
{
  "goods_category": "Kimyəvi maddələr",
  "goods_name_volume": "500 kq natrium hidroksid",
  "usage_info": "...",
  "remaining_info": "..."
}
```

**Diqqət — `operation_type`, BU endpoint-lə, DƏYİŞDİRİLƏ BİLMİR** — yalnız, yuxarıdakı, 4, sərbəst-mətn sahəsi, redaktəyə açıqdır.

### Uğurlu cavab

```json
{
  "status": "success",
  "message": "Əməliyyat detalları, yeniləndi.",
  "data": {
    "tradeDetail": {
      "goods_category": "Kimyəvi maddələr",
      "goods_name_volume": "Düzəldilmiş mətn"
    }
  }
}
```
Frontend, bu, cavabdakı, yenilənmiş, `tradeDetail`-i, birbaşa, ekranda, göstərə bilər — ayrıca, təkrar, `GET` çağırmağa, ehtiyac yoxdur.

### Xəta (status, uyğun deyilsə)

```json
{ "status": "error", "message": "Bu sahələr, yalnız, ödəniş yoxlanılan mərhələdə, redaktə edilə bilər." }
```
HTTP: **422**

---

## 3-cü hissə — Sənədin, QR-kodsuz, önizləməsi

İcraçı, imzaya, göndərmədən, ƏVVƏL, sənədin, dəqiq, necə görünəcəyini, **real, PDF kimi**, görə bilir.

### Endpoint

```
GET /admin/permit-applications/{id}/preview-document
Authorization: Bearer <admin_token>
```

**Diqqət — bu, JSON QAYTARMIR, birbaşa, PDF faylı qaytarır** (`Content-Type: application/pdf`). Frontend, bunu, adi, `fetch` ilə (Authorization header-i ilə) çəkib, **brauzerdə, iframe/embed daxilində** göstərməlidir (Blob URL yaradaraq) — bu, elə, əvvəlki, "endirmə" problemimizdə, işlətdiyimiz, eyni üsuldur.

```javascript
const response = await fetch(previewUrl, { headers: { Authorization: `Bearer ${token}` } });
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
// <iframe src={url} /> kimi, göstər
```

### Bu, önizləmənin, öz, İKİ, xüsusi cəhəti

1. **QR-kod VƏ, barkod, GÖSTƏRİLMİR** — bu, sənədin, hələ, rəsmi olmadığını, göstərir.
2. **Sənəd nömrəsi, real deyil** — "ÖNİZLƏMƏ" yazısı, göstərilir (real, rəsmi nömrə, yalnız, Nazir müavini, imzalayanda, yaranır).
3. **Bazaya, HEÇ NƏ yazılmır** — bu, endpoint-i, istədiyin qədər, təkrar, çağıra bilərsən, hər dəfə, "təzə" bir sınaqdır.

### Redaktə → Yenidən-önizləmə axını

```
1. GET .../preview-document → PDF, göstərilir
2. İcraçı, "malın adı"nda, səhv görür
3. PUT .../trade-detail { "goods_name_volume": "Düzəldilmiş mətn" }
4. GET .../preview-document → TƏKRAR çağırılır → YENİ PDF, düzəldilmiş mətnlə, göstərilir
5. İcraçı, razı qalanda: POST .../confirm-payment-received
```

---

## 4-cü hissə — Tam, addım-addım, UI axını

```
1. İcraçı, "payment_review" statuslu, bir müraciətin, detalına girir
2. Frontend: permit_service_id === 1 yoxlanılır → BƏLİ → bölmə, göstərilir
3. Mövcud dəyərlər, "oxu-yalnız" kimi, göstərilir (1-ci hissədəki, cədvələ görə)
4. İstəsə, "Sənədi, önizlə" düyməsi ilə, real, QR-kodsuz PDF-i, görə bilir (3-cü hissə)
5. İcraçı, "Redaktə et" düyməsinə basır → sahələr, redaktə olunan olur
6. Düzəliş edib, "Yadda saxla" basır → PUT .../trade-detail
7. Önizləmə, açıqdırsa, avtomatik, TƏKRAR yüklənir (yeni, düzəldilmiş mətnlə)
8. İcraçı, istədiyi qədər, 5-7-ni, təkrarlaya bilər
9. Razı qalanda, ADİ, mövcud düyməyə basır: POST .../confirm-payment-received
```

---

## Son, rəsmi PDF-də, necə görünür

Bu, iki sahə (əməliyyatın növü, malın adı/həcmi), son, imzalanmış PDF-də (VƏ, önizləmə PDF-ində, eyni cür), **iki, ayrı, sabit sətirdə** göstərilir:
```
İdxal
500 kq natrium hidroksid
```
Fərq, YALNIZ, **rəsmi PDF-də, QR-kod/barkod, VƏ, real sənəd nömrəsi, əlavə olunur** — mətn hissəsinin, öz, yerləşməsi, önizləmə ilə, eynidir.
