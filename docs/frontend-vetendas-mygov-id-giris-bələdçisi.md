# Vətəndaş Portalı — mygov ID İnteqrasiyası (Frontend Bələdçisi)

Bu sənəd, vətəndaş portalının login ekranına **mygov ID ilə daxil olma** funksiyasını necə əlavə edəcəyinizi izah edir.

---

## 1. Login ekranı

```
┌─────────────────────────────────┐
│   [ mygov ID ilə daxil ol ]      │
└─────────────────────────────────┘
```

Vətəndaş portalında **yalnız** mygov ID ilə giriş var — email/şifrə forması yoxdur.

---

## 2. "mygov ID ilə daxil ol" düyməsi basılanda

```
GET /api/auth/mygov/redirect-url
```

**Auth tələb olunmur.**

**Cavab (200):**
```json
{
  "status": "success",
  "data": {
    "url": "https://mygovid.gov.az/grant-permission?client_id=...&response_type=code&state=...&scope=openid&redirect_uri=..."
  }
}
```


İstifadəçi mygov ID-nin öz sayfasına gedir, kimliyini təsdiqləyir (SİMA İmza, Asan İmza, İdentifikasiya nömrəsi və s.). Bu hissə tamamilə mygov ID-nin öz interfeysidir.

---

## 3. Geri qaytarılma — iki hal

### 3.1. Uğurlu hal — `?token=...`

```
https://permit-portal-web.vercel.app/login?token=1|abc123xyz...
```
?token= gotur ve cookielerde yadda saxla 

Token, bundan sonra bütün sorğularda `Authorization: Bearer {token}` başlığı kimi işlədilir.



**Vacib fərq (admin paneldən fərqli olaraq):** vətəndaş üçün, mygov ID-dən gələn FİN sistemdə **tapılmasa belə, giriş rədd edilmir** — vətəndaşın hesabı, ilk girişində, **avtomatik** yaradılır (ad/soyad/ata adı mygov ID-dən götürülür). Yəni vətəndaş üçün "qeydiyyatdan keçməmisiniz" kimi bir xəta **yoxdur** — hər uğurlu mygov ID girişi, mütləq bir `?token=...` ilə nəticələnir.

### 3.2. Uğursuz hal — `?error=...`

```
https://permit-portal-web.vercel.app/login?error=invalid_state
```

| `error` dəyəri | Səbəb | Göstəriləcək mesaj (təklif) |
|---|---|---|
| `invalid_state` | Giriş sessiyası vaxtı keçib və ya etibarsızdır | "Giriş sessiyası etibarsızdır, yenidən cəhd edin." |
| `fin_not_found` | mygov ID cavabında kimlik nömrəsi tapılmadı | "Kimlik məlumatları alına bilmədi, yenidən cəhd edin." |
| `account_inactive` | Hesab deaktiv edilib | "Hesabınız deaktiv edilib." |
| `mygov_auth_failed` | mygov ID ilə əlaqədə texniki xəta | "Giriş zamanı xəta baş verdi, yenidən cəhd edin." |

---

<!-- qeyd: bu xətaları toaster ilə  ekranda toast bildiriş formatında göstər -->

## 4. Vacib qeydlər

- **Bir anlıq keçid görünə bilər:** login prosesi bitəndə, brauzer qısa müddətə backend-in öz ünvanına keçəcək, sonra avtomatik login səhifəsinə qayıdacaq — normaldır.
- **Base URL:** `API_BASE` olaraq `https://permit-back.secop.az` istifadə edin.
