# FAQ (Tez-tez verilən suallar) — Frontend Bələdçisi

## 1. İctimai — sayt üçün, FAQ siyahısı (auth tələb olunmur)

```
GET /api/faqs
```

```json
{
  "status": "success",
  "data": [
    { "id": 1, "question": "Müraciəti, necə yarada bilərəm?", "answer": "..." },
    { "id": 2, "question": "Ödənişi, necə edirəm?", "answer": "..." }
  ]
}
```

Bu, yalnız, admin tərəfindən, **aktiv** edilmiş sualları, öz, təyin olunmuş sırası ilə qaytarır — göstərilməli, əlavə heç bir süzgəc, lazım deyil.

---

## 2. Admin panel — idarəetmə (yalnız, super_admin)

### 2.1. Siyahı (bütün suallar, aktiv/qeyri-aktiv, hamısı)

```
GET /api/admin/faqs
Authorization: Bearer <super_admin_token>
```
```json
{ "data": [{ "id": 1, "question": "...", "answer": "...", "display_order": 0, "is_active": true }] }
```

### 2.2. Yeni sual əlavə et

```
POST /api/admin/faqs
{
  "question": "Müraciəti, necə yarada bilərəm?",
  "answer": "Sayta, mygov ID ilə daxil olub...",
  "display_order": 1,
  "is_active": true
}
```

| Sahə | Növ | Qayda |
|---|---|---|
| `question` | `string` | Məcburi, maks. 500 simvol |
| `answer` | `string` | Məcburi |
| `display_order` | `integer` | Könüllü — kiçik rəqəm, daha yuxarıda göstərilir |
| `is_active` | `boolean` | Könüllü, defolt: `true` |

### 2.3. Sualı redaktə et

```
PUT /api/admin/faqs/{id}
{ "question": "...", "answer": "..." }
```
(Yalnız, göndərilən sahələr, yenilənir.)

### 2.4. Sualı sil

```
DELETE /api/admin/faqs/{id}
```
**Diqqət — bu, HƏQİQİ silmədir** (`PermitService`-dəki "deaktiv et" davranışından fərqli olaraq) — silinən sual, bir daha, geri qaytarıla bilmir. İstəsən, sualı, silmək əvəzinə, sadəcə, `is_active: false` edərək, "gizlətmək", daha ehtiyatlı bir yoldur.
