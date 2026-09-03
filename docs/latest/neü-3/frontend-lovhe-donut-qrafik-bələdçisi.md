# Lövhə — Statistika Bölməsi (Dairəvi Diaqram + İllər Üzrə Qrafik) — Frontend Bələdçisi

## Endpoint

```
GET /api/admin/statistics/dashboard
Authorization: Bearer <admin_token>
```

### Rol-əsaslı əhatə (digər "Lövhə" kartları ilə, eyni qayda)

| Rol | Nəticə |
|---|---|
| İcraçı, Şöbə müdiri | Yalnız, öz təyinatları |
| Nazir müavini, Super Admin | Bütün nazirlik |

---

## 1. Dairəvi diaqram (Donut Chart) — `by_permit_service`

### Query Parametrləri

| Parametr | Növ | Təsvir |
|---|---|---|
| `startDate` | `date` (YYYY-MM-DD) | Könüllü — göndərilməsə, **defolt, son 1 ay** |
| `endDate` | `date` (YYYY-MM-DD) | Könüllü — göndərilməsə, **defolt, bu gün** |

Filtr, müraciətin, öz **`created_at`** (yaradılma tarixi) sahəsinə görə işləyir.

### Cavab

```json
"by_permit_service": [
  {
    "permit_service_id": 1,
    "permit_service_name": "İxrac nəzarətinə düşən malların ixracı...",
    "count": 7,
    "percentage": 43.6
  }
]
```

| Sahə | Təsvir |
|---|---|
| `permit_service_id` | Rəngin, hansı icazəyə uyğun olduğunu, təyin etmək üçün |
| `permit_service_name` | Hover zamanı, göstərilən ad |
| `count` | Hover zamanı, göstərilən, xam say |
| `percentage` | Hover zamanı, göstərilən, faiz — **1 onluq kəsrlə** |

**✅ Faizlərin, cəmi, HƏMİŞƏ, dəqiq, 100.0-dır** (backend, son, kiçik yuvarlaqlaşdırma fərqini, ən böyük paya, avtomatik əlavə edir).

**Ortadakı, "cəmi" rəqəm** — backend-dən, ayrıca gəlmir, `by_permit_service` massivinin, öz, `count` sahələrinin, cəmini, frontend, özü, toplasın.

---

## 2. Sütun qrafiki (illər üzrə) — `by_year`

### Query Parametrləri

| Parametr | Növ | Təsvir |
|---|---|---|
| `startYear` | `integer` | Könüllü — göndərilməsə, defolt, cari il |
| `endYear` | `integer` | Könüllü — göndərilməsə, defolt, cari il |

### Cavab

```json
"by_year": [
  { "year": 2026, "issued": 1, "applications": 16 }
]
```

| Sahə | Təsvir |
|---|---|
| `year` | İl |
| `issued` | Bu ildə, **imzalanaraq (completed), verilmiş** icazələrin sayı |
| `applications` | Bu ildə, **göndərilmiş** (draft-dan çıxıb) müraciətlərin sayı |

Hər il, üçün, **iki, yan-yana sütun** (`issued`, `applications`) çək.

---

## 3. Xülasə (4 kart) — `summary`

**Diqqət — bu, `by_year`-in, öz, EYNİ `startYear`/`endYear` aralığına, əsaslanır** (dairəvi diaqramın, öz, tarix filtrindən, ASILI DEYİL).

```json
"summary": {
  "total_issued": 1,
  "total_applications": 16,
  "execution_rate": 6,
  "top_year": 2026,
  "top_year_count": 1
}
```

| Sahə | Ekranda |
|---|---|
| `total_issued` | Ümumi icazələr |
| `total_applications` | Ümumi müraciət |
| `execution_rate` | İcra faizi (%) — **tam ədəd** (89, 89.2 yox) |
| `top_year` | Ən yüksək il (ən çox, icazə verilən il) |
| `top_year_count` | O ildəki, real, icazə sayı — ekranda, "2024 / 401 icazə" formatında, birlikdə göstər |

Bərabərlik olsa (iki il, eyni sayda, icazə versə), **ən sonuncu (yaxın) il**, seçilir.

---

## Tam nümunə çağırış

```
GET /admin/statistics/dashboard?startDate=2026-01-01&endDate=2026-08-30&startYear=2026&endYear=2026
```

---

## Açıq qalan — "Yüklə" (Excel) düyməsi

Bu, hələ, **backend-də, qurulmayıb** — sətirlərin, öz tərkibi, dəqiqləşəndən sonra, ayrıca, bir mesajla, bildiriləcək.
