# İmza/Viza Tarixçəsi — Frontend Bələdçisi

## Endpoint

```
GET /api/service-reports/history
Authorization: Bearer <token>
```

Bu, giriş etmiş, **hər hansı bir admin işçisinin** (icraçı, şöbə müdiri, nazir müavini), özünün, indiyə qədər, viza/imza/təsdiq **etdiyi** (yəni, artıq, öz növbəsində, "təsdiqlə" basdığı), bütün sənədlərin, siyahısını qaytarır.

### Query Parametrləri

| Parametr | Növ | Təsvir |
|---|---|---|
| `per_page` | `integer` | Defolt: 20 |

## Cavab

```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 12,
        "permit_application_id": 5,
        "application_no": "D/O-İ-3/2026",
        "permit_service_name": "Elektrik enerjisinin ötürülməsinə icazə",
        "document_type": "report",
        "document_type_label": "Xidməti məruzə",
        "role": "sign",
        "role_label": "İmza",
        "approved_at": "2026-08-20T14:30:00Z",
        "current_status": "completed"
      }
    ],
    "total": 34,
    "current_page": 1
  }
}
```

## Cədvəldə, göstəriləcək sütunlar

| Sütun | JSON sahəsi |
|---|---|
| Sənəd nömrəsi | `application_no` |
| İcazə növü | `permit_service_name` |
| Sənəd tipi | `document_type_label` (Çatışmazlıq bildirişi / Xidməti məruzə / Ödəniş tapşırığı / İmtina) |
| Rol | `role_label` (Viza / İmza / Təsdiq) |
| Tarix | `approved_at` |
| Hazırkı status | `current_status` |

## Sənəd nömrəsinə klikləyəndə

```
GET /api/admin/permit-applications/{permit_application_id}
```

Bu, müraciətin, **tam detalını**, açır — operator, öz, keçmiş, artıq, başqasına keçmiş, bir müraciəti belə, **oxu-yalnız (read-only)** rejimdə, görə bilər. Frontend, bu ekranda, "Yönləndir", "Fayl icmalı" kimi, hərəkət düymələrini, **gizlətməlidir** — bunlar, artıq, operatorun, öz təyinatında olmayan, bir müraciətdə, backend tərəfindən, onsuz da, rədd ediləcək.
