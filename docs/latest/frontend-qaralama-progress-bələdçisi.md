# Qaralamalarda Progress Məlumatı — Frontend Bələdçisi

## Endpoint

```
GET /api/permit-applications?status=draft
Authorization: Bearer <token>
```

**Diqqət — `progress` sahəsi, YALNIZ, dəqiq, `?status=draft` filtri ilə çağırılanda gəlir.** Digər status filtrlərində (`registered`, `completed` və s.), bu sahə, cavabda, olmayacaq.

## Cavab

```json
{
  "status": "success",
  "data": [
    {
      "id": 10,
      "status": "draft",
      "applicant_type": "legal",
      "permit_service": { "id": 1, "name": "..." },
      "progress": {
        "percentage": 40,
        "completed_steps": 2,
        "total_steps": 5
      }
    }
  ]
}
```

## `progress` sahəsi

| Açar | Təsvir |
|---|---|
| `percentage` | 0–100 arası, tam ədəd — birbaşa, progress bar-a ver |
| `completed_steps` | Neçə addım, tamamlanıb |
| `total_steps` | Bu, konkret müraciətə aid, ümumi addım sayı |

## ⚠️ Vacib — `total_steps`, HƏR MÜRACİƏTDƏ, EYNİ DEYİL

`total_steps`, müraciətin öz növünə görə, **dəyişir**:

| Müraciət növü | Addım sayı |
|---|---|
| Fiziki şəxs, adi icazə | 3 |
| Fiziki şəxs, PS-001 (ixrac) | 4 |
| Hüquqi şəxs, adi icazə | 5 |
| Hüquqi şəxs, PS-001 (ixrac) | 6 |

Ona görə, `completed_steps`/`total_steps`-i, sabit bir rəqəmlə (məsələn, "həmişə, 5-dən") müqayisə etmə — hər müraciətin, öz, JSON-dakı, `total_steps` dəyərini işlət. `percentage`, artıq, bunu, hesablayıb, hazır verir — adətən, sadəcə, onu göstərmək, kifayətdir.
