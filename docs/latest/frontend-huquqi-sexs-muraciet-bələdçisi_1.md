# Hüquqi Şəxs Kimi Müraciət — Frontend Bələdçisi

## Ümumi axın — fiziki şəxslə, EYNİ naxış

Fiziki şəxsdə olduğu kimi: əvvəlcə, **boş bir draft** yaranır, sonra, addım-addım, məlumat, `PUT` ilə doldurulur. VÖEN seçimi, draft yaradılan anda yox, **draft, artıq yarandıqdan sonra**, ilk `PUT` sorğusunda edilir.

---

## 1-ci addım — Boş draft yarat

```
POST /api/permit-applications
{
  "permit_service_id": 3,
  "applicant_type": "legal"
}
```

**Cavab (201):**
```json
{
  "data": {
    "id": 5,
    "status": "draft",
    "applicant_type": "legal",
    "voen": null,
    "legal_entity_name": null
  }
}
```

Diqqət — burada, **heç bir VÖEN göndərilmir.**

---

## 2-ci addım — Vətəndaşın, öz VÖEN-lərini al

```
GET /api/me
```
```json
{
  "data": {
    "voens": [
      { "id": 1, "voen": "1806384781", "company_name": "\"SECOP\" Məhdud Məsuliyyətli Cəmiyyəti" }
    ]
  }
}
```

Ekranda göstər:
- **1 VÖEN** → 1 selectbox.
- **Bir neçə VÖEN** → alt-alta, hər biri, öz selectbox-u.
- **Heç biri yoxdursa** → "Hüquqi şəxs" seçimi, ümumiyyətlə, göstərilməsin.

---

## 3-cü addım — Vətəndaş, VÖEN seçir → göndər

```
PUT /api/permit-applications/5
{
  "voen": "1806384781"
}
```

**Backend, bu andaca:**
- Seçilən VÖEN-in, doğrudan, vətəndaşın, öz, təsdiqlənmiş siyahısında olduğunu yoxlayır.
- Uyğun gəlirsə, **5 sahəni, avtomatik doldurur:** `voen`, `legal_entity_name`, `director_first_name`, `director_last_name`, `director_father_name`.

**Cavab (200):**
```json
{
  "data": {
    "voen": "1806384781",
    "legal_entity_name": "\"SECOP\" Məhdud Məsuliyyətli Cəmiyyəti",
    "director_first_name": "Ulvi",
    "director_last_name": "Əlili",
    "director_father_name": "Natiq oğlu",
    "legal_address": null
  }
}
```

**Cavab (422, VÖEN uyğun gəlməzsə):**
```json
{ "status": "error", "message": "Seçilən VÖEN, sizin təsdiqlənmiş VÖEN-ləriniz arasında deyil." }
```
(Bu, normalda, görünməməlidir — frontend, yalnız, `GET /me`-dən gələn VÖEN-ləri göstərdiyi üçün.)

---

## 4-cü addım — Formada, 6 sahə göstər

| # | Sahə | Mənbə | Dəyişdirilə bilir? |
|---|---|---|---|
| 1 | Hüquqi şəxsin adı | `legal_entity_name` (3-cü addımdan, avtomatik) | ❌ Xeyr |
| 2 | Hüquqi ünvan | Vətəndaş, əl ilə yazır | ✅ Bəli |
| 3 | VÖEN | `voen` (3-cü addımdan) | ❌ Xeyr |
| 4 | Müəssisə rəhbərinin adı | `director_first_name` (3-cü addımdan) | ❌ Xeyr |
| 5 | Müəssisə rəhbərinin soyadı | `director_last_name` (3-cü addımdan) | ❌ Xeyr |
| 6 | Müəssisə rəhbərinin ata adı | `director_father_name` (3-cü addımdan) | ❌ Xeyr |

**Diqqət — 1, 3, 4, 5, 6-cı sahələr, backend tərəfindən, sərt qorunur:** bu sahələri, birbaşa, `PUT` ilə, dəyişdirməyə cəhd etsən belə (məsələn, `legal_entity_name` üçün, fərqli bir dəyər göndərsən), backend, bunu, **sükutla, gözardı edir** — yalnız `voen` və `legal_address`, real, qəbul olunan sahələrdir.

---

## 5-ci addım — Hüquqi ünvanı, əl ilə yaz

```
PUT /api/permit-applications/5
{
  "legal_address": "Bakı şəhəri, ..."
}
```

> **Qeyd:** istəsən, 3-cü və 5-ci addımı, **tək bir sorğuda**, birləşdirə bilərsən:
> ```json
> { "voen": "1806384781", "legal_address": "Bakı şəhəri, ..." }
> ```
> Backend, hər ikisini, eyni anda, düzgün emal edir.

> ⚠️ **Müvəqqəti vəziyyət:** `legal_address`, hazırda, vətəndaşın, **əl ilə** yazdığı, sərbəst bir sahədir — VÖEN-ə görə, avtomatik ünvan tapan, xarici bir mənbə (mygov ID/dövlət reyestri), hələ, mövcud deyil (bu, ayrıca, davam edən bir araşdırmadır). Bu, gələcəkdə, əlavə API əlaqələndirilməsi ilə, **avtomatik doldurulan, dəyişdirilə bilməyən** bir sahəyə çevrilə bilər — o zaman, bu sənəd, yenilənəcək.

---

## Bundan sonra — fiziki şəxslə, TAM EYNİDİR

- Email/telefon (`PUT`)
- Sənəd yükləmə (`POST .../files`)
- Göndərmə (`POST .../submit`)

Bu, ayrıca sənəddə (`frontend-vetendas-muraciet-yaratma-bələdçisi.md`) izah olunub — burada, təkrarlanmır.
