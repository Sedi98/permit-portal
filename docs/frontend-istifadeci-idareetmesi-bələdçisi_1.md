# Admin Panel — İstifadəçi (Kadr) İdarəetməsi (Bələdçi)

Bu sənəd, `super_admin` rolu ilə daxil olan istifadəçinin, admin panelin **"İstifadəçilər"** bölməsində addım-addım nə görəcəyini, hansı düymələrin olacağını, onlara basılanda nə baş verdiyini və hər addımda hansı endpoint-in çağırılacağını izah edir.

**Ümumi qeyd:** bu bölmə yalnız `super_admin`-ə açıqdır — başqa rol (executor, department_head, deputy_minister) buraya sorğu göndərsə, `403 Forbidden` alır. Base URL: `https://permit-back.secop.az`

---

## 1. Menyu

```
İstifadəçilər → GET /api/admin/users
```

---

## 2. "İstifadəçilər" səhifəsini açanda — siyahı

Səhifə açılan kimi, bu endpoint çağırılır:

```
GET /api/admin/users
```

**Qayıdır:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 4,
        "name": "Test İcraçı",
        "fin": "2222222",
        "role": "executor",
        "department_id": 1,
        "department_name": "İqtisadiyyat şöbəsi",
        "is_active": true,
        "created_at": "2026-07-30T10:15:00.000000Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

Ekranda hər sətirdə göstərilir: **Ad, FİN, Rol, Şöbə, Aktiv/Deaktiv.** `data.data` — cədvəlin sətirləri; qalan sahələr (`current_page`, `total` və s.) səhifələmə düymələri üçündür ("1/3 səhifə" kimi göstərmək üçün istifadə et).

### Axtarış qutusu və filtrlər

Səhifədə axtarış qutusuna yazanda, ya rol dropdown-u seçiləndə, eyni endpoint-ə parametr əlavə edilir:

```
GET /api/admin/users?role=executor&search=Əli&per_page=10
```

| Parametr | Nə edir |
|---|---|
| `role` | Nəticəni rola görə süzür |
| `search` | Ad **və ya** FİN üzrə axtarır |
| `per_page` | Bir səhifədə neçə sətir göstərilsin |

---

## 3. "Yeni işçi" düyməsi — yaratma forması

Düymə basılanda, forma açılır: **Ad, FİN, Rol (dropdown), Şöbə (dropdown), Aktiv (checkbox).**

> **Diqqət — bu, adi bir forma deyil.** Burada email və şifrə sahəsi **yoxdur** — buradan yaradılan hər kəs (icraçı, şöbə müdiri, nazir müavini) mygov ID (Asan İmza/SİMA) ilə giriş edəcək, email/şifrə ilə yox.

### Rol dropdown-u

Dropdown-da üç seçim göstərilir, hər birinin backend-ə göndəriləcək **dəqiq dəyəri** fərqlidir:

| Dropdown-da göstərilən (Azərbaycanca) | `role` sahəsinə göndərilən dəyər |
|---|---|
| İcraçı | `executor` |
| Şöbə müdiri | `department_head` |
| Nazir müavini | `deputy_minister` |

`super_admin` bu siyahıda **yoxdur** — o, panel vasitəsilə yaradılmır, dropdown-a əlavə edilməməlidir.

### Şöbə dropdown-u

Rol seçiləndə **dinamik** göstər/gizlət: `executor` və ya `department_head` seçilibsə göstər (bu ikisi üçün məcburidir), `deputy_minister` seçilibsə gizlət (o, bütün şöbələr üzərində işləyir, konkret şöbəyə bağlı deyil).

Bu dropdown-u doldurmaq üçün, forma açılanda, ayrıca bu sorğu göndərilir:
```
GET /api/admin/departments
```
**Qayıdır:**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "İqtisadiyyat şöbəsi", "code": "ECON" },
    { "id": 2, "name": "Hüquq şöbəsi", "code": "LEGAL" }
  ]
}
```
Qayıdan `id`-ni `department_id` kimi göndər.

### "Yadda saxla" basılanda

```
POST /api/admin/users
```
**Göndərilir:**
```json
{
  "name": "Elçin Məmmədov",
  "fin": "1234567",
  "role": "executor",
  "department_id": 1,
  "is_active": true
}
```
**Uğurlu olsa (201) qayıdır:**
```json
{
  "status": "success",
  "message": "İstifadəçi uğurla yaradıldı.",
  "data": {
    "id": 7,
    "name": "Elçin Məmmədov",
    "fin": "1234567",
    "role": "executor",
    "department_id": 1,
    "department_name": "İqtisadiyyat şöbəsi",
    "is_active": true,
    "created_at": "2026-07-30T11:02:00.000000Z"
  }
}
```
**Xəta olsa (422) qayıdır, məsələn:**
```json
{
  "message": "Verilən məlumatlar düzgün deyil.",
  "errors": {
    "fin": ["Bu FİN artıq qeydiyyatdadır."],
    "department_id": ["Bu rol üçün şöbə seçilməlidir."]
  }
}
```
Xəta gələn sahələrin altında qırmızı mətnlə göstər.

### Sahələrin qaydaları

| Sahə | Məcburi? | Qeyd |
|---|---|---|
| `name` | Bəli | — |
| `fin` | Bəli | Dəqiq 7 simvol, unikal |
| `role` | Bəli | `executor` / `department_head` / `deputy_minister` |
| `department_id` | Şərti | `executor`/`department_head`-də məcburi, `deputy_minister`-də lazım deyil |
| `is_active` | Xeyr | Göndərilməsə, avtomatik aktiv olur |

---

## 4. Siyahıda bir sətrin üstünə klikləyəndə — redaktə səhifəsi

```
GET /api/admin/users/{id}
```
**Qayıdır** (3-cü bölmədəki "uğurlu yaratma" cavabı ilə eyni formada, mövcud dəyərlərlə):
```json
{
  "status": "success",
  "data": {
    "id": 4,
    "name": "Test İcraçı",
    "fin": "2222222",
    "role": "executor",
    "department_id": 1,
    "department_name": "İqtisadiyyat şöbəsi",
    "is_active": true,
    "created_at": "2026-07-30T10:15:00.000000Z"
  }
}
```

Forma, 3-cü bölmədəki yaratma forması ilə **eynidir**, sadəcə sahələr bu dəyərlərlə əvvəlcədən doldurulmuş gəlir.

**Bu ID mövcud deyilsə, ya da vətəndaş (`citizen`) hesabına aiddirsə** — `404` qayıdır, "İstifadəçi tapılmadı" göstər. (Vətəndaş hesabları bu bölmədə heç görünmür, açılmır.)

### "Yadda saxla" basılanda (redaktə)

```
PUT /api/admin/users/{id}
```
**Göndərilir** — yaratma ilə eyni sahələr (`name`, `fin`, `role`, `department_id`, `is_active`).

**Uğurlu olsa (200) qayıdır:**
```json
{
  "status": "success",
  "message": "İstifadəçi uğurla yeniləndi.",
  "data": { "id": 4, "name": "...", "fin": "...", "role": "...", "department_id": 1, "department_name": "...", "is_active": true }
}
```

### İki xüsusi hal — super_admin ÖZ hesabını redaktə edəndə

**Öz rolunu dəyişməyə cəhd etsə** (422):
```json
{ "status": "error", "message": "Öz rolunuzu dəyişə bilməzsiniz." }
```

**Öz hesabında "Aktiv"i söndürməyə cəhd etsə** (422):
```json
{ "status": "error", "message": "Öz hesabınızı deaktiv edə bilməzsiniz." }
```

Bunu qabaqlamaq istəsən, super_admin öz hesabını açanda, Rol/Aktiv sahələrini "yalnız oxunan" et — ya da sadəcə backend-in qaytardığı xəta mesajını göstər, hər ikisi məqbuldur.

---

## 5. "Deaktiv et" düyməsi

**Diqqət — bu, HƏQİQİ SİLMƏ DEYİL**, düymənin adı "Sil" yox, **"Deaktiv et"** olmalıdır. Backend işçini bazadan silmir, sadəcə `is_active`-i söndürür (keçmiş təyinatlar, imzalar tarixçədə qalsın deyə).

```
DELETE /api/admin/users/{id}
```
**Qayıdır:**
```json
{ "status": "success", "message": "İstifadəçi deaktiv edildi." }
```

Eyni özünü-qoruma qaydası: super_admin özünü deaktiv edə bilməz (422, eyni mesaj: "Öz hesabınızı deaktiv edə bilməzsiniz.").

---

## 6. Xəta halları — ümumi cədvəl

| HTTP kod | Nə vaxt |
|---|---|
| 403 | Giriş edən `super_admin` deyil |
| 404 | ID mövcud deyil, ya da vətəndaş hesabıdır |
| 422 | Validasiya xətası (FİN formatı/təkrarı, şöbə tələbi) və ya özünü-dəyişmə qorunması |
