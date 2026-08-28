# Admin Panel — İcazələr (Xidmətlər) İdarəetməsi — Frontend Bələdçisi

Bu sənəd, iki hissədən ibarətdir: **(1)** super_admin-in, "İcazələr" bölməsində, 15 icazəni necə idarə etdiyi, **(2)** vətəndaş/açıq tərəfin, bu icazə məlumatlarını necə göstərəcəyi.

---

## HİSSƏ 1 — Admin panel (super_admin)

### 1.1. Ümumi qeydlər

- Bu bölmə, **yalnız `super_admin`** roluna açıqdır.
- **"Sil" düyməsi, həqiqi silmə DEYİL** — `is_active`-i `false` edir (keçmiş müraciətlər, silinən icazəyə istinad etməyə davam etsin deyə). Düymənin adı, "Sil" yox, **"Deaktiv et"** olmalıdır.

### 1.2. "İcazələr" səhifəsini açanda — siyahı

```
GET /api/admin/permit-services
Authorization: Bearer {super_admin token}
```

**Cavab (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "code": "PS-001",
      "name": "\"İxrac nəzarəti haqqında\"...",
      "short_name": "İxrac nəzarətinə düşən malların ixracı...",
      "slug": "ixrac-...",
      "category": "permit",
      "category_label": "İcazə",
      "is_active": true,
      "icon_url": "https://permit-back.secop.az/storage/permit-service-icons/....png",
      "legal_basis": "...",
      "required_documents": "...",
      "suspension_basis": "...",
      "review_duration_days": 7,
      "state_fee": "100.00",
      "document_count": 5
    }
  ]
}
```

Bu, **hər 15 icazəni, aktiv/deaktiv fərq qoymadan, hamısını** qaytarır (public siyahıdan fərqli olaraq).

### 1.3. "Yeni icazə" düyməsi — yaratma forması

Basılanda, forma açılır. Sahələr:

| Sahə | Məcburi? | Növ |
|---|---|---|
| Ad (`name`) | ✅ Bəli | Mətn (uzun ola bilər) |
| Qısa ad (`short_name`) | ✅ Bəli | Mətn |
| Kateqoriya (`category`) | ✅ Bəli | Dropdown: **İcazə** (`permit`) / **Şəhadətnamə** (`certificate`) |
| Aktiv (`is_active`) | Xeyr | Checkbox (defolt: aktiv) |
| İkon (`icon`) | Xeyr | Şəkil faylı (jpg/png/svg, maks 2MB) |
| Hüquqi əsas (`legal_basis`) | Xeyr | Böyük mətn sahəsi |
| Tələb olunan sənədlər (`required_documents`) | Xeyr | Böyük mətn sahəsi |
| Dayandırılma və imtinanın hüquqi əsasları (`suspension_basis`) | Xeyr | Böyük mətn sahəsi |
| Baxılma müddəti (gün) (`review_duration_days`) | Xeyr | Rəqəm |
| Dövlət rüsumu (AZN) (`state_fee`) | Xeyr | Rəqəm (onluq) |
| Sənəd sayı (`document_count`) | Xeyr | Rəqəm |

> ⚠️ **`code` sahəsi, formada YOXDUR** — bu, backend tərəfindən, **avtomatik** yaranır (`PS-016`, `PS-017`, ardıcıl) və dəyişdirilə bilmir (nə yaratmada, nə redaktədə göndərilir). Bu, qəsdən belədir — `PS-001` kimi kodların, səhvən dəyişdirilməsinin qarşısını alır (bax, `PS-001`, backend-də, xüsusi bir nömrələmə qaydasına bağlıdır). Yaradıldıqdan sonra, `code`, cavabda görünür — frontend, bunu, formada deyil, sadəcə, siyahıda/detalda, **oxunan** bir sahə kimi göstərə bilər.

**Sorğu — `form-data` (ikon faylı ola biləcəyi üçün):**
```
POST /api/admin/permit-services
Authorization: Bearer {super_admin token}
```
```
name: Yeni icazənin tam adı
short_name: Qısa ad
category: permit
is_active: 1
icon: (fayl, könüllü)
legal_basis: (mətn, könüllü)
required_documents: (mətn, könüllü)
suspension_basis: (mətn, könüllü)
review_duration_days: 10
state_fee: 75.00
document_count: 4
```

**Cavab (201):**
```json
{
  "status": "success",
  "message": "İcazə uğurla yaradıldı.",
  "data": { "id": 16, "code": "PS-016", "...": "..." }
}
```
`code` (`PS-016`), avtomatik yaranıb, cavabda görünür.

### 1.4. Bir sətrin üstünə klikləyəndə — redaktə

```
GET /api/admin/permit-services/{id}
Authorization: Bearer {super_admin token}
```
Forma, 1.3-dəki eyni sahələrlə, mövcud dəyərlərlə doldurulur.

### 1.5. Redaktə formasında "Yadda saxla"

> ⚠️ **Fayl (ikon) daşıyan sorğularda, PHP, əsl `PUT`-u oxumur** — ona görə, əsl HTTP metodu **`POST`** olmalıdır, içinə `_method: PUT` sahəsi əlavə edilməklə.

**Sorğu — `form-data`:**
```
POST /api/admin/permit-services/{id}
Authorization: Bearer {super_admin token}
```
```
_method: PUT
name: ...
short_name: ...
category: ...
icon: (yeni fayl, könüllü — göndərilməsə, köhnə ikon qalır)
...
```

**Cavab (200):**
```json
{
  "status": "success",
  "message": "İcazə uğurla yeniləndi.",
  "data": { "id": 1, "...": "..." }
}
```

### 1.6. "Deaktiv et" düyməsi

```
DELETE /api/admin/permit-services/{id}
Authorization: Bearer {super_admin token}
```
**Cavab (200):**
```json
{ "status": "success", "message": "İcazə deaktiv edildi." }
```

### 1.7. İkonu göstərmək

Cavabdakı **`icon_url`** sahəsini, birbaşa, `<img src="...">`-də istifadə et. İkon yüklənməyibsə, bu sahə **`null`** gəlir — frontend, bu halda, defolt bir ikon göstərməlidir.

---

## HİSSƏ 2 — Vətəndaş/Açıq tərəf (icazələri göstərmək)

### 2.1. Bütün icazələrin siyahısı

```
GET /api/permit-services
```
**Auth tələb olunmur.**

Bu, "Yeni müraciət" seçimi ekranında, 15 icazənin siyahısını göstərmək üçündür.

### 2.2. Bir icazənin detalı

```
GET /api/permit-services/{id}
```

Bu cavab, şəkildəki kimi bir səhifə üçün, kifayət edir:

| Şəkildəki bölmə | Sahə |
|---|---|
| "Hüquqi əsas" | `legal_basis` |
| "Tələb olunan sənədlər" | `required_documents` |
| Sağ paneldəki "Baxılma müddəti" | `review_duration_days` + " iş günü" |
| Sağ paneldəki "Dövlət rüsumu" | `state_fee` + " AZN" |
| Sağ paneldəki "Sənəd sayı" | `document_count` + " sənəd" |
| Sağ paneldəki "Növ" | `category_label` |

**Diqqət:** `legal_basis`/`required_documents`/`suspension_basis`, sadə mətn sahələridir — sənin şəkilindəki, **maddə-madə (bullet-list) görünüş**, backend-dən gəlmir. Frontend, bu mətni, öz tərəfində, sətir sonlarına (`\n`) görə, siyahıya bölməlidir (ya da, icraçı/super_admin, mətni yazarkən, hər maddəni öz sətrində yazmalıdır — bu, ikinizin birgə razılaşacağı bir konvensiya olmalıdır).

---

## Açıq qalan suallar

1. **`GET /permit-services` (public), `is_active: false` olan icazələri gizlədirmi?** Bu, bu sessiyada təsdiqlənməyib (`PermitServiceController`-in özü görülməyib). Təsdiqlənənə qədər, ehtiyatlı ol — "Deaktiv et" edilmiş bir icazə, hələ də, vətəndaşın siyahısında görünə bilər.
2. **`legal_basis`/`required_documents`/`suspension_basis`-ın, "maddə-madə" formatının konvensiyası** (sətir sonu ilə ayrılma) — icraçı/super_admin ilə razılaşdırılmalıdır.
