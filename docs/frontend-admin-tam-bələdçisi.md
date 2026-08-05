# Admin Panel — Tam Bələdçi (Yenilənmiş İş Axını)

Bu sənəd, admin panelin, **yönləndirmədən, son imzaya qədər** olan bütün yeni iş axınını, VƏ super_admin-in, digər rollardan necə fərqləndiyini, **bir yerdə** əhatə edir.

> **Ayrıca, öz sənədləri olan bölmələr** (bu sənəddə təkrarlanmır): **İstifadəçilər** (`frontend-istifadeci-idareetmesi-bələdçisi.md`), **İcazələr (növlər)** (`frontend-icazeler-idareetmesi-bələdçisi.md`), **Xidmət Məmnuniyyəti statistikası** (`frontend-xidmet-memnuniyyeti-bələdçisi.md`), **mygov ID giriş** (`frontend-mygov-id-giris-bələdçisi.md`).

---

## 1. Ən vacib prinsip — HAMI, EYNİ MENYUNU GÖRÜR

Bütün rollar (icraçı, şöbə müdiri, nazir müavini, super_admin), admin paneldə, **eyni sol menyunu** görür. Fərq, bəndlərin **özündə deyil, məzmununda**dır — bir bənd, bir istifadəçidə boş, başqasında dolu ola bilər (çünki, iş, kimin nəyə **təyin olunduğuna**, kimin **hansı təsdiqlənmə ardıcılığında** iştirak etdiyinə görə bölünür, sabit rol-menyusuna görə yox).

**super_admin, bu qaydadan da kənarda deyil** — eyni menyunu görür, sadəcə, demək olar hər yerdə, "bu, sənə aiddirmi?" yoxlaması, onun üçün, **avtomatik keçərlidir** (bax, 11-ci bölmə — bir istisna ilə).

---

## 2. Sol menyu — tam siyahı

```
Əsas səhifə
Lövhə                                        → GET /admin/statistics
Müraciətlər
  ├─ Yeni daxil olanlar                      → bax 4-cü bölmə
  ├─ Yönləndirdiklərim                       → GET /admin/permit-applications?status_group=routed_by_me
  └─ İcra edilmişlər                         → GET /admin/permit-applications?status=completed
Çatışmazlıq haqqında bildiriş
  ├─ Viza üçün                               → GET /admin/confirmation-sequences/my-queue?type=deficiency&role=visa
  └─ İmza üçün                               → GET /admin/confirmation-sequences/my-queue?type=deficiency&role=sign
Xidməti Məruzə
  ├─ Viza üçün                               → GET /admin/confirmation-sequences/my-queue?type=report&role=visa
  ├─ İmza üçün                               → GET /admin/confirmation-sequences/my-queue?type=report&role=sign
  └─ Təsdiqləyən                             → GET /admin/confirmation-sequences/my-queue?type=report&role=approve
Ödənişlər
  ├─ Viza üçün                               → GET /admin/confirmation-sequences/my-queue?type=payment&role=visa
  ├─ İmza üçün                               → GET /admin/confirmation-sequences/my-queue?type=payment&role=sign
  └─ Təsdiq olunanlar                        → GET /admin/permit-applications?status=payment_review
İcazələrin Rəsmiləşdirilməsi
  ├─ İmzalanmamışlar                         → GET /admin/permit-applications-awaiting-signature
  └─ İcazələr                                → GET /admin/permit-applications?status=completed
Xidmət Məmnuniyyəti (statistika)             → (ayrıca sənəd)
İstifadəçilər (yalnız super_admin)           → (ayrıca sənəd)
İcazələr (növlər, yalnız super_admin)        → (ayrıca sənəd)
```

> **Qeyd:** "Müraciətlər / İcra edilmişlər" və "İcazələrin Rəsmiləşdirilməsi / İcazələr", **eyni endpoint-i** (`?status=completed`) işlədir — fərq, yalnız **əhatə dairəsindədir**. Birincisi, "Müraciətlər"in bir hissəsi olduğu üçün, avtomatik, **hər istifadəçinin öz** təyinatlarına süzülür (icraçı/şöbə müdiri üçün). İkincisi isə, "Rəsmiləşdirmə" bölməsinin bir hissəsi olduğu üçün, nazir müavini/super_admin üçün, **bütün** nazirliyin tam reyestri kimi düşünülməlidir. Kod baxımından, ikisi arasında fərq yoxdur — sadəcə, hansı menyu bəndindən açıldığına görə, istifadəçinin gözləntisi fərqlənir.

---

## 3. Lövhə — statistika

```
GET /admin/statistics
```
Rəhbər/super_admin — bütün nazirlik. İcraçı/şöbə müdiri — yalnız öz təyinatları.

---

## 4. "Yeni daxil olanlar"

Bu bəndin **arxasındakı status, rola görə dəyişir**, sadəcə görünən ad eynidir:

| Kim | Sorğu |
|---|---|
| Nazir müavini, super_admin | `GET /admin/permit-applications?status=registered` |
| İcraçı, şöbə müdiri | `GET /admin/permit-applications?status=assigned` (avtomatik, öz təyinatına süzülür) |

### Detala girmək

```
GET /admin/permit-applications/{id}
```
**Cavab:** müraciət məlumatları, `assignees` (kim əsas, kim müştərək), `files` (rədd/qəbul statusları ilə), `status_histories`.

---

## 5. Yönləndirmə (ilkin VƏ kaskad — EYNİ endpoint)

### Namizədlər (selectbox)

```
GET /admin/routing-candidates
```
**Cavab:** admin panelə giriş edə bilən **hamı** (rolundan asılı olmadan).

### Göndər

```
POST /admin/permit-applications/{id}/route
```
```json
{
  "main_user_id": 6,
  "joint_user_ids": [7, 8],
  "note": "Təcili baxılsın."
}
```

| Kim, nə vaxt | Nə baş verir |
|---|---|
| Nazir müavini/super_admin, `registered`-də | Status → `assigned` |
| Cari təyin olunan (əsas VƏ YA müştərək), `assigned`-də | Status **dəyişmir**, təyinat **yenilənir** (köhnə silinir, yeni yazılır) |

**Vacib:** müştərək icraçı, əsas icraçının etdiyi **hər şeyi** edə bilir — heç bir fərq yoxdur.

### "Yönləndirdiklərim"

```
GET /admin/permit-applications?status_group=routed_by_me
```
Bu, **status tarixçəsindən** (kim, nə vaxt yönləndirib) gəlir — hazırkı təyinatdan asılı deyil (yönləndirdiyin, sonra başqasına keçsə belə, burada qalır).

---

## 6. Fayl icmalı (yalnız `assigned` statusunda)

```
POST /admin/permit-applications/{id}/files/{fileId}/review
```
```json
{ "review_status": "accepted" }
```
və ya
```json
{ "review_status": "rejected", "review_note": "Səbəb (məcburidir)." }
```

Bunlardan sonra, ekranın altında:
- **Hamısı `accepted`** → "Xidməti Məruzə Hazırla" düyməsi
- **Ən azı biri `rejected`** → "Çatışmazlıq Bildirişi Hazırla" düyməsi
- **Hər hansı biri `pending` qalıb** → heç bir düymə

---

## 7. Çatışmazlıq bildirişi

### Yarat

```
POST /admin/permit-applications/{id}/confirmation-sequences
```
```json
{
  "type": "deficiency",
  "body": "Bildiriş mətni.",
  "participants": [
    { "user_id": 5, "role": "visa" },
    { "user_id": 3, "role": "sign" }
  ]
}
```
(`role`: yalnız `visa`/`sign` icazəlidir bu tipdə.) Status → `deficiency_confirmation`.

### Təsdiqlə (hər iştirakçı, öz növbəsindən)

```
GET /admin/confirmation-sequences/my-queue?type=deficiency&role=visa   (ya role=sign)
```
```
POST /admin/confirmation-participants/{participantId}/approve
```
```json
{ "note": "Uyğundur." }
```

**Hər ikisi (viza+imza) tamamlananda:** status → `awaiting_revision`, vətəndaşa görünür. Vətəndaş düzəldib göndərəndə, status → `assigned` (**direkt, elə həmin icraçıya**, yenidən nazir müavininə getmədən).

---

## 8. Xidməti Məruzə

### Yarat — YALNIZ bütün fayllar `accepted`dirsə

```
POST /admin/permit-applications/{id}/confirmation-sequences
```
```json
{
  "type": "report",
  "title": "Xidməti məruzə",
  "body": "Mətn.",
  "participants": [
    { "user_id": 6, "role": "visa" },
    { "user_id": 5, "role": "sign" },
    { "user_id": 3, "role": "approve" }
  ]
}
```
(`title` — məcburidir, `role`: `visa`/`sign`/`approve`, üçü də icazəlidir.) Status → `report_confirmation`.

### Təsdiqlə

```
GET /admin/confirmation-sequences/my-queue?type=report&role=visa   (sign, approve)
```
```
POST /admin/confirmation-participants/{participantId}/approve
```

**Üçü də (viza+imza+təsdiq) tamamlananda:** status → `assigned` (**ödəniş cədvəli** üçün geri qayıdır, "Yeni daxil olanlar"a yox).

---

## 9. Ödəniş

### Cədvəl — icraçı, məbləği yazır

Ekranda: Xidmət (dolu), Xidmət verən Orqan/Qurum (dolu), Ödəniş (input).

### Yarat — YALNIZ xidməti məruzə artıq təsdiqlənibsə

```
POST /admin/permit-applications/{id}/confirmation-sequences
```
```json
{
  "type": "payment",
  "body": "Dövlət rüsumu ödənişi tələb olunur.",
  "amount": 50.00,
  "participants": [
    { "user_id": 6, "role": "visa" },
    { "user_id": 5, "role": "sign" }
  ]
}
```
Bu, **dərhal**, `invoice_no`-nu (müvəqqəti, öz-daxili format) yaradır, `payment_amount`-ı yazır. Status → `payment_confirmation`.

### Təsdiqlə

```
GET /admin/confirmation-sequences/my-queue?type=payment&role=visa   (sign)
```
```
POST /admin/confirmation-participants/{participantId}/approve
```

**Hər ikisi tamamlananda:** status → `awaiting_payment`, vətəndaşa görünür (hesab-faktura ilə birlikdə).

### Ödəniş qəbulunu təsdiqlə (vətəndaş "Ödədim" basdıqdan sonra)

Siyahı:
```
GET /admin/permit-applications?status=payment_review
```
Detal (qəbz əvəzinə, `invoice_no`/`payment_amount`/`paid_at`):
```
GET /admin/permit-applications/{id}
```
Təsdiqlə:
```
POST /admin/permit-applications/{id}/confirm-payment-received
```
**Body yoxdur.** Status → `awaiting_signature`.

---

## 10. Rəsmiləşdirmə (son imza)

### Siyahı

```
GET /admin/permit-applications-awaiting-signature
```

### Popup önizləməsi

```
GET /admin/permit-applications/{id}
```
(QR-sız görünüş — sadəcə, mövcud məlumatlarla.)

### İmzala

```
POST /admin/permit-applications/{id}/sign
```
**Body yoxdur.** Bu, QR-lı PDF-i yaradır, status → `completed`.

### "İcazələr" siyahısı, sonra

```
GET /admin/permit-applications?status=completed
```
Endirmə düyməsi:
```
GET /admin/permit-applications/{id}/documents/{documentId}/download
```
(`documentId` — `show()` cavabındakı `documents[0].id`.)

---

## 11. Super Admin — digər rollardan fərqlər

### 11.1. "Yeni daxil olanlar" — unscoped

Digər rollardan fərqli olaraq, super_admin, `?status=assigned` çağıranda, **yalnız öz təyinatlarını yox, BÜTÜN nazirliyin** təyin olunmuş müraciətlərini görür (`assignedToUser()` süzgəci, ona tətbiq olunmur).

### 11.2. Yönləndirmə — istənilən müraciətdə

Super_admin, **istənilən** müraciəti (özünə təyin olunub-olunmamasından asılı olmayaraq), istənilən statusda (`registered` VƏ YA `assigned`), yönləndirə/yenidən yönləndirə bilər.

### 11.3. Fayl icmalı — istənilən müraciətdə

Öz təyinatı olmasa belə, **istənilən** müraciətin fayllarını qəbul/rədd edə bilər.

### 11.4. Çatışmazlıq/Xidməti Məruzə/Ödəniş yaratma — istənilən müraciətdə

Öz təyinatı olmasa belə, **istənilən** müraciətdə, bu üç növün hər birini yarada bilər.

### 11.5. Ödəniş qəbulunu təsdiqləmə — istənilən müraciətdə

Öz təyinatı olmasa belə, **istənilən** müraciətdə edə bilər.

### 11.6. Statistika — bütün nazirlik

Heç bir süzgəc yoxdur.

### 11.7. ⚠️ Ən vacib, kiçik bir asimmetriya — "Təsdiqlə" ilə "Öz növbəm"

Bura, diqqətli olmağa dəyər — **iki fərqli davranış**, bir-birinə **uyğun gəlmir.**

**`approve()` — super_admin, HƏR KƏSİN yerinə təsdiqləyə bilir:**
```
POST /admin/confirmation-participants/{id}/approve
```
Bu endpoint-in daxili yoxlaması:
```php
if ($confirmationParticipant->user_id !== $user->id && ! $user->hasRole(SUPER_ADMIN)) {
    abort(404, ...);
}
```
Super_admin, **özü seçilməsə belə**, istənilən iştirakçı sətrini (`participant_id`-ni bilirsə), təsdiqləyə bilir.

**`my-queue()` — AMMA, bu, YALNIZ super_adminin ÖZ sətirlərini göstərir:**
```
GET /admin/confirmation-sequences/my-queue?type=...&role=...
```
Bu endpoint-in daxili sorğusu:
```php
->where('user_id', $user->id)   // ← SƏRT, super_admin üçün İSTİSNA YOXDUR
```

**Praktiki nəticə:** super_admin, **başqasının əvəzinə** təsdiqləmək istəsə (məsələn, işdən çıxmış bir işçinin, gözləyən vizasını təsdiqləmək üçün), bunu, **"Öz növbəm" siyahısından TAPA BİLMƏZ** — çünki, o sətir, ONUN üçün deyil, my-queue-da görünmür. Bunun əvəzinə, müraciətin öz detalına (`GET /admin/permit-applications/{id}` → `confirmationSequences[].participants[]`) girib, **lazımi `participant_id`-ni əl ilə tapmalı**, sonra, `approve()`-u, bu ID ilə, **birbaşa** çağırmalıdır.

**Frontend üçün nəticə:** super_admin panelində, "başqasının əvəzinə təsdiqlə" funksiyası quracaqsansa, bu, ayrı bir UI axını (müraciət detalından, iştirakçı siyahısını göstərib, hər sətrin yanında bir "Təsdiqlə" düyməsi) tələb edəcək — sadəcə, adi "my-queue" ekranını təkrarlamaqla, bu iş görülməz.

### 11.8. Rəsmiləşdirmə — burada, əslində, ÜSTÜNLÜK YOXDUR

```
GET /admin/permit-applications-awaiting-signature
POST /admin/permit-applications/{id}/sign
```
Bu ikisi, **route səviyyəsində**, `role:deputy_minister,super_admin` ilə məhdudlaşdırılıb — yəni, bura, **icraçı/şöbə müdiri, heç vaxt, heç bir halda, giriş edə bilməz** (öz təyinatları olsa belə). Super_admin, burada, sadəcə, **nazir müavini ilə bərabər səviyyədədir**, ondan "üstün" deyil.

### 11.9. Yalnız super_admin-ə xas bölmələr

- **İstifadəçilər** — tam CRUD, digər heç bir rola açıq deyil.
- **İcazələr (növlər)** — tam CRUD, digər heç bir rola açıq deyil.

(Hər ikisinin, öz, ayrıca, tam sənədi var.)

### 11.10. ⚠️ Sərhəd — super_admin, VƏTƏNDAŞIN ÖZ tərəfində, "hər şeyi görən" DEYİL

Bu, vacib bir aydınlıqdır: super_admin-in bütün bu geniş səlahiyyəti, **yalnız admin panelin öz endpoint-lərinə (`/admin/...`) aiddir.** Vətəndaş tərəfinin öz endpoint-ləri (`PermitApplicationController`, vətəndaşın müraciət yaratma/ödəmə/yenidən göndərmə axını) — bunların **hər birində**, sahiblik yoxlaması, sərt şəkildə:
```php
if ($permitApplication->user_id !== auth()->id()) {
    abort(404, ...);
}
```
Burada, **heç bir yerdə, super_admin üçün istisna yoxdur.** Yəni, super_admin, məsələn, bir vətəndaşın əvəzinə, onun "Ödədim" düyməsini basa bilməz, ya onun qaralamasını redaktə edə bilməz — bu, admin panelin işi deyil, tamamilə ayrı, vətəndaşın öz sistemidir.

---

## 12. Status adları (azərbaycanca)

| `status` | Ad |
|---|---|
| `registered` | Qeydiyyata alındı |
| `assigned` | İcraçıya həvalə edilib |
| `deficiency_confirmation` | Çatışmazlıq bildirişi təsdiqlənir |
| `awaiting_revision` | Düzəliş gözlənilir |
| `report_confirmation` | Xidməti məruzə təsdiqlənir |
| `payment_confirmation` | Ödəniş tapşırığı təsdiqlənir |
| `awaiting_payment` | Ödəniş gözlənilir |
| `payment_review` | Ödəniş yoxlanılır |
| `awaiting_signature` | İmza gözlənilir |
| `completed` | Tamamlandı |

---

## 13. Açıq qalan suallar

1. **`rejected`/`suspended`/`unprocessed`** — bu statusların, yeni modeldə, hansı ekranlardan tətiklənəcəyi, hələ təsvir olunmayıb.
2. **Real E-Rüsum inteqrasiyası** — `invoice_no`, hazırda, öz-daxili, müvəqqəti formatdadır.
3. **Real ASAN Pay inteqrasiyası** — vətəndaşın "Ödədim" düyməsi, hazırda, sınaq rejimindədir.
