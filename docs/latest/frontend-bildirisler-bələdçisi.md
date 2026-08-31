# Bildirişlər (Notifications) — Frontend Bələdçisi

Bu, **ortaq** bir bölmədir — həm vətəndaş, həm admin panelindəki istifadəçilər, eyni iki endpoint-i işlədir (rol fərqi yoxdur, hər kəs, öz bildirişlərini görür).

---

## 1. Bildirişlər siyahısı

```
GET /api/notifications
Authorization: Bearer <token>
```

### Query Parametrləri

| Parametr | Növ | Təsvir |
|---|---|---|
| `per_page` | `integer` | Defolt: 20 |

### Cavab

```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 12,
        "user_id": 6,
        "title": "Təsdiqiniz tələb olunur",
        "body": "D/O-İ-3/2026 nömrəli müraciət üçün, Xidməti məruzə üzrə, Viza tələb olunur.",
        "data": { "permit_application_id": 5 },
        "is_read": false,
        "read_at": null,
        "created_at": "2026-08-28T10:00:00Z"
      }
    ],
    "total": 8,
    "current_page": 1
  }
}
```

> **Qeyd:** ayrıca, "detal" endpoint-i yoxdur — yuxarıdakı, siyahı cavabının, özü, hər bildirişin, tam məlumatını daşıyır.

### `data.permit_application_id` — necə işlədilir

Bildirişə klikləyəndə, bu ID ilə, birbaşa, uyğun müraciətin, öz detal səhifəsinə yönləndir:
```
GET /permit-applications/{data.permit_application_id}          (vətəndaş)
GET /admin/permit-applications/{data.permit_application_id}    (admin)
```

---

## 2. Hamısını, oxunmuş et

```
POST /api/notifications/mark-all-read
Authorization: Bearer <token>
```

```json
{ "status": "success", "message": "Bütün bildirişlər, oxunmuş kimi işarələndi." }
```

Bu, giriş etmiş istifadəçinin, **bütün** oxunmamış bildirişlərini, birdən, `is_read: true` edir — tək bir bildirişi, ayrıca, oxunmuş etmək üçün, endpoint yoxdur.

---

## 3. Oxunmamış sayı

```
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

```json
{ "status": "success", "data": { "count": 3 } }
```

Bildiriş zəngi üzərindəki, kiçik rəqəm (badge) üçün, bunu işlət — bütün siyahını çəkib, özün saymağa, ehtiyac yoxdur.

---

## 4. Bildirişlər, nə vaxt yaranır (bilməyin faydalıdır)

| Bildiriş | Kimə |
|---|---|
| Müraciət, sizə, yönləndirildi | Admin işçisinə |
| Müraciətiniz, icraya yönləndirildi | Vətəndaşa |
| Təsdiqiniz (viza/imza/təsdiq) tələb olunur | Admin işçisinə |
| Müraciətinizdə, düzəliş tələb olunur | Vətəndaşa |
| Müraciətinizin araşdırılması tamamlandı | Vətəndaşa |
| Ödənişiniz təsdiqləndi | Vətəndaşa |
| İcazəniz hazırdır (imzalandı) | Vətəndaşa |

