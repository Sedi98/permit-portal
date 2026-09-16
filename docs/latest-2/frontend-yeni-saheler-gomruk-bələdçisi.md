# PS-001 / PS-002 — Yeni Sahələr VƏ, Gömrük İnteqrasiyası — Frontend Bələdçisi

Bu sənəd, **PS-001** ("İxrac nəzarəti") VƏ, **PS-002** ("Mülki dövriyyə") icazələrinə, aid, olan, bütün, YENİ, dəyişiklikləri, bir, yerə, yığır (hər, iki, icazə, `trade_detail` cədvəlini, ORTAQ, işlətdiyi, üçün, aşağıdakı, HAMISI, HƏR, İKİSİNƏ, aiddir — hər, sahənin, öz, yanında, əks, halda, aydın, işarələnib). Bu, əvvəlki, `frontend-ps001-002-003-emeliyyat-bələdçisi.md`, VƏ, `frontend-icaze-muddeti-bələdçisi.md` sənədlərinin, **bəzi, hissələrini, YENİLƏYİR** (aşağıda, aydın, işarələnib).

---

## 1. "Malın adı və həcmi" — ARTIQ, TƏK, SAHƏ DEYİL, 3, AYRI, SAHƏYƏ, BÖLÜNÜB ⚠️ YENİLƏNİB (PS-001 VƏ, PS-002)

### Köhnə (artıq, keçərli, DEYİL)
```json
{ "goods_name_volume": "500 kq natrium hidroksid" }
```

### YENİ, düzgün, format

```json
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

| Sahə | Azərbaycanca ad | Növü |
|---|---|---|
| `goods_name` | Malın adı | Mətn |
| `goods_quantity` | Miqdar | Mətn (rəqəm, ya, "500" kimi) |
| `goods_unit` | Vahid | Mətn (kq, ton, ədəd, litr, s.) |

Vətəndaşın, öz, formasında, "Malın adı və həcmi", **ARTIQ, TƏK, mətn, qutusu, DEYİL** — bu, **3, ayrı, sahə** kimi, göstərilməlidir.

### Operator, redaktə edərkən

```
PUT /admin/permit-applications/{id}/trade-detail
{
  "goods_name": "Düzəldilmiş ad",
  "goods_quantity": "600",
  "goods_unit": "kq"
}
```
Operator, indi, **hər, üç, sahəni, ayrı-ayrı**, redaktə, edə, bilir.

---

## 2. "İcazənin müddəti" — ARTIQ, SƏRBƏST, MƏTN, DEYİL, TARİXDİR, VƏ, MƏCBURİDİR ⚠️ YENİLƏNİB (PS-001 VƏ, PS-002)

Əvvəlki, sənəddə, bu, sərbəst, mətn (`"5 il"` kimi), VƏ, könüllü, idi — bu, **artıq, DƏYİŞİB.**

```
PUT /admin/permit-applications/{id}/trade-detail
{ "permit_duration": "2031-09-15" }
```

**Format — `YYYY-MM-DD`** (adi, tarix formatı). Frontend-də, bunun, üçün, **date-picker**, işlət (adi, mətn, qutusu, YOX).

⚠️ **Bu, sahə, "imzaya, göndər" addımından, əvvəl, MƏCBURİDİR** — bax, aşağı, 4-cü, bölmə.

### Geri, oxunarkən

```json
{ "permit_duration": "2031-09-15" }
```

---

## 3. "Müqavilənin nömrəsi" (`contract_number`) — YENİ, MƏCBURİ, SAHƏ (PS-001 VƏ, PS-002)

Bu, sadə, sərbəst, mətndir, operator, tərəfindən, doldurulur (vətəndaşın, öz, formasında, YOXDUR).

```
PUT /admin/permit-applications/{id}/trade-detail
{ "contract_number": "MQ-2026-1145" }
```

⚠️ **Bu, sahə, "imzaya, göndər" addımından, əvvəl, MƏCBURİDİR** — bax, aşağı, 4-cü, bölmə.

---

## 4. Operator — Redaktə formasının, YENİ, TAM, siyahısı (PS-001 VƏ, PS-002, HƏR, İKİSİ, üçün, EYNİ)

`PUT /admin/permit-applications/{id}/trade-detail`, indi, hər, iki, icazədə, bu, sahələri, qəbul, edir:

| Sahə | Nə | Məcburidirmi? |
|---|---|---|
| `goods_name` | Malın adı | Könüllü |
| `goods_quantity` | Miqdar | Könüllü |
| `goods_unit` | Vahid | Könüllü |
| `permit_duration` | İcazənin, müddəti (tarix) | ⚠️ **MƏCBURİ** |
| `contract_number` | Müqavilənin, nömrəsi | ⚠️ **MƏCBURİ** |

**Diqqət — `permit_duration` VƏ, `contract_number`, "imzaya göndər" (`confirm-payment-received`) düyməsi basılmazdan, ƏVVƏL, mütləq, doldurulmuş, olmalıdır** — bu, Gömrük inteqrasiyası, üçün, zəruridir (bax, aşağı, 5-ci bölmə). Bunlar, boş, ikən, "imzaya göndər" sorğusu, göndərilsə:

```json
{
  "status": "error",
  "message": "Gömrük inteqrasiyası üçün, aşağıdakı sahələr, doldurulmalıdır: İcazənin müddəti, Müqavilənin nömrəsi"
}
```
HTTP: **422**

Frontend, "İmzaya, göndər" düyməsini, basmazdan, əvvəl, **öz, tərəfində, də**, bu, iki, sahənin, doldurulduğunu, yoxlayıb, düyməni, deaktiv, saxlamalıdır (backend-in, öz, yoxlamasına, çatmadan).

---

## 5. Gömrük inteqrasiyası — bu, TAMAMİLƏ, ARXA-FON (backend) əməliyyatıdır, frontend, HEÇ, BİR, YENİ, iş, GÖRMÜR

Nazir, müavini, PS-001, **VƏ, ya, PS-002**-dən, bir, icazəni, **imzalayan (`sign`) andaca**, backend, öz-özünə, arxa, fonda, Gömrük Komitəsinin, öz, sisteminə, məlumat, göndərir. Bu, **tam, avtomatikdir** — frontend, bunun, üçün, HEÇ, bir, əlavə, sorğu, çağırmır, HEÇ, bir, düymə, əlavə, etmir.

**Diqqət — bu, uğursuz, olsa, belə, vətəndaşa, HEÇ, bir, xəta, göstərilmir** — icazə, öz, adi, qaydasında, imzalanır, davam, edir (Gömrük, əlçatmaz, olsa, belə).

---

## Xülasə — bu, sənədin, öz, əsas, mesajı

Frontend-in, öz, işi, YALNIZ, **1, 2, 3, VƏ, 4-cü**, bölmələrdir (yeni, sahələr, formalarda, düzgün, göstərilsin). **5-ci, bölmə** (Gömrük), sırf, bilgi, üçündür — frontend, ora, heç, toxunmur.
