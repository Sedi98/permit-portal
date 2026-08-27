# Vətəndaş Portalı — Müraciət Yaratma (Tam Bələdçi)

Bu sənəd, vətəndaşın, mygov ID ilə girişindən, icazə seçiminə, fiziki/hüquqi şəxs seçiminə, hər ikisinin, tam, müraciət yaratma axınına qədər, hər şeyi əhatə edir.

---

## 1. Giriş (mygov ID)

```
GET /api/auth/mygov/redirect-url
```
**Auth tələb olunmur.** Cavabdakı `data.url`-i, brauzerdə aç — vətəndaş, öz mygov ID-si (Asan İmza/SİMA) ilə, girir.

Uğurlu girişdən sonra, brauzer, avtomatik:
```
https://permit-portal-web.vercel.app/login?token=<sanctum_token>
```
ünvanına, yönləndirilir. `token`, URL-dən götürülür (**diqqət — `%7C` işarəsi, URL-encoded `|`-dır, decode etmək lazımdır**), bundan sonra, bütün sorğularda, `Authorization: Bearer <token>` kimi işlədilir.

> Ətraflı, texniki OAuth axını üçün, bax: `frontend-vetendas-mygov-id-giris-bələdçisi.md`.

---

## 2. Vətəndaşın öz məlumatlarını al

```
GET /api/me
Authorization: Bearer <token>
```

**Cavab:**
```json
{
  "data": {
    "fin": "2G6N0NQ",
    "first_name": "Faiq",
    "last_name": "Həziyev",
    "father_name": "Əli oğlu",
    "address": null,
    "birth_date": "1990-05-12",
    "citizenship": "citizen",
    "voens": [
      { "id": 1, "voen": "1806384781", "company_name": "\"SECOP\" Məhdud Məsuliyyətli Cəmiyyəti" }
    ]
  }
}
```

Bu massiv (`voens`), aşağıda, **"Hüquqi şəxs" seçiminin, göstərilib-göstərilməyəcəyini** təyin edir.

---

## 3. İcazə siyahısı

```
GET /api/permit-services
```

**Cavab, hər icazədə:**
```json
{
  "id": 3,
  "name": "...",
  "category_label": "İcazə",
  "allowed_applicant_types": "both",
  "legal_basis": "...",
  "required_documents": "...",
  "review_duration_days": 7,
  "state_fee": "100.00"
}
```

`allowed_applicant_types` — `"physical"` | `"legal"` | `"both"`.

---

## 4. "Fiziki şəxs / Hüquqi şəxs" seçimi — MƏNTİQ

Vətəndaş, icazəni seçəndən sonra, bu popup açılır. Göstəriləcək düymələr, **iki şərtin kəsişməsinə** görə təyin olunur:

| `allowed_applicant_types` | `voens` boşdur | `voens` doludur |
|---|---|---|
| `physical` | Yalnız **Fiziki şəxs** | Yalnız **Fiziki şəxs** |
| `legal` | ⚠️ Heç bir seçim yoxdur — bu icazəyə, bu vətəndaş, müraciət edə bilmir | Yalnız **Hüquqi şəxs** |
| `both` | Yalnız **Fiziki şəxs** | **Hər ikisi** |

---

## 5. FİZİKİ ŞƏXS kimi müraciət yaratmaq

### 5.1. Draft yarat

```
POST /api/permit-applications
{ "permit_service_id": 3, "applicant_type": "physical" }
```

**Backend, dərhal, mygov ID-dən gələn kimlik məlumatlarını, avtomatik doldurur:**
```json
{
  "data": {
    "id": 10,
    "status": "draft",
    "fin": "2G6N0NQ",
    "first_name": "Faiq",
    "last_name": "Həziyev",
    "father_name": "Əli oğlu"
  }
}
```
Bu 4 sahə (FİN, ad, soyad, ata adı) — **dəyişdirilə bilmir.**

### 5.2. Email, telefon (məcburi)

```
PUT /api/permit-applications/10
{
  "email": "vetendas@test.az",
  "phones": [{ "phone": "+994509987187" }]
}
```

### 5.3. Əməliyyat detalları — YALNIZ `permit_service_id: 1` üçün

```
PUT /api/permit-applications/10
{
  "trade_detail": {
    "operation_type": "import",
    "goods_category": "...",
    "goods_name_volume": "..."
  }
}
```
`operation_type`: `export` | `import` | `re_export` | `re_import` | `transit`. Digər icazələr üçün, bu sahə, göndərilməməlidir.

### 5.4. Sənəd yükləmə

```
POST /api/permit-applications/10/files
```
`form-data`: `document_type` (mətn), `file` (PDF, maks. 10MB — `permit_service_id: 13` üçün, 25MB).

### 5.5. Göndər

```
POST /api/permit-applications/10/submit
```
Yoxlanılır: email doludur, ən azı 1 telefon, ən azı 1 fayl.

**Cavab:**
```json
{ "data": { "status": "registered", "application_no": "D/O-İ-V-1/2026" } }
```

---

## 6. HÜQUQİ ŞƏXS kimi müraciət yaratmaq

### 6.1. Boş draft yarat

```
POST /api/permit-applications
{ "permit_service_id": 3, "applicant_type": "legal" }
```
**Diqqət — burada, heç bir VÖEN göndərilmir.** Draft, tam boş yaranır.

### 6.2. VÖEN seçimi göstər

2-ci bölmədə aldığın, `voens` massivini, ekranda göstər:
- **1 VÖEN** → 1 selectbox.
- **Bir neçə** → alt-alta, hər biri, öz selectbox-u.

### 6.3. Vətəndaş, VÖEN seçir → göndər

```
PUT /api/permit-applications/10
{ "voen": "1806384781" }
```

**Backend, bu andaca, 4 sahəni, avtomatik doldurur:**
```json
{
  "data": {
    "voen": "1806384781",
    "legal_entity_name": "\"SECOP\" Məhdud Məsuliyyətli Cəmiyyəti",
    "director_first_name": "Faiq",
    "director_last_name": "Həziyev",
    "director_father_name": "Əli oğlu"
  }
}
```
Bu 4 sahə (VÖEN, şirkət adı, rəhbərin adı/soyadı/ata adı) — **dəyişdirilə bilmir.**

**Xəta (VÖEN, siyahıda yoxdursa):**
```json
{ "status": "error", "message": "Seçilən VÖEN, sizin təsdiqlənmiş VÖEN-ləriniz arasında deyil." }
```

### 6.4. Hüquqi ünvan (əl ilə, YEGANƏ, sərbəst yazılan sahə)

```
PUT /api/permit-applications/10
{ "legal_address": "Bakı şəhəri, ..." }
```
> Bunu, 6.3-lə, **eyni sorğuda** da, birləşdirə bilərsən: `{ "voen": "...", "legal_address": "..." }`.

### 6.5–6.7. Email/telefon, sənəd, göndər

**Fiziki şəxslə, TAM EYNİDİR** — bax, 5.2, 5.4, 5.5 (5.3 — trade_detail — hüquqi şəxsə də, eyni qaydada, `permit_service_id: 1` olduqda, aiddir).

---

## 7. Formadakı sahələrin, tam xülasəsi (Hüquqi şəxs)

| # | Sahə | Mənbə | Dəyişdirilə bilir? |
|---|---|---|---|
| 1 | Hüquqi şəxsin adı | VÖEN seçimindən, avtomatik | ❌ Xeyr |
| 2 | Hüquqi ünvan | Vətəndaş, əl ilə yazır | ✅ Bəli |
| 3 | VÖEN | Seçimin özü | ❌ Xeyr |
| 4 | Rəhbərin adı | mygov ID-dən, avtomatik | ❌ Xeyr |
| 5 | Rəhbərin soyadı | mygov ID-dən, avtomatik | ❌ Xeyr |
| 6 | Rəhbərin ata adı | mygov ID-dən, avtomatik | ❌ Xeyr |

---

## 8. Göndərdikdən sonra — nə baş verir

Müraciət, statusu, `registered`-ə keçir, admin panelə (Nazir Müavininin "Yeni daxil olanlar" siyahısına) düşür. Bundan sonrakı, bütün axın (yönləndirmə, çatışmazlıq, ödəniş, son imza) — `frontend-vetendas-tam-sistem-bələdçisi.md` sənədində, ətraflı izah olunub.
