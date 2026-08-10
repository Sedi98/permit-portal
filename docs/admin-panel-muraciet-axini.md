# ENXP Admin Panel — Müraciətin Tam Axını

Bu sənəd, bir müraciətin, admin panelə düşdüyü andan, tamamlanana qədər, **addım-addım, nə baş verdiyini** izah edir — hər addımda, kimin, nə etdiyini, sistemin, arxa planda, nəyi dəyişdirdiyini göstərir.

---

## Ümumi mənzərə — əsas prinsip

Admin paneldə, **hər kəs, eyni sol menyunu görür.** Fərq, menyu bəndlərinin özündə deyil, məzmunundadır — bir bənd, bir istifadəçidə boş, başqasında dolu ola bilər, çünki, iş, kimin, nəyə **təyin olunduğuna** görə bölünür, sabit, rol-əsaslı bir menyuya görə yox.

Bütün yönləndirmələr (bax, Mərhələ 2 və 3), **eyni, tək bir mexanizmdən** keçir — sabit, "bu rol, o rola yönləndirə bilər" kimi, sərt qaydalar yoxdur. Aşağıda təsvir olunan, **tipik** (normal, gözlənilən) istifadə nümunəsidir — sistem, texniki olaraq, daha çevikdir (bax, hər addımın öz qeydini).

---

## Mərhələ 1 — Müraciətin admin panelə düşməsi

Vətəndaş, öz tərəfində, müraciəti hazırlayıb (icazə seçib, fiziki/hüquqi şəxs seçimini edib, əlaqə məlumatlarını, sənədləri yükləyib), **"Göndər"** düyməsinə basır.

Bu andan:
- Müraciətin statusu, `draft`-dan, **`registered`**-ə keçir.
- Müraciətə, rəsmi bir **qeydiyyat nömrəsi** (`application_no`) verilir.
- Müraciət, **Nazir Müavininin**, admin paneldəki, **"Müraciətlər / Yeni daxil olanlar"** siyahısında görünür.

---

## Mərhələ 2 — Nazir Müavinindən, Şöbə Müdirinə yönləndirmə

Nazir müavini, "Yeni daxil olanlar" siyahısında, müraciətin üstünə klikləyib, **detal** ekranına daxil olur. Orada, müraciətin bütün məlumatları (müraciət edənin adı, seçdiyi icazə, əlaqə məlumatları) göründükdən sonra, aşağıda, bir **yönləndirmə forması** var:

- Bir **selectbox** — admin panelə giriş edə bilən, **bütün əməkdaşlar** (rolundan asılı olmadan — icraçı, şöbə müdiri, hətta, nazir müavini) burada görünür.
- Nazir müavini, bu siyahıdan, **tipik olaraq, uyğun bir şöbə müdirini** seçir.
- İstəsə, əlavə olaraq, bir və ya bir neçə nəfəri, **"müştərək icraçı"** kimi də seçə bilər (bu, çox vaxt, bu mərhələdə boş qalır, sonrakı mərhələdə, şöbə müdiri özü seçir).
- Qısa bir qeyd yazıb (könüllü), **"Yönləndir"** düyməsinə basır.

> **Qeyd — çeviklik haqqında:** bu selectbox, texniki olaraq, **hər kəsi** göstərdiyi üçün, nazir müavini, istəsə, birbaşa, bir icraçını da seçə bilər (şöbə müdirini keçərək) — bu, sistemin, öz təbiətinə görə, mümkündür. Amma, **normal, gözlənilən iş axını**, əvvəlcə, şöbə müdirinə yönləndirməkdir — çünki, işin, öz şöbə daxilində, kimə həvalə ediləcəyinə, ən yaxşı, elə, şöbə müdirinin özü qərar verə bilər.

Bu addımdan sonra:
- Statusu, `registered`-dən, **`assigned`**-ə keçir.
- Nazir müavininin öz tərəfində, müraciət, **"Müraciətlər / Yönləndirdiklərim"** siyahısına keçir.
- Seçilən şöbə müdirinin tərəfində, müraciət, onun öz, **"Müraciətlər / Yeni daxil olanlar"** siyahısında görünür.

---

## Mərhələ 3 — Şöbə Müdirindən, İcraçıya yönləndirmə (kaskad)

Şöbə müdiri, öz "Yeni daxil olanlar" siyahısında, bu müraciəti görür, detalına daxil olur. Burada, **eyni, tanış forma** görünür — eyni, "hər kəsi göstərən" selectbox.

- Şöbə müdiri, siyahıdan, bir **əsas icraçı** seçir.
- İstəsə, bir və ya bir neçə **müştərək icraçı** da əlavə edə bilər.
- **Vacib qayda:** müştərək icraçı, əsas icraçının edə bildiyi **hər şeyi** edə bilir — aralarında, səlahiyyət fərqi yoxdur. Bu, praktiki bir üstünlük yaradır: əgər, əsas icraçı, başqa bir işlə məşğuldursa, müştərək icraçı, işi, onun əvəzinə, tam davam etdirə bilər.

Bu addım, texniki olaraq, **eyni, "yönləndirmə" mexanizmini** işlədir — sadəcə, bu dəfə, **status dəyişmir** (artıq, `assigned`-dir), yalnız, **təyinat yenilənir** (köhnə təyinat silinir, yeni təyinat yazılır).

Bundan sonra:
- Şöbə müdirinin öz tərəfində, müraciət, onun **"Yönləndirdiklərim"** siyahısına keçir.
- Seçilən icraçı(lar)ın tərəfində, müraciət, onların, öz **"Yeni daxil olanlar"** siyahısında görünür.

> **Qeyd:** bu, "kaskad" adlanan mexanizmdir — istənilən əməkdaş, öz növbəsində, müraciəti, başqa birinə, yenidən yönləndirə bilər. Bu, təkcə, şöbə müdirindən icraçıya keçiddə yox, **istənilən mərhələdə**, işlədilə bilər (məsələn, bir icraçı, öz növbəsində, başqa bir icraçıya da yönləndirə bilər).

---

## Mərhələ 4 — Fayl icmalı

İcraçı (əsas ya müştərək), müraciətin detalına daxil olur. Aşağıda, vətəndaşın yüklədiyi bütün sənədlər görünür, hər birinin qarşısında, **"Qəbul et"** və **"Rədd et"** düymələri.

- İcraçı, hər sənədi, ayrı-ayrı, nəzərdən keçirir, qəbul ya rədd edir.
- **Rədd edərkən, səbəb yazmaq məcburidir.**
- **Bütün sənədlərə baxılmayana qədər**, ekranın altında, heç bir düymə görünmür — bu, məcburi bir addımdır, keçilə bilməz.

Bütün sənədlərə baxıldıqdan sonra, **NƏTİCƏYƏ GÖRƏ**, iki fərqli düymədən biri çıxır:

- **Hamısı "Qəbul" olubsa** → **"Xidməti Məruzə Hazırla"** düyməsi çıxır (bax, Mərhələ 5B).
- **Ən azı biri "Rədd" olubsa** → **"Çatışmazlıq Bildirişi Hazırla"** düyməsi çıxır (bax, Mərhələ 5A).

Bu, **avtomatik** bir qərardır — icraçı, sərbəst, "istədiyi sənədi hazırlaya bilmir", nəticə, fayl icmalının özündən asılıdır.

---

## Mərhələ 5A — Çatışmazlıq yolu

İcraçı, "Çatışmazlıq Bildirişi Hazırla" basır. Açılan ekranda:

- Müraciətin məlumatları.
- Çatışmazlığın izahını yazacağı, bir mətn sahəsi.
- Aşağıda, **"Təsdiqlənmə Ardıcılığı"** adlı, çoxseçimli bir qutu — icraçı, istədiyi qədər əməkdaş seçə bilər.
- Seçilən hər əməkdaş, altdakı cədvəldə görünür, qarşısında, iki checkbox: **"Vizalayan"** və **"İmzalayan"**. İcraçı, hər seçilən şəxsi, bu ikisindən birinə təyin edir (özünü də seçə bilər, heç kimi seçməyə də bilər).
- **"Təsdiqə Göndər"** basılır.

Bu andan, statusu, **`deficiency_confirmation`**-a keçir.

Seçilən hər şəxs, öz sol menyusunda, **"Çatışmazlıq Haqqında Bildiriş / Viza Üçün"** (vizalayanlar üçün) ya **"...İmza Üçün"** (imzalayanlar üçün) siyahısında, bu sənədi görür, öz növbəsində, təsdiqləyir.

**Hər ikisi (bütün vizalar + bütün imzalar) tamamlandıqdan sonra:**
- Bildiriş, vətəndaşın, öz **"Çatışmazlıq Haqqında Bildiriş"** səhifəsinə düşür.
- Vətəndaş, bildirişi oxuyur, aid olan sənədi (rədd edilən) dəyişir, **"Yenidən Göndər"** basır.
- **Vacib fərq:** bu, dəfə, düzəldilmiş müraciət, Nazir Müavininə YOX — **DİREKT, elə həmin icraçıya** düşür (Mərhələ 3-ə qayıtmır, birbaşa, Mərhələ 4-ə — fayl icmalına — qayıdır).

---

## Mərhələ 5B — Xidməti Məruzə yolu

İcraçı, "Xidməti Məruzə Hazırla" basır. Açılan ekranda:

- Müraciətin məlumatları.
- Xidməti məruzənin **başlığı** (input) və **mətni** (geniş yazı sahəsi).
- Aşağıda, yenə, **"Təsdiqlənmə Ardıcılığı"** — bu dəfə, **üç** rol: **Vizalayan**, **İmzalayan**, **Təsdiqləyən**. İcraçı, seçdiyi əməkdaşları, bu üç roldan birinə təyin edir (tipik olaraq: özünü vizalayan, şöbə müdirini imzalayan, nazir müavinini təsdiqləyən seçir).
- **"Təsdiqə Göndər"** basılır.

Bu andan, statusu, **`report_confirmation`**-a keçir.

Hər seçilən şəxs, öz sol menyusunda, **"Xidməti Məruzə / Viza Üçün"**, **"...İmza Üçün"** ya **"...Təsdiqləyən"** siyahısından, öz addımını yerinə yetirir.

**Kritik məqam:** Nazir Müavini (Təsdiqləyən), öz addımını tamamladığı andan, **müraciətin rəsmi qeydiyyat nömrəsi** yaranır.

Üçü də tamamlandıqdan sonra, müraciət, statusu, **geri, `assigned`-ə qayıdır** — bu, geriləmə demək deyil, **irəliləmədir**: icraçı, müraciətin detalına yenidən girəndə, artıq, "fayl icmalı" ekranı yox, **"Ödəniş cədvəli"** ekranını görəcək (bax, Mərhələ 6).

---

## Mərhələ 6 — Ödəniş

İcraçı, müraciətin detalına daxil olur, indi, bir **Ödəniş cədvəli** görür:

- **Xidmət** — avtomatik doldurulur.
- **Xidmət verən Orqan/Qurum** — avtomatik doldurulur.
- **Ödəniş** — icraçı, məbləği, əl ilə daxil edir.

Aşağıda, yenə, **"Təsdiqlənmə Ardıcılığı"** (bu dəfə, iki rol: Vizalayan, İmzalayan) — icraçı, seçir, göndərir.

Bu andan, statusu, **`payment_confirmation`**-a keçir.

Seçilən əməkdaşlar, öz **"Ödənişlər / Viza Üçün"** ya **"...İmza Üçün"** siyahılarından, öz addımlarını edirlər.

**Hər ikisi tamamlandıqdan sonra:**
- Statusu, **`awaiting_payment`**-ə keçir.
- Ödəniş tapşırığı, vətəndaşın, **"Ödəniş Tapşırığı / Daxil Olanlar"** səhifəsinə düşür.
- Vətəndaş, hesab-fakturaya, məbləğə baxır, **"Ödəniş et"** basır.

Bu andan, statusu, **`payment_review`**-ə keçir. Tapşırıq, icraçının, **"Ödənişlər / Təsdiq Olunanlar"** siyahısına düşür.

İcraçı, detala daxil olur:
- Ən üstdə — **Ödəniş statusu**.
- Aşağıda — müraciət məlumatları, sənədlər.
- Ən altda — vətəndaşın gördüyü hesab-faktura + **"Ödəniş Qəbzi"** düyməsi.

İcraçı, qəbzi yoxlayır, **"Müraciəti Təsdiqlə"** basır — statusu, **`awaiting_signature`**-ə keçir.

---

## Mərhələ 7 — Rəsmiləşdirmə (Son İmza)

Müraciət, **Nazir Müavininin**, **"İcazələrin Rəsmiləşdirilməsi / İmzalanmamışlar"** siyahısına düşür.

Nazir müavini, detala klikləyir — bu, **popup** formasında açılır: QR-kodlu, son sənədin görünüşü (qeydiyyat nömrəsi, tarix — hamısı görünür), **yalnız, QR kodun özü olmadan.**

Ən altda, **"İmzala"** düyməsi.

Bu andan:
- Statusu, **`completed`**-ə keçir — **geri dönüşü yoxdur.**
- Sistem, avtomatik, **QR-kodlu, rəsmi PDF sənədini** yaradır.
- Müraciət, **"İcazələrin Rəsmiləşdirilməsi / İcazələr"** siyahısına düşür, yanında, sənədi endirmək üçün, bir düymə görünür.

---

## Mərhələ 8 — Tamamlanma

Vətəndaş, öz **"Tamamlanmış Müraciətlər"** səhifəsində, bu müraciəti görür, QR-kodlu, rəsmi sənədi, öz kompüterinə endirə bilir.

---

## Status Xülasəsi — bütün mərhələlərin, bir baxışda

| # | Status | Nə zaman başlayır |
|---|---|---|
| 1 | `draft` | Vətəndaş, müraciəti yaradanda |
| 2 | `registered` | Vətəndaş, "Göndər" basanda |
| 3 | `assigned` | Nazir müavini (→şöbə müdiri) yönləndirəndə; şöbə müdiri (→icraçı) yönləndirəndə |
| 4 | `deficiency_confirmation` | İcraçı, "Çatışmazlıq Bildirişi" göndərəndə |
| 5 | `awaiting_revision` | Çatışmazlığın, viza+imzası tamamlananda |
| — | *(geri, `assigned`-ə)* | Vətəndaş, düzəliş göndərəndə — DİREKT icraçıya |
| 6 | `report_confirmation` | İcraçı, "Xidməti Məruzə" göndərəndə |
| — | *(geri, `assigned`-ə)* | Məruzənin, viza+imza+təsdiqi tamamlananda |
| 7 | `payment_confirmation` | İcraçı, ödəniş cədvəlini göndərəndə |
| 8 | `awaiting_payment` | Ödənişin, viza+imzası tamamlananda |
| 9 | `payment_review` | Vətəndaş, "Ödədim" basanda |
| 10 | `awaiting_signature` | İcraçı, ödəniş qəbzini təsdiqləyəndə |
| 11 | `completed` | Nazir müavini, son imzanı atanda |

---

*Növbəti sənəd: hər mərhələdə işlədilən, tam endpoint siyahısı (Swagger-üslubunda).*
