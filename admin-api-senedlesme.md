Vahid Elektron Informasiya Sistemi

Admin Panel API Senedlesmesi

Bu sənəd nazirlik işçilərinin istifadə etdiyi **admin panel** üçün API-ni təsvir edir. Admin panel müraciətləri idarə edir: növbəni görmək, icraçı təyin etmək, baxmaq, təsdiqləmək/imtina etmək, yekun sənəd yaratmaq və istifadəçiləri idarə etmək.

Bu API vətəndaş (front) API-sindən ayrıdır. Bütün admin endpoint-ləri /api/admin prefiksi altındadır və **rola** görə qorunur.

## 1\. Ümumi məlumat

**Base URL:** <https://permit-back.secop.az> (development: <http://localhost:8000>)

Bütün yollar /api prefiksi altındadır. Aşağıda qısa yazılıb; tam ünvan {BASE_URL}/api/admin/... deməkdir.

### Rollar

Üç işçi rolu var:

| Rol         | Açar        | Təyinat                                                            |
| ----------- | ----------- | ------------------------------------------------------------------ |
| Super Admin | super_admin | Tam səlahiyyət: istifadəçi idarəetməsi, təsdiq, dayandırma         |
| Rəhbər      | manager     | Müraciətləri görür, icraçı təyin edir, təsdiq/imtina/dayandırma    |
| İcraçı      | executor    | Ona təyin olunan müraciətlərə baxır, təsdiqə göndərir, imtina edir |

(citizen rolu vətəndaşlara aiddir; admin panelə girişi yoxdur.)

## 2\. Autentifikasiya

Admin əvvəlcə login edir, token alır, sonrakı bütün sorğularda həmin token-i göndərir.

**Məcburi başlıqlar:**

| Başlıq        | Dəyər                                   |
| ------------- | --------------------------------------- |
| Authorization | Bearer {token}                          |
| Accept        | application/json                        |
| Content-Type  | application/json (fayl yükləmə istisna) |

### 2.1. Giriş (login)

POST /api/admin/login

Qorunmamış (token tələb olunmur). Body:

{ "email": "<admin@energy.az>", "password": "Permit2026" }

**Uğurlu cavab (200):**

{  
"status": "success",  
"message": "Uğurla daxil oldunuz.",  
"data": {  
"user": { "id": 1, "name": "Super Admin", "email": "<admin@energy.az>", "role": "super_admin" },  
"token": "1|abc123..."  
}  
}

token-i saxlayın və sonrakı bütün sorğularda Authorization: Bearer {token} kimi göndərin.

**Xəta halları:** - **401** - e-poçt və ya parol yanlış: "E-poçt və ya parol yanlışdır." - **403** - vətəndaş hesabı (admin deyil): "Bu hesabın admin panelə girişi yoxdur." - **403** - deaktiv hesab: "Hesabınız deaktiv edilib. Administratora müraciət edin."

### 2.2. Cari istifadəçi

GET /api/admin/me

Cavab: cari istifadəçinin id, name, email, role. Panel açılanda rolu bilmək üçün istifadə olunur.

### 2.3. Çıxış (logout)

POST /api/admin/logout

Cari token-i etibarsız edir.

## 3\. Ümumi cavab formatı

{ "status": "success", "message": "...", "data": { ... } }

**Status kodları:**

| Kod | Məna                                    |
| --- | --------------------------------------- |
| 200 | Uğurlu                                  |
| 201 | Yaradıldı                               |
| 401 | Token yoxdur/yanlışdır (giriş lazımdır) |
| 403 | Rolun bu əməliyyata icazəsi yoxdur      |
| 404 | Tapılmadı / bu istifadəçiyə görünmür    |
| 422 | Validasiya və ya status keçidi xətası   |

**Validasiya xətası (422):**

{  
"message": "...",  
"errors": { "email": \["E-poçt daxil edilməlidir."\] }  
}

**Səhifələmə.** Siyahı endpoint-ləri (müraciətlər, istifadəçilər) Laravel-in standart səhifələmə formatında qayıdır:

{  
"status": "success",  
"data": {  
"current_page": 1,  
"data": \[ ... \], // əsl elementlər burada  
"last_page": 5,  
"per_page": 20,  
"total": 92  
}  
}

?per_page=N ilə səhifə ölçüsü dəyişdirilir (default 20). ?page=N ilə səhifə.

## 4\. Rollar və səlahiyyətlər (admin UI üçün ən vacib cədvəl)

Panel hansı düymələri kimə göstərəcəyini bu cədvələ görə qərar verməlidir:

| Əməliyyat                               | super_admin | manager | executor           |
| --------------------------------------- | ----------- | ------- | ------------------ |
| Giriş                                   | ✓           | ✓       | ✓                  |
| Bütün müraciətləri görmək               | ✓           | ✓       | yalnız öz təyinatı |
| Müraciət detalı                         | ✓           | ✓       | yalnız öz təyinatı |
| İcraçı təyin etmək (assign)             | ✓           | ✓       | ✗                  |
| Baxışa götürmək (→ under_review)        | ✗           | ✗       | ✓                  |
| Təsdiqə göndərmək (→ sent_for_approval) | ✗           | ✗       | ✓                  |
| Təsdiqləmək (→ completed)               | ✓           | ✓       | ✗                  |
| İmtina (→ rejected)                     | ✓           | ✓       | ✓                  |
| Dayandırmaq (→ suspended)               | ✓           | ✓       | ✗                  |
| Sənəd yükləmək                          | ✓           | ✓       | yalnız öz təyinatı |
| İstifadəçi idarəetməsi                  | ✓           | ✗       | ✗                  |

## 5\. Status axını (müraciətin həyat dövrü)

Müraciət bu ardıcıllıqla irəliləyir:

registered → assigned → under_review → sent_for_approval → completed  
↓  
rejected (imtina - axın bitir)  
<br/>(xüsusi hal, müxtəlif mərhələlərdən) → suspended (dayandırma)

### Status dəyərləri

| Status            | Vətəndaşa göstərilən məna             |
| ----------------- | ------------------------------------- |
| registered        | Müraciətiniz qeydiyyata alınmışdır    |
| assigned          | Sənəd üzrə icraçı təyin olunmuşdur    |
| under_review      | Müraciətə baxılmaqdadır               |
| sent_for_approval | Sənəd təsdiqə verilmişdir             |
| completed         | İcra olunmuşdur (yekun sənəd yaranır) |
| rejected          | İmtina edilmişdir                     |
| suspended         | Dayandırılmışdır                      |

### İcazəli keçidlər (frontend hansı düymələri göstərəcəyini buna görə qərar verir)

| Cari status                      | Keçə bilər        | Kim edə bilər                  | Endpoint |
| -------------------------------- | ----------------- | ------------------------------ | -------- |
| registered                       | assigned          | manager, super_admin           | assign   |
| registered                       | suspended         | manager, super_admin           | status   |
| assigned                         | under_review      | executor                       | status   |
| assigned                         | suspended         | manager, super_admin           | status   |
| under_review                     | sent_for_approval | executor                       | status   |
| under_review                     | rejected          | executor, manager, super_admin | status   |
| under_review                     | suspended         | manager, super_admin           | status   |
| sent_for_approval                | completed         | manager, super_admin           | status   |
| sent_for_approval                | rejected          | executor, manager, super_admin | status   |
| sent_for_approval                | suspended         | manager, super_admin           | status   |
| completed / rejected / suspended | -                 | (son nöqtə)                    | -        |

İcazəsiz keçid cəhdi **422** ("Bu status keçidi mümkün deyil"), rol uyğun deyilsə **403** ("Bu status keçidi üçün icazəniz yoxdur") qaytarır. **İcraçı təyini** ayrıca assign endpoint-i ilə edilir; qalan bütün keçidlər status endpoint-i ilə.

## 6\. Müraciətlər

### 6.1. Müraciət növbəsi (siyahı)

GET /api/admin/permit-applications

Rol: hər üç admin rolu. **Rəhbər/super_admin bütün müraciətləri**, **icraçı yalnız ona təyin olunanları** görür. Səhifələnir.

**Filtrlər (hamısı istəyə görə, query parametrləri):**

| Parametr          | Nümunə               | Təsvir                                                         |
| ----------------- | -------------------- | -------------------------------------------------------------- |
| status            | ?status=registered   | Statusa görə süz                                               |
| permit_service_id | ?permit_service_id=4 | İcazə növünə görə                                              |
| search            | ?search=APP-000001   | Müraciət nömrəsi, ad, soyad, hüquqi ad, FİN, VÖEN üzrə axtarış |
| per_page          | ?per_page=50         | Səhifə ölçüsü                                                  |

Hər element permit_service, assigned_user və files_count (yüklənmiş sənəd sayı) ilə gəlir.

### 6.2. Müraciət detalı

GET /api/admin/permit-applications/{id}

Rol: hər üç admin rolu (icraçı yalnız öz təyinatını; başqası → **404**).

Tam məlumat qaytarır: müraciətçi sahələri, permit_service, phones, trade_detail, files (yüklənmiş sənədlər), documents (yaranan yekun sənədlər), status_histories (hər dəyişikliyi kim etdi - changed_by_user), assigned_user.

### 6.3. İcraçıların siyahısı (təyinat üçün)

GET /api/admin/executors

Rol: manager, super_admin. Aktiv icraçıların qısa siyahısı (id, name, email) - təyinat ekranındakı seçim (dropdown) üçün.

### 6.4. İcraçı təyin etmək

POST /api/admin/permit-applications/{id}/assign

Rol: manager, super_admin. Body:

{ "assigned_to": 5 }

assigned_to **aktiv icraçının** id-si olmalıdır (başqa rol/deaktiv → **422**). Yalnız registered müraciətə edilə bilər (başqa status → **422**). Status registered → assigned olur.

### 6.5. Status dəyişmək

POST /api/admin/permit-applications/{id}/status

Rol: hər üç admin rolu (daxildə keçid+rol nəzarəti). Body:

{ "status": "under_review" }

İmtina üçün səbəb məcburidir:

{ "status": "rejected", "rejection_reason": "Sənədlər natamamdır." }

**Qəbul olunan status dəyərləri:** under_review, sent_for_approval, completed, rejected, suspended. (assigned bu endpoint-lə yox, assign ilə olur.)

**Xüsusi davranış:** - completed → **yekun sənəd avtomatik yaranır** (QR + barkod), approved_at yazılır. Cavabdakı documents massivində yeni sənəd görünür. - rejected → rejected_at və rejection_reason yazılır.

**Xətalar:** icazəsiz keçid → **422**; rol uyğunsuz → **403**; icraçı başqasının müraciətinə → **404**; rejected səbəbsiz → **422**.

### 6.6. Yekun sənədi yükləmək

GET /api/admin/permit-applications/{id}/documents/{documentId}/download

Rol: hər üç admin rolu (icraçı yalnız öz təyinatı). Təsdiqdə yaranan PDF-i (QR + barkodlu) qaytarır. documentId - detaldakı documents\[\].id.

## 7\. İstifadəçi idarəetməsi (yalnız super_admin)

Nazirlik işçilərini (manager, executor, super_admin) yaratmaq və idarə etmək. Bütün endpoint-lər **yalnız super_admin** üçündür (başqa rol → **403**). Vətəndaşlar bu siyahıda görünmür.

### 7.1. İşçilərin siyahısı

GET /api/admin/users

Yalnız işçi rolları. Filtrlər: ?role=executor, ?search=... (ad/e-poçt), ?per_page=N. Səhifələnir.

### 7.2. Yeni işçi

POST /api/admin/users

{  
"name": "Rəhbər İşçi",  
"email": "<rehber@energy.az>",  
"password": "parol1234",  
"role": "manager",  
"is_active": true  
}

role yalnız executor, manager, super_admin ola bilər (citizen → **422**). password ən azı 8 simvol. email unikal. Cavabda parol **qaytarılmır**.

### 7.3. İşçi detalı

GET /api/admin/users/{id}

Yalnız işçi hesabları (vətəndaş id-si → **404**).

### 7.4. İşçini yeniləmək

PUT /api/admin/users/{id}

Body POST ilə eynidir, amma password **istəyə görədir** (boş buraxsanız köhnə parol qalır). Rol dəyişmək də buradan.

**Məhdudiyyətlər:** - Super_admin **öz rolunu** dəyişə bilməz → **422** ("Öz rolunuzu dəyişə bilməzsiniz"). - Super_admin **özünü deaktiv** edə bilməz → **422**.

### 7.5. İşçini deaktiv etmək

DELETE /api/admin/users/{id}

Faktiki silmir - is_active = false edir (keçmiş əməliyyatları tarixçədə qalır). Deaktiv işçi login edə bilmir. Super_admin özünü deaktiv edə bilməz → **422**.

## 8\. Public sənəd yoxlaması (auth yoxdur)

GET /api/verify/{token}

Bu endpoint **açıqdır** (token tələb olunmur) - yekun sənədin üzərindəki QR bura işarə edir. Sənədi əlində tutan hər kəs həqiqiliyini yoxlaya bilər.

**Həqiqi sənəd (200):**

{  
"status": "success",  
"valid": true,  
"message": "Sənəd həqiqidir və Energetika Nazirliyi tərəfindən verilmişdir.",  
"data": {  
"document_number": "E-5/2026",  
"permit_name": "Elektrik enerjisinin nəqlinə icazə",  
"applicant": "Elvin M.",  
"issued_at": "06.07.2026",  
"status": "completed"  
}  
}

**Tapılmayan/saxta token (404):** valid: false. Məxfilik üçün yalnız minimal, maskalı məlumat qaytarılır (FİN, tam VÖEN, e-poçt, ünvan **yoxdur**).

## 9\. Qeydlər və gələcək işlər

- **Autentifikasiya müvəqqətidir.** Hazırda email+parol (Sanctum). Canlıda nazirliyin **Active Directory (LDAP)** ilə əvəz olunacaq - endpoint-lər və rol məntiqi dəyişməyəcək, yalnız parol yoxlaması AD-yə keçəcək.
- **Yekun sənəd şablonu müvəqqətidir.** Rəsmi tərtibat Əlavə №2-dədir; sifarişçidən alınandan sonra dəqiqləşəcək. Sənəd nömrəsi formatı da (E-5/2026) müvəqqətidir.
- **QR/APP_URL.** QR-dakı yoxlama URL-i .env-dəki APP_URL-dən gəlir; serverdə düzgün domenə qurulmalıdır.
- **E-poçt bildirişləri** (sənəd hazır olanda) hələ qurulmayıb.
- **Verify səhifəsi** hazırda JSON qaytarır; vətəndaş brauzerdə açdığı üçün gələcəkdə HTML səhifə olması nəzərdə tutulur.

## Əlavə: Endpoint xülasəsi

| Metod  | Yol                                                            | Rol                  | Təyinat                       |
| ------ | -------------------------------------------------------------- | -------------------- | ----------------------------- |
| POST   | /api/admin/login                                               | (açıq)               | Giriş, token almaq            |
| GET    | /api/admin/me                                                  | hər admin            | Cari istifadəçi               |
| POST   | /api/admin/logout                                              | hər admin            | Çıxış                         |
| GET    | /api/admin/permit-applications                                 | hər admin            | Müraciət növbəsi (rola görə)  |
| GET    | /api/admin/permit-applications/{id}                            | hər admin            | Müraciət detalı               |
| GET    | /api/admin/executors                                           | manager, super_admin | Aktiv icraçıların siyahısı    |
| POST   | /api/admin/permit-applications/{id}/assign                     | manager, super_admin | İcraçı təyin etmək            |
| POST   | /api/admin/permit-applications/{id}/status                     | hər admin\*          | Status dəyişmək               |
| GET    | /api/admin/permit-applications/{id}/documents/{docId}/download | hər admin            | Yekun sənədi yükləmək         |
| GET    | /api/admin/users                                               | super_admin          | İşçilərin siyahısı            |
| POST   | /api/admin/users                                               | super_admin          | Yeni işçi                     |
| GET    | /api/admin/users/{id}                                          | super_admin          | İşçi detalı                   |
| PUT    | /api/admin/users/{id}                                          | super_admin          | İşçini yeniləmək              |
| DELETE | /api/admin/users/{id}                                          | super_admin          | İşçini deaktiv etmək          |
| GET    | /api/verify/{token}                                            | (açıq)               | Sənədin həqiqiliyini yoxlamaq |

\*Status endpoint-inə hər üç admin rolu çata bilər, amma hansı keçidi kimin edə biləcəyini 5-ci bölmədəki cədvəl müəyyən edir.