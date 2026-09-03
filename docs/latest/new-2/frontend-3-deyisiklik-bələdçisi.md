# Üç Yeni Dəyişiklik — Frontend Bələdçisi

---

## 1. Viza/İmza seçimində — eyni şəxs, iki dəfə seçilə bilməz

### Nə dəyişdi

```
POST /admin/permit-applications/{id}/confirmation-sequences
```
Bu sorğuda, `participants` massivində, **eyni `user_id`, birdən çox dəfə** (istənilən rol kombinasiyasında — həm viza, həm imza kimi) göndərilsə, backend, indi, bunu, rədd edir:

```json
{
  "status": "error",
  "errors": {
    "participants": ["Eyni şəxs, bu sənəddə, birdən çox rol (viza+imza+təsdiq) üçün, seçilə bilməz."]
  }
}
```
HTTP status: **422**

### Frontend-də, necə tətbiq et

Bu, backend-in, öz, **son, təhlükəsizlik xəttidir** — əsl, yaxşı təcrübə, bunun, **ümumiyyətlə, baş verməməsidir.** Formada:

- Admin, birini, "Vizalayan" kimi seçəndə, həmin şəxsi, **"İmzalayan"/"Təsdiqləyən" dropdown-larından, dərhal, çıxar** (canlı, real-vaxt filtrləmə).
- Bu, backend-in, `422`-sini, adətən, **heç görünməyəcək** edir — istifadəçi, səhv seçim, ümumiyyətlə, edə bilməyəcək.

---

## 2. Ödənişdən, PDF-ə qədər — tam zəncir

Vətəndaş, "Ödədim" basandan, PDF, yaranana qədər, **3, ardıcıl addım** var — bunların, heç biri, avtomatik, "bir andaca" baş vermir, hər biri, öz, ayrıca, insan təsdiqini gözləyir:

```
1. Vətəndaş: POST /permit-applications/{id}/pay
   → status: payment_review

2. İcraçı, ödənişi (bank qəbzini) yoxlayır, təsdiqləyir:
   POST /admin/permit-applications/{id}/confirm-payment-received
   → status: awaiting_signature

3. Nazir müavini, son sənədi, imzalayır:
   POST /admin/permit-applications/{id}/sign
   → status: completed
   → BU ANDACA, QR-kodlu, rəsmi PDF, avtomatik yaranır
   → BU ANDACA, vətəndaşa, bildiriş, avtomatik göndərilir (bax, aşağı, 3-cü bölmə)
```

**Frontend-ə, vacib qeyd:** vətəndaş, "Ödədim" basandan sonra, **dərhal, PDF gözləməsin** — bu, hələ, icraçının, VƏ, nazir müavininin, öz, ayrıca təsdiqlərini gözləyir. Vətəndaşın, öz "Ödəniş tarixçəsi" ekranında, bu aralıq mərhələlərin (`payment_review`, `awaiting_signature`), öz, aydın statusları göstərilməlidir ki, vətəndaş, "niyə, hələ, sənədim gəlmədi?" deyə, çaşmasın.

### ⚠️ 2-ci addım — bura, VİZA/İMZA TƏLƏB OLUNMUR, sadə, tək-addımlı bir təsdiqdir

Diqqət et — bu, **iki, ayrı şeyi**, qarışdırmamaq üçün, vacibdir:

- **Ödəniş CƏDVƏLİNİ, YARATMAQ** (icraçı, məbləği yazıb, göndərəndə) — bu, viza+imza tələb edir (əvvəlki, Ssenari A-da, izah olunub).
- **Ödənişin, ARTIQ ALINDIĞINI, TƏSDİQLƏMƏK** (yuxarıdakı, 2-ci addım) — bu, **fərqlidir.** Burada, heç bir `ConfirmationSequence` yaranmır, viza/imza gözlənilmir — **yalnız, təyin olunmuş icraçı**, bank qəbzinə baxıb, tək, bir düymə ilə (`POST .../confirm-payment-received`), bunu, təsdiqləyir.

### ⚠️ 3-cü addım — "İmzalanmamışlar" siyahısı, KONKRET bir nazir müavininə "yönləndirilmir"

Digər siyahılardan (Yeni daxil olanlar və s.) fərqli olaraq, bu, **rol-səviyyəli, açıq** bir növbədir — `deputy_minister` rolunda olan, **istənilən** istifadəçi, bu siyahını görüb, istənilən müraciəti, imzalaya bilər. Burada, "əvvəlcə, konkret adama, təyin olunmalıdır" kimi, bir şərt, yoxdur.

---

## 3. Bildirişdə, indi, sənəd ID-si də var (icazə tamamlananda)

### Nə dəyişdi

Müraciət, `completed` statusuna keçəndə (Nazir müavini, imzalayanda), vətəndaşa, gedən bildirişin, `data` sahəsi, indi, **iki** ID daşıyır:

```json
{
  "title": "İcazəniz hazırdır",
  "data": {
    "permit_application_id": 12,
    "document_id": 3
  }
}
```

### Frontend-də, necə tətbiq et

Bildirişə klikləyəndə, **birbaşa, əlavə sorğu etmədən**, endirmə linkini, qur:
```
GET /api/permit-applications/{data.permit_application_id}/documents/{data.document_id}/download
```

---

## 4. "Tamamlanmış Müraciətlər" — birbaşa, "Endir" düyməsi

### Nə dəyişdi

```
GET /api/permit-applications?status=completed
```
Bu, siyahı endpoint-i, indi, **hər sətirdə**, sənəd məlumatını da, birbaşa, gətirir:

```json
{
  "id": 12,
  "status": "completed",
  "application_no": "D/O-İ-3/2026",
  "documents": [
    { "id": 3, "document_number": "D/O-İ-3/2026", "generated_at": "2026-08-29T10:00:00Z" }
  ]
}
```

### Frontend-də, necə tətbiq et

"Tamamlanmış Müraciətlər" siyahısında, hər sətirdə, **"Detal" əvəzinə (ya, ona əlavə), "Endir" düyməsi** göstər:

```
GET /api/permit-applications/{id}/documents/{documents[0].id}/download
```

Vətəndaş, siyahıdan, çıxmadan, birbaşa, PDF-i, endirə bilməlidir.
