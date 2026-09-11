# Əlaqə Ayarları (Contact Settings) — Frontend Bələdçisi

## Ümumi konsepsiya — VACİB

Bu, **FAQ kimi, "çoxlu sətirli" bir siyahı DEYİL** — bu, "Profil ayarları" kimi, sistemdə, **HƏMİŞƏ, YALNIZ, BİR** əlaqə kartı olan, bir bölmədir. Admin panelə daxil olanda, **"Əlaqə Ayarları"** adlı, **TƏK, bir səhifə** olur — orada, "Yarat" düyməsi, YOXDUR, sadəcə, **"Yadda saxla"** var.

---

## 1. Sayt üzərində göstərmək üçün — İctimai endpoint

```
GET /api/contact-settings
```
(Auth tələb olunmur..)

### Cavab

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "phone": "+994 12 310 14 00",
    "email": "info@minenergy.gov.az",
    "address": "Bakı şəhəri, Üzeyir Hacıbəyov 84",
    "social_links": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/...",
      "youtube": "https://youtube.com/..."
    }
  }
}
```

### `social_links` — necə göstərilir

Bu, **açar-dəyər** massividir — frontend, **açarın, öz adına** görə (`facebook`, `instagram`, `youtube`, s.), öz, **sabit, tanınan** ikonunu, göstərir. Admin, yeni, bir platforma (məsələn, `linkedin`) əlavə etsə, frontend, ona, öz, uyğun ikonunu, tapıb, göstərməlidir — admin, ayrıca, heç bir, ikon şəkli, yükləmir.

> ⚠️ **Vacib — bu, SABİT (qapalı) bir siyahı DEYİL.** Admin, `facebook`/`instagram`/`youtube`-dan, kənar, **istənilən, YENİ, sərbəst** sosial media platforması (məsələn, `tiktok`, `telegram`, ya, tamam, başqa, bir ad) əlavə edə bilər — backend, açarın, özünə, heç, bir, məhdudiyyət qoymur, yalnız, dəyərin (URL-in), düzgün formatda olmasını, yoxlayır. Frontend, admin panelində, **"+ Yeni sosial şəbəkə əlavə et"** kimi, bir düymə ilə, admin-in, öz, sərbəst, açar adı YAZA biləcəyi, imkan verməlidir (bax, aşağı, 4-cü bölmə).

---

## 2. Admin panel — "Əlaqə Ayarları" səhifəsi

### Səhifə açılanda — mövcud dəyərləri, çək

```
GET /admin/contact-settings
Authorization: Bearer <super_admin_token>
```
Cavab, format, yuxarıdakı, ictimai endpoint ilə, **eynidir.**

**Diqqət — ilk dəfə, açılanda**, bütün sahələr, `null` gələ bilər (hələ, heç, doldurulmayıb) — formanı, sadəcə, **boş** göstər, xəta deyil.

### Admin, dəyişib, saxlayanda

```
PUT /admin/contact-settings
Authorization: Bearer <super_admin_token>
{
  "phone": "+994 12 310 14 00",
  "email": "info@minenergy.gov.az",
  "address": "Bakı şəhəri, Üzeyir Hacıbəyov 84",
  "social_links": {
    "facebook": "https://facebook.com/...",
    "instagram": "https://instagram.com/..."
  }
}
```

| Sahə | Növ | Qayda |
|---|---|---|
| `phone` | `string` | Könüllü |
| `email` | `string` | Könüllü, e-poçt formatında olmalıdır |
| `address` | `string` | Könüllü |
| `social_links` | `object` | Könüllü, hər açarın, öz dəyəri, real URL olmalıdır |

### Cavab

```json
{
  "status": "success",
  "message": "Əlaqə məlumatları, yeniləndi.",
  "data": { "phone": "...", "email": "...", "address": "...", "social_links": {...} }
}
```

Frontend, bu, cavabdakı, yeni, dəyərləri, ekranda, birbaşa, göstərə bilər — ayrıca, təkrar, `GET`, çağırmağa, ehtiyac yoxdur.

---

## 3. "Yarat" ilə "Redaktə et" — eyni əməliyyatdır

Səhifədə, YALNIZ, **BİR** düymə olsun: **"Yadda saxla."** Bu, həm, ilk, dəfə (sahələr, boşdan, doldurulanda), həm, sonrakı, dəyişikliklərdə, **eyni, tək endpoint-i** (`PUT`) çağırır — ayrıca, "Create" məntiqi, frontend-də, qurulmasın.

---

## 4. Sosial media, yeni platforma əlavə etmək

Admin, `social_links`-ə, sərbəst, istənilən, yeni açar (məsələn, `"tiktok": "https://tiktok.com/..."`) əlavə edə bilər — backend, bunu, sərbəst, açar-dəyər massivi kimi, saxlayır, sabit, qapalı bir siyahı deyil. Frontend, formada, **çoxlu, ayrı-ayrı, açar+dəyər cütü, əlavə edilə bilən**, dinamik bir sahə (məsələn, "+ Yeni sosial şəbəkə əlavə et") təqdim etməlidir.
