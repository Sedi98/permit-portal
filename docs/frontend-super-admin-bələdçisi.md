# Admin Panel — Super Admin Rolu (Bələdçi)

Bu sənəd, `super_admin` rolu ilə daxil olan istifadəçinin admin paneldə nə görəcəyini izah edir. Digər dörd bələdçidən (nazir müavini, şöbə müdiri, icraçı, istifadəçi idarəetməsi) **fərqli olaraq**, bu sənəd hər endpoint-i yenidən sənədləşdirmir — **super_admin-in o rollardan necə fərqləndiyini** izah edir, detallı request/response nümunələri üçün müvafiq sənədə yönləndirir.

---

## 1. Əsas prinsip — super_admin, digər dörd rolun BİRLƏŞMƏSİDİR

Route-lara görə, super_admin, **hər bir** rol-qrupunun middleware-inə daxildir — o, texniki olaraq **istənilən** endpoint-i çağıra bilər. Amma sadəcə "hamısına çıxışı var" demək kifayət deyil — **daha vacib fərq**, aşağıdakıdır:

**Digər rolların hamısında olan "yalnız öz şöbəm/öz təyinatım" məhdudiyyəti, super_admin-ə tətbiq OLUNMUR.** O, həmişə **hər şeyi**, filtrsiz görür.

---

## 2. Menyu strukturu (bütün rolların birləşməsi)

```
Əsas səhifə
Lövhə                                → statistika, BÜTÜN nazirlik üzrə (filtrsiz)
İstifadəçilər                        → yalnız super_admin-ə xas (ayrıca sənəd, bax 3-cü bölmə)
Müraciətlər
  ├─ Yeni (yönləndirmə gözləyir)
  ├─ Yönləndirilmişlər (icraçı gözləyir)
  ├─ İcrada olanlar
  └─ İcra edilmişlər
Şöbələr / İcraçı təyinatı            → istənilən şöbəyə, istənilən müraciətə
Viza gözləyən sənədlər               → BÜTÜN şöbələr üzrə (filtrsiz)
İmza gözləyən sənədlər
Ödəniş təsdiqi gözləyənlər
```

---

## 3. Yalnız super_admin-ə xas — İstifadəçilər

Bu bölmə, **başqa heç bir rolda yoxdur.** Tam endpoint/forma/cavab detalları üçün bax: **`frontend-istifadeci-idareetmesi-bələdçisi.md`** — heç bir dəyişiklik yoxdur, o sənəd olduğu kimi keçərlidir.

---

## 4. Nazir müavini ilə paylaşılan — fərq YOXDUR

`forward`, `sign-queue`, `sign` — bu üçü, nazir müavinində də **onsuz da filtrsizdir** (nazir müavini bütün nazirliyi görür). Yəni super_admin, bu hissədə, **dəqiq nazir müavini kimi** davranır. Tam detallar: **`frontend-nazir-muavini-bələdçisi.md`**, 6-7-ci bölmələr.

---

## 5. Şöbə müdiri ilə paylaşılan — BURADA REAL FƏRQ VAR

### İcraçı dropdown-u

Şöbə müdirində (`GET /executors`) **avtomatik öz şöbəsinə** süzülür. **super_admin-də bu süzgəc YOXDUR** — sorğuya heç nə göndərməsə, **bütün şöbələrin** icraçıları qayıdır. İstəsə, `?department_id=` ilə konkret bir şöbəyə də süzə bilər (bu, yalnız super_admin üçün mövcud könüllü bir imkandır).

### İcraçı təyinatı (`assign`)

Şöbə müdirində, seçilən icraçıların **hamısı öz şöbəsinə aid olmalıdır** (əks halda `422`). **super_admin bu yoxlamaya tabe deyil** — istənilən şöbədən icraçı seçə bilər, hətta müraciətin yönləndirildiyi şöbədən fərqli olsa belə.

### Viza növbəsi (`visa-queue`, `approve`, `return`)

Şöbə müdirində, `visa-queue` **öz şöbəsinə** süzülür. **super_admin-də filtrsizdir** — bütün şöbələrin gözləyən vizaları bir siyahıda gəlir. `approve`/`return`-da da eyni: şöbə müdirinin "bu, öz şöbəmə aid deyil" (`404`) yoxlaması, super_admin-ə tətbiq olunmur — istənilən şöbənin vizasını o verə/geri qaytara bilər.

Tam detallar (forma, endpoint, request/response): **`frontend-sobe-muduri-bələdçisi.md`** — sadəcə hər yerdə "öz şöbəsi" ifadəsini "istənilən şöbə" kimi oxu.

---

## 6. İcraçı ilə paylaşılan — BURADA DA REAL FƏRQ VAR

### Sənəd hazırlama, fayl qəbul/rədd

İcraçıda, bu iki əməliyyat **yalnız əsas icraçıya** açıqdır (`isMainExecutor()` yoxlaması). Kodun özünə diqqət et:
```php
if ($user->hasRole(User::ROLE_EXECUTOR) && ! $this->isMainExecutor($permitApplication, $user->id)) {
    abort(404, ...);
}
```
Bu şərt, yalnız istifadəçinin **rolu** `executor` olduqda işə düşür. **super_admin-in rolu heç vaxt `executor` deyil** — ona görə bu yoxlama onun üçün **tamamilə keçilir.** Nəticə: super_admin, **istənilən müraciətdə**, hətta özü heç bir formada (əsas/müştərək/nəzarət) təyin olunmasa belə, sənəd hazırlaya, fayl qəbul/rədd edə bilər.

Tam detallar: **`frontend-icraci-bələdçisi.md`**, 4-5-ci bölmələr — "yalnız əsas icraçı" qeydlərini super_admin üçün "hamısı" kimi oxu.

### Status dəyişmə, ödəniş təsdiqi

Bunlar onsuz da bütün rollara paylaşılıb (bax 7-ci bölmə), əlavə fərq yoxdur.

---

## 7. Bütün rollara ortaq — statistika, siyahı, endirmə

`GET /permit-applications`, `GET /statistics`, sənəd/fayl endirmə — bunlar hər rolda mövcuddur, amma icraçı/şöbə müdirində öz təyinatına/şöbəsinə süzülür. **super_admin-də filtrsizdir** — statistika bütün nazirliyi, siyahı bütün müraciətləri göstərir.

---

## 8. Praktiki nəticə — dizayn qərarı frontend-ə qalır

Bu, backend-in məcbur etdiyi bir şey deyil, sadəcə qeyd edirəm: super_admin-in menyusu, digər 3 rolun (nazir müavini, şöbə müdiri, icraçı) menyularının **tam birləşməsi** ola bilər, YA DA daha sadə, ayrı bir görünüş dizayn edilə bilər — backend hər iki yanaşmanı da texniki cəhətdən dəstəkləyir.
