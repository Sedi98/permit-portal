# Xidməti Məruzə — 3 Ssenari (A/B/C) — Frontend Bələdçisi

Bu, icraçının, bir müraciətə, **necə nəticə verə biləcəyini** (icazə ver / çatışmazlıq bildir / imtina et), VƏ, hər birinin, öz, tam axınını, əhatə edir. Hər üçü, **eyni, ortaq mexanizmi** (`ConfirmationSequence`) işlədir, yalnız, `type` sahəsi, fərqlənir.

---

## Ssenari A — Müsbət (İcazə verilir)

### Addımlar

```
1. İcraçı, faylları, "accepted" edir (hamısı)
2. POST /admin/permit-applications/{id}/confirmation-sequences
   { "type": "report", "title": "...", "body": "...",
     "participants": [
       {"user_id": X, "role": "visa"},      ← İqtisadiyyat/Hüquq şöbəsi
       {"user_id": Y, "role": "sign"},      ← Şöbə müdiri
       {"user_id": Z, "role": "approve"}    ← Nazir müavini
     ] }
   → status: report_confirmation
3. Hər iştirakçı, öz növbəsində (my-queue?type=report&role=...) təsdiqləyir
4. Hamısı, təsdiqləyəndə → status: assigned (avtomatik)
5. İcraçı, ödəniş cədvəlini hazırlayır:
   POST .../confirmation-sequences
   { "type": "payment", "amount": 50, "body": "...",
     "participants": [{"role": "visa"}, {"role": "sign"}] }
   → status: payment_confirmation
6. Viza+imza, tamamlananda → status: awaiting_payment
7. Vətəndaş, POST .../pay → status: payment_review
8. İcraçı, POST .../confirm-payment-received → status: awaiting_signature
9. Nazir müavini, POST .../sign → status: completed, QR-kodlu sənəd yaranır
```

---

## Ssenari B — Çatışmazlıq (10 iş günü limiti)

### Addımlar

```
1. İcraçı, ən azı, bir faylı, "rejected" edir
2. POST /admin/.../confirmation-sequences
   { "type": "deficiency", "body": "Çatışmazlığın izahı...",
     "participants": [{"role": "visa"}, {"role": "sign"}] }
   → status: deficiency_confirmation
3. Viza+imza, tamamlananda → status: awaiting_revision
   (BU ANDA, backend, avtomatik, 10 İŞ GÜNÜNƏ görə,
   son tarixi (deficiency_deadline_at) hesablayır)
4. Vətəndaş, öz "Çatışmazlıq bildirişi" səhifəsində, mətni oxuyur,
   sənədi dəyişir, POST .../resubmit → status: assigned
   (DİRECT, elə, həmin icraçıya — nazir müavininə qayıtmır)
```

### ⚠️ Vətəndaş, 10 İŞ GÜNÜ ərzində, cavab verməzsə

Bu, **vətəndaşın, heç bir hərəkəti olmadan**, öz-özünə, avtomatik baş verir (hər gün, saat 09:00-da, server, öz-özünə yoxlayır):

```
status: awaiting_revision → status: unprocessed (avtomatik)
```

Vətəndaşa, avtomatik, bir bildiriş gedir: *"...10 iş günlük düzəliş müddətində tamamlanmadığı üçün, baxılmamış saxlanıldı."*

**Frontend-ə, vacib qeyd:** vətəndaşın, "Çatışmazlıq bildirişi" ekranında, **son tarixi** (`deficiency_deadline_at`, `GET /permit-applications/{id}` cavabında, mövcuddur) göstərmək, faydalıdır — vətəndaş, "neçə günüm qalıb?" sualına, cavab tapsın.

---

## Ssenari C — İmtina

### Addımlar

```
1. İcraçı, müraciətə, "imtina" qərarı verir (assigned statusunda)
2. POST /admin/.../confirmation-sequences
   { "type": "rejection", "body": "İmtinanın, hüquqi əsası...",
     "participants": [
       {"user_id": X, "role": "visa"},   ← İqtisadiyyat/Hüquq şöbəsi
       {"user_id": Y, "role": "sign"}    ← Nazir müavini
     ] }
   → status: rejection_confirmation
3. Viza+imza, tamamlananda → status: rejected (SON, geri dönüşü yoxdur)
```

Vətəndaşa, avtomatik, bildiriş gedir: *"...təəssüf ki, imtina edilib. Səbəbi, müraciətinizin öz səhifəsində, görə bilərsiniz."*

**Frontend-ə qeyd:** imtinanın, öz, ətraflı səbəbi (`body`), `confirmationSequences` massivində (`type: rejection`) gəlir — vətəndaşın, öz müraciət detalında, bunu, oxuya bilməsini, təmin et.

---

## Status Xülasəsi — hər 3 ssenari, bir yerdə

| Status | Hansı ssenari | Sonrakı (avtomatik) |
|---|---|---|
| `report_confirmation` | A | → `assigned` |
| `payment_confirmation` | A | → `awaiting_payment` |
| `awaiting_payment` → `payment_review` → `awaiting_signature` → `completed` | A | Son |
| `deficiency_confirmation` | B | → `awaiting_revision` |
| `awaiting_revision` | B | → `assigned` (vətəndaş, vaxtında) **VƏ YA** → `unprocessed` (10 gün, avtomatik) |
| `unprocessed` | B | Son (baxılmamış saxlanılıb) |
| `rejection_confirmation` | C | → `rejected` |
| `rejected` | C | Son |

---

## Bir icraçı, "assigned" statusunda, hansı 3 düyməni görə bilər

Fayl icmalının, öz nəticəsinə görə, icraçının ekranında, bu, **3 fərqli yol** açıla bilər:

| Fayl icmalının nəticəsi | Açılan düymə | Ssenari |
|---|---|---|
| Bütün fayllar, "accepted" | "Xidməti Məruzə Hazırla" | A |
| Ən azı, bir fayl, "rejected" | "Çatışmazlıq Bildirişi Hazırla" | B |
| (İstənilən vaxt, icraçının, öz qərarı ilə) | "İmtina Et" | C |

**Diqqət — "İmtina Et" düyməsi, fayl icmalının nəticəsindən, ASILI DEYİL** — bu, icraçının, istənilən vaxt (adətən, müraciətin, öz məzmununa görə, qanuni əsasla) verə biləcəyi, ayrıca bir qərardır.
