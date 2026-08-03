# Xidmət Məmnuniyyəti (Qiymətləndirmə) — Frontend Bələdçisi

> ⚠️ Sənə verilən tapşırıq sənədində bəzi sahə adları və endpoint yolları, bizim **real backend kodumuzla üst-üstə düşmür**. Bu sənəd, **həqiqətən işləyən, dəqiq** versiyanı göstərir.

---

## 1. Vətəndaş tərəfi — qiymətləndirmə göndərmək

**Nə vaxt çağrılır:** `POST /api/permit-applications/{id}/submit` **uğurlu** cavab qaytarandan dərhal sonra, popup avtomatik açılır.

```
POST /api/service-ratings
Authorization: Bearer {token}
```

**Göndərilir:**
```json
{
  "permit_application_id": 1523,
  "rating": 5
}
```

> ⚠️ **Diqqət — sahə adı fərqlidir.** Tapşırıq sənədində `application_id` yazılıb, **real sahə adı isə `permit_application_id`-dir.** `application_id` göndərsən, validasiya xətası alacaqsan.

`permit_application_id` — müraciət yaradıldıqda (`POST /permit-applications`) və ya göndərildikdə (`.../submit`) qayıdan cavabın `data.id` sahəsidir.

**Uğurlu cavab (201):**
```json
{
  "status": "success",
  "message": "Qiymətləndirmə uğurla qeydə alındı.",
  "data": { "id": 8, "permit_application_id": 1523, "rating": 5 }
}
```

**Xəta halları (422):**

| Səbəb | Mesaj |
|---|---|
| Müraciət tapılmadı / sənə aid deyil | (404) `"Müraciət tapılmadı."` |
| Müraciət hələ qaralama (`draft`) statusundadır | `"Yalnız göndərilmiş müraciətlər qiymətləndirilə bilər."` |
| Bu müraciət artıq qiymətləndirilib | `"Bu müraciət artıq qiymətləndirilib."` |
| `rating` 1-5 aralığında deyil | (validasiya mesajı, sahə üzrə) |

**Vacib:** bir müraciət yalnız **bir dəfə** qiymətləndirilə bilər. İkinci cəhd, yuxarıdakı "artıq qiymətləndirilib" xətasını alacaq — popup-un "Bağla" düyməsi ilə çıxılıb, bir daha göstərilməməlidir (frontend, bu müraciət üçün artıq qiymət verildiyini öz tərəfində yadda saxlaya bilər).

---

## 2. Admin tərəfi — statistika

```
GET /api/admin/service-ratings/statistics
Authorization: Bearer {token}
```

> ⚠️ **Diqqət — yol fərqlidir.** Tapşırıqda `/api/service-ratings/statistics` (`/admin/` olmadan) yazılıb. **Real yol `/admin/` altındadır** və **yalnız `deputy_minister`/`super_admin` roluna açıqdır** — başqa rol və ya token olmadan sorğu göndərilsə, `403`/`401` qayıdır.

**Query parametrləri:**

| Parametr | Dəyərlər | Qeyd |
|---|---|---|
| `period` | `daily`, `monthly`, `yearly` | Aşağıdakı `trend` massivinin qruplaşma səviyyəsini müəyyən edir |
| `from` | `YYYY-MM-DD` | Könüllü, tarix aralığının başlanğıcı |
| `to` | `YYYY-MM-DD` | Könüllü, tarix aralığının sonu |

**Nümunə:**
```
GET /api/admin/service-ratings/statistics?period=monthly&from=2026-01-01&to=2026-12-31
```

**Cavab (200):**
```json
{
  "status": "success",
  "data": {
    "totalRatings": 1542,
    "averageRating": 4.6,
    "currentMonthAverage": 4.7,
    "ratings": {
      "1": 18,
      "2": 26,
      "3": 95,
      "4": 410,
      "5": 993
    },
    "trend": [
      { "period": "2026-01", "average": 4.4 },
      { "period": "2026-02", "average": 4.6 }
    ]
  }
}
```

**Qeyd — `currentMonthAverage`:** bu, **həmişə əsl indiki təqvim ayının** ortalamasıdır — `from`/`to` parametrləri buna təsir etmir (məsələn keçən ilin tarix aralığı ilə süzülsə belə, bu sahə yenə "bu ay"ı göstərir).

**Fərqlər, tapşırıq sənədinə nisbətən:**

| Tapşırıqda | Real cavabda |
|---|---|
| `monthlyTrend`, `{"month": "January", "average": 4.4}` | `trend`, `{"period": "2026-01", "average": 4.4}` — ad dəyişib, format da (ay adı yox, `YYYY-MM`), çünki `period` günlük/illik də ola bilər, ay adı bütün hallara uyğun gəlməzdi |

---

## 3. `currentMonthAverage`

Tapşırıq sənədinin dashboard kartlarında tələb etdiyi **"Cari ay üzrə orta qiymətləndirmə"** — bax, yuxarıdakı cavabda artıq var (`currentMonthAverage`). Əlavə bir sorğuya ehtiyac yoxdur, eyni `GET /admin/service-ratings/statistics` çağırışında gəlir.
