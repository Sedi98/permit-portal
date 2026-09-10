# Ödənişsiz İcazələr (PS-002, PS-013) — Frontend Bələdçisi

## Nə dəyişdi

15 icazədən, **2-si** (PS-002 — "Mülki dövriyyəsi məhdudlaşdırılmış əşyaların dövriyyəsinə icazə", PS-013 — "Neft və neft məhsullarının emalına icazə"), artıq, **dövlət rüsumu tələb etmir** — bu icazələrdə, "Xidməti Məruzə" təsdiqləndikdən sonra, ödəniş mərhələsi, **tamamilə keçilir**, müraciət, birbaşa, Nazir müavininin, imza növbəsinə keçir.

---

## 1. Bu, hansı icazələr, necə bilinir

```
GET /api/permit-services
GET /api/admin/permit-services
```
Hər icazənin, öz cavabında, indi, yeni bir sahə var:
```json
{ "id": 2, "name": "...", "requires_payment": false }
```
`requires_payment: false` olan icazələrdə, aşağıdakı, bütün, dəyişikliklər, tətbiq olunur. Digər, 13 icazədə (`requires_payment: true`), **heç, nə dəyişmir.**

---

## 2. İcraçının, öz ekranında — nə dəyişir

### "Xidməti Məruzə" tamamlananda

`requires_payment: false` olan icazələrdə, **"Ödəniş cədvəli hazırla"** düyməsi, artıq, **göstərilməməlidir** — bu, addım, tamamilə, keçilir.

### Əvəzinə, göstər

Müraciət, statusu, **`assigned`** olaraq qalır (dəyişmir), amma, icraçının ekranında, indi, **birbaşa**, aşağıdakı, düymə görünməlidir:

**"İmzaya Göndər"** (adı, `requires_payment: true` icazələrdəki, "Ödənişi Təsdiqlə" düyməsindən, FƏRQLİ görünsün, amma, **texniki olaraq, EYNİ endpoint-i çağırır**):

```
POST /admin/permit-applications/{id}/confirm-payment-received
```

Bu, çağırıldıqda, status, birbaşa, **`awaiting_signature`**-ə keçir — Nazir müavininin, öz, imza növbəsinə düşür.

---

## 3. Vətəndaşın, öz tərəfində — nə dəyişir

Bu, 2 icazədə, vətəndaş, **heç vaxt**, "Ödəniş Tapşırığı" görməyəcək — çünki, `awaiting_payment`/`payment_review` statusları, bu icazələrdə, **ümumiyyətlə, baş vermir.** Frontend, bu icazələr üçün, "Ödəniş" bölməsini, ekranlarda, göstərməyə, ehtiyac duymayacaq.

---

## 4. Əməliyyat detalları/önizləmə (bilməyin faydalıdır)

`trade_detail`/`preview-document` endpoint-ləri (əvvəlki sənədə, bax), texniki olaraq, bu, 2, ödənişsiz icazədə də, **statusu `assigned` olarkən**, işləyir. Amma, praktiki olaraq, **PS-002/PS-013-ün, öz, `trade_detail`-ə, sahibliyi yoxdur** (bu, yalnız, PS-001-ə aiddir) — yəni, bu, icazələrdə, real, redaktə ediləcək, bir sahə, olmayacaq, önizləmə isə, sadəcə, blankın, öz, boş görünüşünü göstərəcək.

---

## Xülasə — status axını, müqayisə

| | Adi, 13 icazə | PS-002 / PS-013 |
|---|---|---|
| Xidməti Məruzə, tamamlanır | → `assigned` | → `assigned` (eyni) |
| Sonra | Ödəniş cədvəli (Viza+İmza) → `awaiting_payment` → vətəndaş ödəyir → `payment_review` → icraçı təsdiqləyir | **Birbaşa**, icraçı, "İmzaya Göndər" basır |
| Nəticə | → `awaiting_signature` | → `awaiting_signature` (eyni) |
