# PS-001 / PS-002 / PS-003 — Müraciət Formaları — Frontend Bələdçisi

15 icazədən, **3-ü**, öz, "Əməliyyat" (Addım 3) VƏ, "Sənədlər" (Addım 4) hissələrində, digərlərindən, **fərqli, xüsusi sahələrə** malikdir. Bu sənəd, hər, üçünün, öz, tam, tələbini, izah edir.

---

## PS-001 — "İxrac nəzarətinə düşən malların ixracı, idxalı, təkrar ixracı, təkrar idxalı və tranziti üçün icazə"

### "Əməliyyat növü" — dəqiq, göndərmə formatı (PS-001 VƏ, PS-002, hər ikisi üçün, ORTAQ)

Select-in, öz, ekranda göstərilən, Azərbaycanca adları, VƏ, backend-ə, göndəriləcək, xam dəyərləri, **FƏRQLİDİR** — select-in, öz, `value`-su, aşağıdakı, ingiliscə, sabit sözlərdən, biri, olmalıdır:

| Ekranda, göstərilən (Azərbaycanca) | Backend-ə, göndəriləcək, DƏQIQ, dəyər |
|---|---|
| İxrac | `"export"` |
| İdxal | `"import"` |
| Təkrar İxrac | `"re_export"` |
| Təkrar İdxal | `"re_import"` |
| Tranzit | `"transit"` |

**Diqqət — bu, dəyərlər, hərfi-hərfinə, dəqiq, bu, formada (kiçik hərflə, alt-xətt ilə) olmalıdır** — "Export", "EXPORT", "ixrac" kimi, fərqli, yazılışlar, backend, tərəfindən, **rədd olunacaq** (`422` xətası).

### Tam, işlək, nümunə — İdxal seçiləndə

```json
PUT /api/permit-applications/{id}
{
  "trade_detail": {
    "operation_type": "import",
    "goods_category": "Kimyəvi maddələr",
    "goods_name": "Natrium hidroksid",
    "goods_quantity": "500",
    "goods_unit": "kq"
  }
}
```

### Tam, işlək, nümunə — Tranzit seçiləndə

```json
PUT /api/permit-applications/{id}
{
  "trade_detail": {
    "operation_type": "transit",
    "goods_category": "Elektron avadanlıq",
    "goods_name": "Server",
    "goods_quantity": "20",
    "goods_unit": "ədəd"
  }
}
```

### Geri, OXUNARKƏN (`GET`) — Azərbaycanca ad, ARTIQ, HAZIR gəlir

```
GET /api/permit-applications/{id}
```
(Operator, öz, tərəfindən, eyni, məlumat, `GET /api/admin/permit-applications/{id}`-dən, gəlir.)

Sən, müraciətin, öz, detalına, geri, baxanda, `operation_type`-in, öz, xam (ingiliscə) dəyərini, özün, tərcümə etməli, DEYİLSƏN — backend, artıq, hazır, Azərbaycanca, adı, ayrıca, bir, sahədə, verir:

```json
{
  "tradeDetail": {
    "operation_type": "import",
    "operation_type_label": "İdxal",
    "goods_category": "Kimyəvi maddələr",
    "goods_name": "Natrium hidroksid",
    "goods_quantity": "500",
    "goods_unit": "kq"
  }
}
```

Ekranda, göstərmək üçün, **`operation_type_label`**-i, işlət (`operation_type`-in, özünü, YOX) — bu, birbaşa, hazır, oxunaqlı, Azərbaycanca mətndir.

---

### Addım 3 (Əməliyyat) — göstərilməli, 5 komponent ⚠️ YENİLƏNİB — "Malın adı və həcmi", 3, sahəyə, bölünüb

1. **"Əməliyyat növü"** (Select) — **5, seçim**: İxrac, İdxal, Təkrar İxrac, Təkrar İdxal, Tranzit.
2. **"Malların kateqoriyası"** (Select) — **hər, zaman, göstərilir** (əməliyyat növündən, asılı olmayaraq). Seçimlərin, öz, siyahısını (məsələn, "Kimyəvi maddələr", "Elektron avadanlıq", "Digər"), **frontend, özü, təyin edir** — backend-in, öz, tərəfində, bu, sahəyə, sabit, bir, siyahı (enum) qoyulmayıb, sadəcə, sərbəst, mətn kimi, qəbul edilir. Vətəndaş, select-dən, bir, seçim edəndə, frontend, o, seçimin, öz, MƏTNİNİ (məsələn, `"Kimyəvi maddələr"`), elə, adi, mətn kimi, göndərməlidir.
3. **"Malın adı"** (mətn) — **hər, zaman, göstərilir.**
4. **"Miqdar"** (mətn) — **hər, zaman, göstərilir.**
5. **"Vahid"** (mətn — kq, ton, ədəd, litr, s.) — **hər, zaman, göstərilir.**

**Diqqət — bu, 2-5-ci sahələr, "Əməliyyat növü"nün, HANSI, seçilməsindən, ASILI DEYİL** — beş, seçimin, HAMISINDA, eyni, dörd, sahə, görünür.

### Göndərmə

```json
PUT /api/permit-applications/{id}
{
  "trade_detail": {
    "operation_type": "export",
    "goods_category": "Kimyəvi maddələr",
    "goods_name": "Natrium hidroksid",
    "goods_quantity": "500",
    "goods_unit": "kq"
  }
}
```

### Operator paneli

Operator, müraciətin, öz, detalında (`GET /admin/permit-applications/{id}`), `tradeDetail.operation_type`, `tradeDetail.goods_name`, `tradeDetail.goods_quantity`, `tradeDetail.goods_unit`-u, görür. Əgər, vətəndaş, səhv məlumat, daxil edibsə — operator, bunları, sonda, düzəldə bilir (bax, **`frontend-ps001-yeni-saheler-gomruk-bələdçisi.md`**, tam, güncəl, redaktə, siyahısı, üçün — o, sənəd, bu, bölməni, ƏVƏZ, EDİR).

### Yekun PDF-də

"Əməliyyat növü" VƏ, "Malın adı, Miqdar, Vahid" (birləşdirilmiş), **iki, ayrı, ardıcıl sətirdə**, göstərilir:
```
İxrac
Natrium hidroksid — 500 kq
```

---

## PS-002 — "Mülki dövriyyəsi məhdudlaşdırılmış əşyaların dövriyyəsinə icazə"

### Addım 3 (Əməliyyat) — göstərilməli, 4 komponent ⚠️ YENİLƏNİB — "Malın adı və həcmi", 3, sahəyə, bölünüb

1. **"Əməliyyat növü"** (Select) — eyni, 5, seçim (yuxarıda, PS-001 bölməsindəki, "dəqiq, göndərmə formatı" cədvəlinə, bax — dəyərlər, EYNİDİR): İxrac, İdxal, Təkrar İxrac, Təkrar İdxal, Tranzit.
2. **"Malın adı"** (mətn).
3. **"Miqdar"** (mətn).
4. **"Vahid"** (mətn).

**Diqqət — "Malların kateqoriyası", BU, İCAZƏDƏ, YOXDUR** — PS-001-dən, fərqli, olaraq, göstərmə.

### Göndərmə

```json
PUT /api/permit-applications/{id}
{
  "trade_detail": {
    "operation_type": "import",
    "goods_name": "...",
    "goods_quantity": "...",
    "goods_unit": "..."
  }
}
```

### Operator paneli

Operator, `tradeDetail.operation_type`, `tradeDetail.goods_name`, `tradeDetail.goods_quantity`, `tradeDetail.goods_unit`-u, görür, sonda, düzəldə, bilir (bax, **`frontend-ps001-yeni-saheler-gomruk-bələdçisi.md`**).

### Yekun PDF-də

"Malın adı, Miqdar, Vahid" (birləşdirilmiş), müraciətin, öz, sahibi (hüquqi/fiziki şəxs) məlumatı ilə, imza bloku, arasında, bir, sətirdə, göstərilir.

### ⚠️ VACİB — Gömrük inteqrasiyası, VƏ, "İcazənin müddəti"/"Müqavilə nömrəsi", ARTIQ, PS-002-yə, DƏ, AİDDİR

Bu, sahələr, VƏ, Gömrük-ə, avtomatik, göndərilmə, artıq, YALNIZ, PS-001-ə, XAS, DEYİL — bax, **`frontend-ps001-yeni-saheler-gomruk-bələdçisi.md`**, tam, güncəl, məlumat, üçün.

---

## PS-003 — "Elektrik enerjisinin istehsalına icazə"

### Addım 3 (Əməliyyat) — YOXDUR

Bu, icazədə, "Əməliyyat" addımı, **ümumiyyətlə, göstərilmir** — bu, addımı, vətəndaşın, öz, axınından, tamamilə, çıxar.

### Addım 4 (Sənədlər) — əlavə, 1, komponent

Vətəndaş, öz, sənədlərini, yüklədiyi, hissənin, **dərhal, altında**, yeni, bir, sahə: **"Ümumi qoyuluş gücü"** (mətn, ya, textarea). Vətəndaş, buraya, icazənin, konkret, nəyə, veriləcəyini (məsələn, "12,5 MVt") yazır.

**Bu sahə, MƏCBURİDİR** — doldurulmadan, müraciət, göndərilə bilmir.

### Göndərmə

Bu, ayrıca, "müraciəti, yenilə" endpoint-i ilə, göndərilir (fayl yükləmə sorğusunun, öz, daxilində, DEYİL):

```json
PUT /api/permit-applications/{id}
{ "installed_capacity": "12,5 MVt" }
```

### Göndərmə (submit) yoxlaması

```
POST /api/permit-applications/{id}/submit
```
Doldurulmayıbsa:
```json
{ "status": "error", "errors": { "installed_capacity": "Ümumi qoyuluş gücü, daxil edilməlidir." } }
```

### Operator paneli

Operator, bunu, müraciətin, öz, detalında, **`installed_capacity`** sahəsində (top-level, `tradeDetail`-in, daxilində, DEYİL) görür — bunu, **"Tələb olunan sənədlər"** bölməsinin, öz, daxilində, göstər.

### Yekun PDF-də

"Ümumi qoyuluş gücü: 12,5 MVt" — fəaliyyət növünün (icazənin, öz, adının), dərhal, altında, göstərilir.

---

## Operator — Redaktə (ödəniş mərhələsində, düzəliş etmək)

⚠️ **Bu, bölmə, ARTIQ, KÖHNƏLİB** — PS-001 VƏ, PS-002-nin, öz, redaktə, siyahısı (yeni, `permit_duration`, `contract_number` sahələri, VƏ, "Malın adı"nın, 3-ə, bölünməsi, daxil olmaqla), tam, güncəl, halda, **`frontend-ps001-yeni-saheler-gomruk-bələdçisi.md`**-də, yazılıb — bu, sənədin, əvəzinə, ONU, işlət.

PS-003-ün, öz, redaktə, qaydası (dəyişməyib):

```
PUT /admin/permit-applications/{id}/trade-detail
{ "installed_capacity": "15 MVt" }
```

### Nə vaxt, mümkündür

Yalnız, müraciət, **`payment_review`** statusundadırsa (ya, ödənişsiz icazələrdə — PS-002, PS-013 — `assigned` statusundadırsa).

---

## Xülasə cədvəli

| | PS-001 | PS-002 | PS-003 |
|---|---|---|---|
| "Əməliyyat" addımı | Var (5 seçim + 4 sahə) | Var (5 seçim + 3 sahə) | Yoxdur |
| Kateqoriya | Var | Yoxdur | — |
| Malın adı / Miqdar / Vahid | Var (3, ayrı, sahə) | Var (3, ayrı, sahə) | — |
| Ümumi qoyuluş gücü | — | — | Var, Addım 4-də, məcburi |

⚠️ Operator-un, öz, redaktə, imkanları, VƏ, Gömrük inteqrasiyası, üçün — **`frontend-ps001-yeni-saheler-gomruk-bələdçisi.md`**-ə, bax (bu, sənəd, PS-001 VƏ, PS-002, hər, ikisinə, aiddir).
