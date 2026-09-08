# myGov konsepsiyası üçün kod bazasının təhlili

Tarix: 8 sentyabr 2026. Əhatə: lokal mənbə kodu və repozitoriya sənədləri. Canlı backend, rəsmi inteqrasiya müqavilələri və dövlət reyestrləri yoxlanılmayıb. Aşağıdakı imkanlar frontend kodunda müşahidə edilib; bu, onların istehsalatda tam və təhlükəsiz işlədiyinə dair sertifikat deyil.

## 1. Faktiki layihə və məqsəd

Layihə artıq yalnız inzibati panel deyil. `package.json` və tətbiqlərin paket faylləri pnpm monorepozitoriyasını göstərir: `apps/web` vətəndaş portalıdır (Next.js 16.2.12, React 19), `apps/operator` isə əməkdaş portalıdır (React 19, Vite 8, TypeScript 6). Hər iki interfeys mövcud xarici permit backend ilə işləyir. Backend mənbə kodu bu təhlilin əhatəsində deyil.

`apps/web/app-pages/home/sections/Hero.tsx` portalı Energetika Nazirliyinin elektron icazə platforması kimi təqdim edir. Bu, kodda olan məhsul təsviridir; dövlət qurumunun rəsmi təsdiqini müstəqil sübut etmir. Konseptual sənədin əsas domeni enerji sahəsində icazələr və müraciətlərin inzibati emalı olmalıdır. Təhsil, əmlak və sosial məlumatların ümumi toplanması layihənin hazırkı əsas məqsədi deyil.

## 2. Təsdiqlənən funksional baza

| Sahə | Müşahidə olunan davranış | Sübut |
|---|---|---|
| Xidmət kataloqu | Aktiv icazələr və xidmət detalları; tələb olunan sənədlər | `apps/web/app-pages/home/sections/Permissions.tsx`, `apps/web/app-pages/permission/detail/index.tsx` |
| myGov ID girişi | Backend-dən yönləndirmə ünvanı alınır; callback tokeni qəbul edilir | `apps/web/features/auth/api.ts`, `apps/web/app-pages/login/index.tsx` |
| Şəxsi profil | FİN, ad, soyad, ata adı, ünvan, doğum tarixi, sənəd seriyası, vətəndaşlıq və VÖEN siyahısı üçün cavab tipi | `apps/web/features/auth/types.ts`; sahələrin tipdə olması dövlət mənbəyindən faktiki alınmasını sübut etmir |
| Müraciət | Fiziki şəxs üçün yaradılma, əlaqə məlumatları, xidmətə uyğun addımlar | `apps/web/features/apply/api.ts`, `apps/web/app-pages/apply/index.tsx` |
| Xüsusi əməliyyat | İdxal, ixrac, təkrar idxal, təkrar ixrac, tranzit və mal məlumatları | `apps/web/app-pages/apply/steps/operations-step.tsx`, `apps/web/features/apply/api.ts` |
| Sənədlər | Fayl yükləmə, rədd edilmiş sənədin əvəzlənməsi, sənəd tipinə görə bərpa | `apps/web/features/apply/api.ts`, `apps/web/app-pages/apply/index.tsx` |
| Qaralama və düzəliş | Saxlanılmış müraciətin davam etdirilməsi; `awaiting_revision` üçün ayrıca təkrar təqdimetmə | `apps/web/app-pages/apply/index.tsx` |
| Status | Qeydiyyat, təyinat, düzəliş, ödəniş, imza və yekun icazə statusları | `apps/web/features/applications/types.ts` |
| Bildiriş | Bildiriş siyahısı, oxunmamış say, hamısını oxunmuş işarələmə | `apps/web/features/notifications/api.ts` |
| Nəticə | Yaradılmış sənədin yüklənməsi və xidmətin qiymətləndirilməsi | `apps/web/features/applications/api.ts`, `apps/web/features/apply/api.ts` |
| İnzibati iş axını | İstiqamətləndirmə, təsdiq ardıcıllığı, fayl yoxlaması, ödənişin təsdiqi, imza əməliyyatı | `apps/operator/src/features/applications/api.ts` |
| Rollar | `super_admin`, `executor`, `deputy_minister`, `department_head` tipləri | `apps/operator/src/features/auth/types.ts`; serverdə səlahiyyət yoxlaması ayrıca audit tələb edir |

İstifadəçi axınının kodla dəstəklənən konturu: kataloq → myGov ID-yə yönləndirmə → müraciətin yaradılması → şəxsi məlumatlar → əlaqə → xidmət tələb edirsə əməliyyat məlumatları → sənədlər → təqdimetmə → əməkdaş baxışı → çatışmazlıq varsa düzəliş və təkrar təqdimetmə → ödəniş mərhələsi → rəsmiləşdirmə → nəticə sənədi. Bu ardıcıllıq tam rəsmi biznes qaydası deyil; xidmət növü və backend keçid qaydaları ilə dəqiqləşdirilməlidir.

## 3. Mövcud endpoint-lərin düzgün təqdimatı

Bunlar layihənin backend endpoint-ləridir, rəsmi myGov API-ləri deyil. Ümumi `/api` prefiksi HTTP konfiqurasiyasında əlavə edilə bilər.

| Endpoint | Kodda məqsəd |
|---|---|
| `GET /auth/mygov/redirect-url` | `redirect_base` ilə giriş ünvanı tələb etmək |
| `GET /me` | Cari istifadəçinin profili |
| `POST /permit-applications` | `permit_service_id`, `applicant_type: physical` ilə müraciət yaratmaq |
| `GET /permit-applications/{id}` | Detalları və davametmə vəziyyətini almaq |
| `PUT /permit-applications/{id}` | Əlaqə və əməliyyat məlumatlarını yeniləmək |
| `POST /permit-applications/{id}/files` | Fayl və sənəd tipini göndərmək |
| `POST /permit-applications/{id}/files/{fileId}` | `_method=PUT` ilə faylı dəyişmək |
| `POST /permit-applications/{id}/submit` | İlkin təqdimetmə |
| `POST /permit-applications/{id}/resubmit` | Düzəlişdən sonra təkrar təqdimetmə |
| `POST /permit-applications/{id}/pay` | Boş payload ilə ödəniş yoxlanışı mərhələsinə keçid; bank ödənişinin sübutu deyil |
| `GET /permit-applications/{id}/documents/{documentId}/download` | Nəticə faylını yükləmək |
| `POST /admin/permit-applications/{id}/sign` | İmza üzrə layihə əməliyyatı; kvalifikasiyalı elektron imza inteqrasiyasının sübutu deyil |

## 4. İnteqrasiya üçün aşkar edilən boşluqlar

1. myGov ID girişi ilə myGov daxilində xidmətin yerləşdirilməsi, sənəd mübadiləsi, razılıq və bildiriş inteqrasiyası fərqli iş paketləridir. Giriş adapterinin olması sonuncuların mövcud olduğunu göstərmir.
2. Hüquqi şəxs təmsilçiliyi hazırkı yaratma metodunda icra edilmir: `applicant_type` sabit `physical` göndərilir. VÖEN profil sahəsi təmsilçilik səlahiyyətini sübut etmir.
3. Consent reyestri, dövlət reyestri adapterləri, imzalanmış hadisə bildirişləri, mTLS, dəyişdirilməz audit, AI və proaktiv qayda mühərriki bu təhlildə təsdiqlənməyib. Onlar təklif olunan inkişaf kimi təqdim edilməlidir.
4. Ödəniş UI-si və status əməliyyatı var; ödəniş provayderinin təsdiqlənmiş callback-i, məbləğ uyğunlaşdırması və hesablaşma mexanizmi göstərilməyib.
5. Backend məlumat bazası, növbə, keş, infrastruktur və real server səlahiyyət siyasətlərinin texnologiyası frontend-dən müəyyən edilə bilməz.

## 5. P0 təhlükəsizlik işləri üçün konkret müşahidələr

`apps/web/app-pages/login/index.tsx` tokeni URL-in `token` parametrindən alır, sonra URL-i təmizləyir. URL-in sonradan təmizlənməsi tokenin ilkin sorğu və loglarda görünməsi riskini tam aradan qaldırmır. `apps/web/features/auth/cookies.ts` tokeni JavaScript-lə oxunan cookie-də saxlayır; `apps/operator/src/lib/cookies.ts` də JavaScript cookie kitabxanasından istifadə edir. Təklif: serverdə birdəfəlik kod mübadiləsi, BFF sessiyası və `HttpOnly; Secure; SameSite` cookie, sessiya rotasiyası, CSRF qorunması, redirect allowlist. Rəsmi myGov ID müqaviləsi və dəstəklənən OAuth/OIDC profili ilə uyğunlaşdırılmalıdır.

`apps/web/app-pages/apply/index.tsx` yaradılma və detal cavablarını `console.log` ilə bütöv çap edir. Cavab tiplərində FİN, ad və əlaqə məlumatları olduğu üçün istehsalat log siyasətində PII maskalanması P0 tələbdir. `apps/web/features/auth/debug.ts` xəta cavabının məlumatını qaytara bilir; həmin məlumatların da təhlükəsiz filtrdən keçməsi tələb olunur.

Bu müşahidələr əsasında kod dəyişdirilməyib; sənəd hazırlama tapşırığının nəticəsi kimi qeydə alınıb.

## 6. Metodoloji qeyd

Kod kəşfi əvvəlcə `get_architecture`, `search_graph`, `get_code_snippet`, `search_code` vasitəsilə aparıldı. Mövcud qrafda bəzi köhnə imzalar və sətir koordinatları aşkar edildiyinə görə nəticələr konkret cari fayllərin oxunması ilə yoxlanıldı. Bu hesabat köhnə qrafın API adlarına deyil, yoxlanılmış cari fayllərə əsaslanır. Dəqiq rəsmi xidmət siyahısı və hüquqi səlahiyyətlər qurumla təsdiqlənməlidir.
