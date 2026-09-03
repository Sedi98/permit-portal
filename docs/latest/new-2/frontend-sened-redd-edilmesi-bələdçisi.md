# Sənəd Rədd Edilməsi — Frontend Bələdçisi

Bu, icraçının, bir sənədi rədd etməsindən, vətəndaşın, yalnız, o, konkret sənədi, yenidən yükləyib, göndərməsinə qədər, tam zənciri əhatə edir.

---

## 1. İcraçı, sənədi rədd edir

```
POST /admin/permit-applications/{id}/files/{fileId}/review
{ "review_status": "rejected", "review_note": "Sənəd, aydın oxunmur, yenidən skan edilməlidir." }
```
`review_note`, **məcburidir** (səbəb, boş buraxıla bilməz).

---

## 2. İcraçı, "Çatışmazlıq Bildirişi" hazırlayır (Viza + İmza)

```
POST /admin/permit-applications/{id}/confirmation-sequences
{
  "type": "deficiency",
  "body": "Şəxsiyyət vəsiqəsinin surəti, aydın oxunmadığı üçün, yenidən tələb olunur.",
  "participants": [{"user_id": X, "role": "visa"}, {"user_id": Y, "role": "sign"}]
}
```
Bu, statusu, `deficiency_confirmation`-a keçirir — **bu, hələ, vətəndaşa, heç nə göstərilmir**, seçilən şəxslərin, öz növbələrində, təsdiqləməsini gözləyir.

---

## 3. Viza + İmza, tamamlananda — vətəndaşa, bildiriş gedir

Hər ikisi, təsdiqlənən kimi, **avtomatik:**
- Status: **`awaiting_revision`** ("Düzəliş tələb olunur")
- Vətəndaşa, bildiriş gedir: *"...müraciətinizdə, düzəliş tələb olunur."*
- 10 iş günlük, avtomatik son tarix, təyin olunur (`deficiency_deadline_at`)

---

## 4. Vətəndaş, hansı sənədin, niyə rədd edildiyini, görür

```
GET /api/permit-applications/{id}
```
```json
{
  "status": "awaiting_revision",
  "deficiency_deadline_at": "2026-09-12T00:00:00Z",
  "files": [
    { "id": 5, "document_type": "Şəxsiyyət vəsiqəsinin surəti", "review_status": "rejected", "review_note": "Sənəd, aydın oxunmur..." },
    { "id": 6, "document_type": "Ərizə", "review_status": "accepted", "review_note": null }
  ]
}
```
Frontend, `review_status: "rejected"` olan, hər sətrin, yanında, `review_note`-u (səbəbi), aydın göstərməlidir — **qəbul olunmuş** (`accepted`) fayllara isə, toxunmaq, lazım deyil.

---

## 5. Vətəndaş, YALNIZ, rədd edilən sənədi, yenidən yükləyir

```
PUT /api/permit-applications/{id}/files/{fileId}
```
(`fileId` — məhz, 4-cü addımda, `rejected` görünən, o, konkret faylın, öz ID-si.) `form-data`: yalnız, `file` (yeni PDF).

**Diqqət — bu, digər, qəbul olunmuş fayllara, TOXUNMUR** — yalnız, göstərilən, `fileId`-nin, öz faylı, dəyişir. Backend, bu faylın, `review_status`-unu, avtomatik, yenidən, `pending`-ə salır.

---

## 6. Vətəndaş, düzəlişi, göndərir

```
POST /api/permit-applications/{id}/resubmit
```
Bu, statusu, **`assigned`**-ə keçirir — **DİRECT, elə, əvvəlki, eyni icraçıya** (nazir müavininə, yenidən yönləndirilmir). İcraçı, indi, yenidən, fayl icmalına baxır — əgər, hamısı, indi, qəbul olunarsa, Ssenari A (Xidməti Məruzə) davam edir.
