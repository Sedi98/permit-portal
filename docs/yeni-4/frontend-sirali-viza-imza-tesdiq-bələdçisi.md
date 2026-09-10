# Sıralı Viza/İmza/Təsdiq — Frontend Bələdçisi

## 1. İstifadəçi axtarışı üçün — mövcud endpoint, indi, şöbə ilə

```
GET /admin/routing-candidates
```
```json
{
  "data": [
    { "id": 6, "name": "Ulvi Əlili", "fin": "...", "role": "executor", "department_id": 2, "department": { "id": 2, "name": "İqtisadiyyat Şöbəsi" } }
  ]
}
```
`role`-u, ekranda, "vəzifə" kimi göstər (`executor` → "İcraçı", `department_head` → "Şöbə müdiri", `deputy_minister` → "Nazir müavini") — bu, sənin, öz, mövcud, tərcümə cədvəlinlə, eynidir.

---

## 2. Forma — dəqiq, sənin, təsvir etdiyin kimi

1. Axtarışlı istifadəçi selectbox-u (ad, şöbə, vəzifə göstərilir).
2. Yanında, ikinci selectbox: **Viza / İmza / Təsdiq**.
3. **"Əlavə et"** — cədvələ, sətir əlavə edir.
4. Cədvəl: **Ad — Rol — ↑↓ (sıra) — Sil.**
5. **"Göndər"**.

---

## 3. Göndərmə — `participants` massivinin, öz SIRASI, ƏHƏMİYYƏTLİDİR

```
POST /admin/permit-applications/{id}/confirmation-sequences
{
  "type": "report",
  "title": "...",
  "body": "...",
  "participants": [
    { "user_id": 6, "role": "visa" },
    { "user_id": 9, "role": "visa" },
    { "user_id": 12, "role": "visa" },
    { "user_id": 15, "role": "sign" },
    { "user_id": 20, "role": "approve" }
  ]
}
```

### ⚠️ ƏN VACİB QAYDA

**Backend, `participants` massivini, göndərildiyi, DƏQİQ SIRA ilə oxuyur** — cədvəldə, hansı sətir, əvvəl gəlirsə, massivdə də, elə, o sırada, göndər.

- **Rollar arası sıra (Viza → İmza → Təsdiq), HƏMİŞƏ, SABİTDİR** — cədvəldə, "İmza", "Viza"dan, yuxarıda göstərilsə belə, bunun, heç bir təsiri yoxdur, sistem, həmişə, əvvəlcə, bütün Vizaları, sonra, İmzanı, sonra, Təsdiqi, gözləyəcək.
- **Eyni ROL daxilində (3 Viza arasında), SIRA, REAL, ƏHƏMİYYƏT KƏSB EDİR** — bu, sənin, `↑↓` oxlarının, öz nəticəsidir. Yuxarıdakı, nümunədə: əvvəlcə, `user 6`, sonra, `user 9`, sonra, `user 12`, öz növbəsində, viza verəcək.

---

## 4. Nəticə — icraçının, öz növbə ekranı

```
GET /admin/confirmation-sequences/my-queue?type=report&role=visa
```

Bu, indi, **YALNIZ, öz növbəsi, doğrudan, gəlmiş** olan iştirakçıları qaytarır. Yəni:
- `user 6` (1-ci viza), dərhal, bu, siyahıda, görünəcək.
- `user 9` (2-ci viza), `user 6`, öz təsdiqini verənə qədər, **bu, siyahıda, HEÇ, GÖRÜNMƏYƏCƏK.**

---

## 5. Vaxtından-əvvəl, cəhd olsa

```
POST /admin/confirmation-participants/{id}/approve
```
Əgər, kimsə, öz növbəsi, hələ, gəlməmiş, bir sətri, (məsələn, ID-ni, birbaşa, bilərək) çağırsa:
```json
{
  "status": "error",
  "message": "Sizdən, əvvəlki, başqa bir şəxsin, hələ, öz təsdiqini gözləyirik — sizin, öz növbəniz, hələ, gəlməyib."
}
```
HTTP status: **422**

---

## 6. Bildiriş, indi, DƏYİŞİB — hamıya, EYNİ ANDA, GETMİR

Əvvəllər, göndəriləndə, **bütün** iştirakçılara, bildiriş gedirdi. İndi:
- **Yalnız, öz növbəsi, dərhal, gələn (adətən, hər rolun, ilk sırası)** iştirakçı(lar)a, ilk, göndərmədə, bildiriş gedir.
- **Hər, bir təsdiqdən sonra**, "növbə, kimə keçirsə", ona, YENİ, bir bildiriş, avtomatik gedir.

Yəni, frontend-in, öz, bildiriş göstərmə məntiqini, dəyişməyə, ehtiyac yoxdur — bu, elə, artıq, `GET /api/notifications`-in, öz, tanış formatında, gəlir, sadəcə, **daha, düzgün vaxtda**, gəlir.
