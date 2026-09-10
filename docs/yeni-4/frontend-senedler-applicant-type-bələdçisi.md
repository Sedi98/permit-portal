# Sənəd Tələblərinin, Müraciətçi Tipinə Görə Ayrılması — Frontend Bələdçisi

## Nə üçündür

Bəzi icazələrdə, tələb olunan sənədlər, müraciətçinin, **fiziki, yoxsa, hüquqi şəxs** olmasına görə, fərqlənir (məsələn, "Dövlət reyestrindən çıxarış", yalnız, hüquqi şəxsə; "Şəxsiyyət vəsiqəsi", yalnız, fiziki şəxsə aiddir).

---

## HİSSƏ 1 — Admin panel, "İcazə yarat/redaktə et"

### Nə dəyişdi

Əvvəllər, sənəd seçimi, sadəcə, çoxseçimli, bir siyahı idi. İndi, **hər, seçilən sənədin, öz, yanında**, əlavə, kiçik bir seçim (dropdown) var: **"Hər ikisi" / "Yalnız hüquqi şəxs" / "Yalnız fiziki şəxs."**

### Göndərmə formatı

```json
POST /admin/permit-services
{
  "name": "...",
  "document_type_ids": [3, 7, 12],
  "document_type_applicant_types": {
    "3": null,
    "7": "legal",
    "12": "physical"
  }
}
```

| Açar | Formada | Backend-ə, göndəriləcək dəyər |
|---|---|---|
| "Hər ikisi" | Defolt, seçim | `null` (ya, sahəni, ümumiyyətlə, göndərmə) |
| "Yalnız hüquqi şəxs" | — | `"legal"` |
| "Yalnız fiziki şəxs" | — | `"physical"` |

**Diqqət — `document_type_applicant_types`-in, öz, açarları (key), `document_type_ids`-dəki, ID-lərlə, EYNİ olmalıdır** (yuxarıdakı nümunədə, `"3"`, `"7"`, `"12"`) — bu, hansı, sənədin, hansı, tipə, aid olduğunu, əlaqələndirir.

### Cavab (`GET /admin/permit-services/{id}`)

```json
{
  "documentTypes": [
    { "id": 3, "name": "Vergi orqanlarında uçota alınma şəhadətnaməsi", "pivot": { "applicant_type": null } },
    { "id": 7, "name": "Dövlət reyestrindən çıxarış", "pivot": { "applicant_type": "legal" } },
    { "id": 12, "name": "Şəxsiyyət vəsiqəsinin surəti", "pivot": { "applicant_type": "physical" } }
  ]
}
```

Redaktə formasını açanda, hər, sənədin, öz, dropdown-unu, elə, bu, **`pivot.applicant_type`** dəyərinə görə, əvvəlcədən, doldur.

---

## HİSSƏ 2 — Vətəndaş tərəfi — DƏYİŞİKLİK TƏLƏB OLUNMUR

### Bu, artıq, avtomatik, "arxa fonda" işləyir

```
GET /api/permit-applications/{id}
```
Bu, cavabdakı, `permitService.documentTypes`, indi, **artıq, o, konkret müraciətin, öz, `applicant_type`-inə görə, ƏVVƏLCƏDƏN SÜZÜLMÜŞ** gəlir. Yəni:

- **Fiziki şəxs müraciəti** → `documentTypes`-də, yalnız, "Hər ikisi" + "Yalnız fiziki" sənədlər, görünür.
- **Hüquqi şəxs müraciəti** → `documentTypes`-də, yalnız, "Hər ikisi" + "Yalnız hüquqi" sənədlər, görünür.

**Frontend, öz, tərəfində, HEÇ BİR, əlavə süzgəc, ya, filtrasiya məntiqi, yazmamalıdır** — massiv, artıq, doğru, hazır, gəlir. Sənəd yükləmə axını (`document_type_id` ilə), olduğu kimi, dəyişmədən, işləyir.
