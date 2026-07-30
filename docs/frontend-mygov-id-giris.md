# Admin Panel Girişi — mygov ID İnteqrasiyası (Frontend Bələdçisi)

> **Status: tam sınanıb, PROD mühitində işləkdir.** Bu sənəddə təsvir olunan bütün axın real mygov ID hesabı ilə uçdan-uca sınanıb və uğurla tamamlanıb. Backend tərəfdə əlavə bir dəyişiklik gözlənilmir — indi frontend tərəfi canlı backend-ə (`https://permit-back.secop.az`) qarşı sına bilər.

Bu sənəd admin panelin login ekranına **mygov ID ilə daxil olma** funksiyasını necə əlavə edəcəyinizi izah edir. Mövcud E-poçt/Şifrə forması **saxlanılır** (yalnız `super_admin` üçün ehtiyat giriş yolu kimi) — mygov ID isə əsas işçilər (**rəhbər**, **icraçı**) üçün əlavə olunur.

---

## 1. Login ekranı — nə göstərilməlidir

```
┌─────────────────────────────────┐
│   [ mygov ID ilə daxil ol ]      │   ← YENİ düymə
├─────────────────────────────────┤
│   E-poçt: [__________]           │   ← mövcud forma, olduğu kimi qalır
│   Şifrə:  [__________]           │
│   [ Daxil ol ]                   │
└─────────────────────────────────┘
```

Yalnız bir düymə əlavə olunur. E-poçt/Şifrə forması dəyişmir, onun API-si (`POST /api/admin/login`) də dəyişmir.

---

## 2. "mygov ID ilə daxil ol" düyməsi basılanda

Frontend backend-dən authorization URL-i istəyir:

```
GET https://permit-back.secop.az/api/admin/auth/mygov/redirect-url
```

**Auth tələb olunmur** (istifadəçi hələ giriş etməyib).

**Cavab (200) — real, canlı nümunə:**
```json
{
  "status": "success",
  "data": {
    "url": "https://mygovid.gov.az/grant-permission?client_id=a3d3d0bee7244accb9db8d27bfab75ad&response_type=code&state=a9327e46-fc25-4918-8630-5a3b95813f11&scope=openid&redirect_uri=https%3A%2F%2Fpermit-back.secop.az%2Fapi%2Fadmin%2Fauth%2Fmygov%2Fcallback"
  }
}
```

Frontend bu URL-i alan kimi, brauzeri ora yönləndirir:

```js
const res = await fetch(`${API_BASE}/api/admin/auth/mygov/redirect-url`);
const { data } = await res.json();
window.location.href = data.url;
```

Bundan sonra istifadəçi mygov ID-nin öz sayfasına gedir, orada login üsulunu seçib (SİMA İmza, Asan İmza, İdentifikasiya nömrəsi və s.) kimliyini təsdiqləyir. **Bu hissə tamamilə mygov ID-nin öz interfeysidir — frontend-in buna heç bir müdaxiləsi yoxdur və dizaynını dəyişə bilməz.**

---

## 3. İstifadəçi geri qaytarılır — frontend-in qəbul etməli olduğu iki hal

Login prosesi bitdikdən sonra (uğurlu və ya uğursuz), backend istifadəçini **frontend login səhifəsinə** geri yönləndirir, URL-ə bir query parametr əlavə edilmiş şəkildə. Frontend login səhifəsi açılanda **hər dəfə** bu iki parametri yoxlamalıdır:

### 3.1. Uğurlu hal — `?token=...`

Real, canlı sınaqdan gələn nümunə:
```
https://smart-energetics-lilac.vercel.app/login?token=48%7CaHyME9xowHdMOiEOIzHwOx3FggVV8porSvCk1Ij8f7563613
```

(`%7C` URL-encoded `|` işarəsidir — Sanctum token formatı `{id}|{random_string}` şəklindədir, decode etdikdə `48|aHyME9x...` görünəcək.)

Frontend etməlidir:
1. URL-dəki `token` parametrini oxu (brauzer avtomatik decode edir, əlavə əməliyyat lazım deyil).
2. Onu yadda saxla (məs. `localStorage`), bundan sonra bütün admin API sorğularında `Authorization: Bearer {token}` başlığı kimi istifadə et.
3. URL-i təmizlə (token ünvan çubuğunda qalmasın) — `history.replaceState` və ya router-in bənzər metodu ilə.
4. İstifadəçini panelin əsas səhifəsinə (dashboard) yönləndir.

Bu andan etibarən, bu token **tam olaraq** `POST /api/admin/login`-dən alınan token kimi işləyir — heç bir fərq yoxdur, eyni Sanctum token formatıdır.

### 3.2. Uğursuz hal — `?error=...`

```
https://smart-energetics-lilac.vercel.app/login?error=user_not_registered
```

Frontend `error` parametrini oxuyub, istifadəçiyə **anlaşılan bir mesaj** göstərməlidir. Mümkün dəyərlər:

| `error` dəyəri | Səbəb | Göstəriləcək mesaj (təklif) |
|---|---|---|
| `invalid_state` | Giriş sessiyası vaxtı keçib və ya etibarsızdır | "Giriş sessiyası etibarsızdır, yenidən cəhd edin." |
| `fin_not_found` | mygov ID cavabında kimlik nömrəsi tapılmadı | "Kimlik məlumatları alına bilmədi, yenidən cəhd edin." |
| `user_not_registered` | Bu FİN-lə heç bir işçi qeydə alınmayıb | "Bu hesab sistemdə qeydə alınmayıb. Administratora müraciət edin." |
| `not_admin` | Hesab var, amma admin rolu yoxdur | "Bu hesabın admin panelə girişi yoxdur." |
| `account_inactive` | Hesab deaktiv edilib | "Hesabınız deaktiv edilib. Administratora müraciət edin." |
| `mygov_auth_failed` | mygov ID ilə əlaqədə texniki xəta | "Giriş zamanı xəta baş verdi, yenidən cəhd edin." |

Nümunə kod:
```js
const params = new URLSearchParams(window.location.search);

if (params.get('token')) {
  saveToken(params.get('token'));
  window.history.replaceState({}, '', '/login');
  navigate('/dashboard');
} else if (params.get('error')) {
  showErrorMessage(errorMessages[params.get('error')] ?? 'Giriş zamanı xəta baş verdi.');
  window.history.replaceState({}, '', '/login');
}
```

---

## 4. E-poçt/Şifrə forması — dəyişmir

`POST /api/admin/login` eyni qalır:
```json
{ "email": "admin@energy.az", "password": "..." }
```
Cavab formatı, xəta kodları (401, 403) — hamısı əvvəlki kimidir. Bu forma yalnız `super_admin` rolu üçün nəzərdə tutulur; digər rollar (rəhbər, icraçı) mygov ID ilə daxil olur.

---

## 5. Vacib qeydlər

- **Bir anlıq keçid görünə bilər:** login prosesi bitəndə, brauzer çox qısa müddətə backend-in öz ünvanına (`permit-back.secop.az/.../auth/mygov/callback?...`) keçəcək, sonra avtomatik login səhifəsinə qayıdacaq. Bu, normaldır, əlavə bir şey etmək lazım deyil.
- **Backend PROD mühitində tam sınanıb.** Real mygov ID hesabı ilə uçdan-uca test edilib (URL qurma → login → geri qayıtma → token yaradılması) — sistemdə heç bir bilinən problem yoxdur.
- **Rol siyahısı gələcəkdə genişlənə bilər** (yeni rollar əlavə olunanda) — bu, login axınının məntiqinə (düymə, redirect, token/error qəbulu) təsir etmir, frontend tərəfdə əlavə dəyişiklik tələb olunmayacaq.
- **Base URL:** `API_BASE` olaraq `https://permit-back.secop.az` istifadə edin.
