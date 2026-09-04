# Hesabatlar Səhifəsi — Frontend Bələdçisi

Bu, **iki, ayrı endpoint**dən ibarətdir: **(1)** cədvəli, ekranda göstərmək üçün, JSON qaytaran endpoint, **(2)** "Excel-ə Yüklə" düyməsi üçün, birbaşa, fayl endirən endpoint. Hər ikisi, **eyni, filtrləri** qəbul edir.

---

## 1. Cədvəl (JSON, filtrlənə bilən, səhifələnən)

```
GET /api/admin/permit-applications/report
Authorization: Bearer <admin_token>
```

### Query Parametrləri

| Parametr | Növ | Təsvir |
|---|---|---|
| `permit_service_id` | `integer` | Könüllü — 15 icazədən, birinə görə süzgəc |
| `date_from` | `date` (YYYY-MM-DD) | Könüllü |
| `date_to` | `date` (YYYY-MM-DD) | Könüllü |
| `status` | `string` | Könüllü — **göndərilməzsə, defolt: `completed`** |
| `per_page` | `integer` | Könüllü, defolt: 20 (dizaynda, 20/50/100 seçimi tələb olunur) |
| `page` | `integer` | Səhifə nömrəsi |

### Cavab

```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "row_number": 1,
        "issuing_authority": "Energetika Nazirliyi\nÜzeyir Hacıbəyov 84 (Hökumət evi)",
        "owner_info": "\"SECOP\" Məhdud Məsuliyyətli Cəmiyyəti, Bakı şəhəri, ...",
        "voen": "1806384781",
        "issued_info": "27.08.2026, № D/O-İ-3/2026",
        "validity_period": "",
        "action": "Elektrik enerjisinin ötürülməsinə icazə",
        "addendum_info": "-",
        "reissued_info": "-",
        "duplicate_info": "-",
        "suspension_info": "-",
        "cancellation_info": "-"
      }
    ],
    "current_page": 1,
    "last_page": 3,
    "total": 45,
    "per_page": 20
  }
}
```

### Sütun → Sahə Xəritəsi (cədvəlin, öz başlıqları üçün)

| # | Cədvəldə göstəriləcək başlıq | JSON sahəsi |
|---|---|---|
| — | Sıra sayı | `row_number` |
| 1 | İcazə verən orqanın adı və ünvanı | `issuing_authority` |
| 2 | İcazənin sahibi barədə məlumatlar | `owner_info` |
| 3 | VÖEN | `voen` |
| 4 | İcazənin verildiyi tarix və qeydiyyat nömrəsi | `issued_info` |
| 5 | İcazənin müddəti | `validity_period` |
| 6 | İcazədə göstərilmiş hərəkət | `action` |
| 7 | Əlavənin tarixi/nömrəsi | `addendum_info` |
| 8 | Yenidən rəsmiləşdirmə tarixi/nömrəsi | `reissued_info` |
| 9 | Dublikat tarixi/nömrəsi | `duplicate_info` |
| 10 | Dayandırılma/bərpa tarixi/nömrəsi | `suspension_info` |
| 11 | Ləğv tarixi/nömrəsi | `cancellation_info` |

**Diqqət — 5-ci sütun (`validity_period`), HƏMİŞƏ, boş gəlir** (bizim, sistemimizdə, hələ, saxlanılmır). **7-11-ci sütunlar, HƏMİŞƏ, `"-"`** gəlir (Sərəncamlar funksiyası, hələ, qurulmayıb) — bunlar, "bug" deyil, gözlənilən davranışdır.

---

## 2. "Excel-ə Yüklə" düyməsi

```
GET /api/admin/permit-applications/export-excel
```

**Eyni, 3 filtri qəbul edir** (`permit_service_id`, `date_from`, `date_to`) — `status`, `per_page`, `page`, bura, **aid deyil** (Excel, həmişə, bütün, uyğun sətirləri, bir dəfəyə, endirir).

```
GET /admin/permit-applications/export-excel?permit_service_id=3&date_from=2026-01-01&date_to=2026-08-30
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

## 3. Filtr dropdown-larını, necə doldur

### 3.1. "İcazə növü" (15 seçim) — mövcud endpoint

```
GET /api/admin/permit-services
Authorization: Bearer <admin_token>
```
```json
{ "data": [{ "id": 1, "name": "İxrac nəzarətinə düşən malların..." }, ...] }
```
Bu, **artıq, mövcud** endpoint-dir (İcazələr idarəetməsi bölməsində, işlədilən, eyni) — buradan, `id`-ni, `permit_service_id` filtrinə, `name`-i isə, dropdown-un, öz mətninə, ver.

### 3.2. "Status" — sabit, dəyişməyən siyahı (endpoint yoxdur)

Bu, ayrıca, bir endpoint tələb etmir — dropdown-u, bu, sabit dəyərlərlə, qur:

| Dəyər (backend-ə, göndəriləcək) | Ekranda göstəriləcək ad |
|---|---|
| `completed` | Tamamlanmış (**defolt**) |
| `registered` | Qeydiyyata alındı |
| `assigned` | İcraya yönləndirilib |
| `awaiting_revision` | Düzəliş tələb olunur |
| `awaiting_payment` | Ödəniş gözlənilir |
| `rejected` | İmtina edilib |
| `unprocessed` | Baxılmamış saxlanılıb |

---

## Filtr Paneli — icazə seçimi, TƏK seçimdir

Hazırda, `permit_service_id`, **yalnız, tək bir** icazəni qəbul edir (çoxlu seçim, dəstəklənmir) — dropdown, `single-select` olmalıdır.
