# Lövhə (Dashboard) Statistikası — Frontend Bələdçisi

## Endpoint

```
GET /api/admin/statistics
Authorization: Bearer <admin_token>
```

## Cavab (tam nümunə)

```json
{
  "status": "success",
  "data": {
    "total": 24,
    "pending": 5,
    "in_progress": 12,
    "completed": 6,
    "rejected": 0,
    "suspended": 0,
    "unprocessed": 0,
    "pending_visa": 3,
    "pending_signature": 2
  }
}
```

## Sahə → Kart adı (birbaşa göstər)

| JSON sahəsi | Kartda göstəriləcək ad |
|---|---|
| `pending` | **Yeni daxil olan** |
| `in_progress` | **İcrada olan** |
| `pending_visa` | **Vizada olan** |
| `pending_signature` | **İmzada olan** |
| `completed` | Tamamlanmış |
| `rejected` | İmtina edilmiş |
| `suspended` | Dayandırılmış |
| `unprocessed` | Baxılmamış |
| `total` | Ümumi say |

## Vacib qeydlər

1. **Bütün rəqəmlər, artıq, "son 24 saat"a görə hesablanıb** — frontend, əlavə, heç bir tarix filtri, hesablama etməli deyil, gələn rəqəmi, birbaşa, göstərsin.
2. **Rola görə, avtomatik dəyişir** — icraçı/şöbə müdiri, giriş edəndə, yalnız, **öz təyinatlarına** aid rəqəmləri görür; nazir müavini/super_admin, **bütün nazirliyin** rəqəmlərini görür. Frontend, bunun üçün, heç bir əlavə parametr göndərməməlidir — backend, giriş edən istifadəçinin, öz rolunu, avtomatik tanıyır.
3. **`pending_visa` və `pending_signature`** — bunlar, təkcə, bir sənəd növünə (məsələn, yalnız Xidməti Məruzə) aid deyil, **Çatışmazlıq, Xidməti Məruzə, Ödəniş — üçünün də**, cəmi göstərir.
