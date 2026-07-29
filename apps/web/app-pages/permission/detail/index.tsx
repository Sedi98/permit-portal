import { PermissionIdentity } from "./sections/PermissionIdentity";
import { PermissionInfoSection } from "./sections/PermissionInfoSection";
import { PermissionSummary } from "./sections/PermissionSummary";
import type { PermissionDetailData } from "./sections/types";

export const permissionDetail: PermissionDetailData = {
  category: "Digər icazələr",
  title:
    "İxrac nəzarəti haqqında” Azərbaycan Respublikasının Qanununa əsasən ixrac nəzarətinə düşən malların (işlərin, xidmətlərin, əqli fəaliyyətin nəticələrinin) ixracı, təkrar ixracı, idxalı, təkrar idxalı və tranziti üçün icazə",
  icon: "/icons/permission-detail/globe.svg",
  type: "Digər icazələr",
  reviewTime: "7 iş günü",
  fee: "100 AZN",
  documentCount: "5 sənəd",
  requirements: ["MYGOV hesabı", "Tələb olunan sənədlər"],
  sections: [
    {
      title: "Hüquqi əsas",
      items: [
        { text: "Lisenziya və icazələr haqqında” Azərbaycan Respublikasının 2016-cı il 15 mart 176VQ nömrəli Qanunu;" },
        { text: "Azərbaycan Respublikası Nazirlər Kabinetinin 2005-ci il 15 dekabr tarixli 230 nömrəli Qərarı ilə təsdiq edilmiş ixrac nəzarətinə düşən mallar (işlər, xidmətlər, əqli fəaliyyətin nəticələri) üzrə xüsusi icazənin verilməsi Qaydaları" },
        { text: "Azərbaycan Respublikası Nazirlər Kabinetinin 2005-ci il 15 dekabr tarixli 230 nömrəli qərarı ilə təsdiq edilmiş “İxrac nəzarətinə düşən mallar (işlər, xidmətlər, əqli fəaliyyətin nəticələri) üzrə xarici iqtisadi əlaqələrin həyata keçirilməsinə xüsusi icazənin verilməsindən əvvəl və sonra yoxlamaların aparılması Qaydası”nın 2.1-ci bəndi." },
      ],
    },
    {
      title: "Tələb olunan sənədlər",
      items: [
        { text: "Malalan (malgöndərən) və son Ərizəçi haqqında məlumat" },
        { text: "Bağlanmış müqavilənin (kontraktın) surəti" },
        { text: "İxrac edilən malın mənşə sertifikatının surəti" },
        { text: "“Azərbaycan Respublikasında dövlət dili haqqında” Azərbaycan Respublikası Qanununun 1.4-cü maddəsinə əsasən Azərbaycan Respublikasında dövlət hakimiyyəti və yerli özünüidarəetmə orqanlarında, dövlət qurumlarında, siyasi partiyalarda, qeyri-hökumət təşkilatlarında (ictimai birlik və fondlarda), həmkarlar təşkilatlarında, digər hüquqi şəxslərdə, onların nümayəndəliklərində və filiallarında, idarələrdə dövlət dilinin tətbiqi ilə bağlı fəaliyyət bu Qanuna uyğun olaraq həyata keçirilir, o cümlədən kargüzarlıq işləri dövlət dilində aparılır" },
        { text: "Kateqoriyalarından asılı olaraq aşağıdakı sənədlər əlavə olunmalıdır:", emphasis: true },
        {
          text: "Nüvə materialları, texnologiyaları, qurğuları, radioaktiv ionlaşdırıcı şüa mənbələri və izotoplar, partlayıcı maddələr və vasitələr üzrə:",
          emphasis: true,
          children: {
            items: [
              "ixrac, idxal, təkrar ixrac, təkrar idxal üçün müvafiq olaraq malın istifadəsinə, saxlanılmasına və daşınmasına verilmiş xüsusi icazənin surəti, malalan (malgöndərən), istehsalçı, son istifadəsi və Ərizəçisi haqqında aidiyyəti Dövlət orqanı tərəfindən təsdiq edilmiş ətraflı məlumat, malın texniki göstəriciləri, təhlükəsizliyinin və fiziki mühafizəsinin təmin edilməsi, nəqliyyat vasitələrinin növləri və onların mənsub olduqları ölkə barədə məlumatlar",
              "tranzit üçün xarici ölkələrin diplomatik missiyalarının müraciətləri əsasında Azərbaycan Respublikası Xarici İşlər Nazirliyinin məktubu, malalan (malgöndərən), istehsalçı, malın son istifadəsi və Ərizəçisi haqqında ətraflı məlumat, malın texniki göstəriciləri və təhlükəsizliyinin təmin edilməsi, nəqliyyat vasitələrinin növləri və onların mənsub olduqları ölkə barədə məlumatlar",
            ],
          },
        },
        {
          text: "Toksiki kimyəvi maddələr, insan həyatı və heyvanlar aləmi üçün təhlükəli olan patogenlər, genetik cəhətdən dəyişdirilmiş mikroorqanizmlər və toksinlər, prekursorlar üzrə:",
          emphasis: true,
          children: {
            items: [
              "ixrac, idxal, təkrar ixrac, təkrar idxal üçün malalan (malgöndərən), istehsalçı, malın son istifadəsi və Ərizəçisi, təyinatı üzrə istifadə edilməsi haqqında müvafiq dövlət orqanı tərəfindən təsdiq edilmiş ətraflı məlumat, malın texniki göstəriciləri və təhlükəsizliyinin təmin edilməsi barədə məlumatlar",
              "tranzit üçün malalan (malgöndərən), son Ərizəçi, malın texniki göstəriciləri və nəql edilməsində təhlükəsizliyin təminatı haqqında məlumatlar",
            ],
          },
        },
      ],
    },
    {
      title: "Dayandırılma və imtinanın hüquqi əsasları",
      items: [
        {
          text: "“Lisenziya və icazələr haqqında” Azərbaycan Respublikası Qanununun 20.1-ci maddəsinə əsasən icazənin verilməsindən aşağıdakı hallarda imtina edilir:",
          emphasis: true,
          children: {
            ordered: true,
            items: [
              "ərizədə və ona əlavə olunmuş sənədlərdə qanuna uyğun olmayan məlumatlar olduqda",
              "ərizəçi icazə verilməsi şərtlərini yerinə yetirmədikdə",
            ],
          },
        },
        {
          text: "“Lisenziya və icazələr haqqında” Azərbaycan Respublikası Qanununun 25.1-ci maddəsinə əsasən icazə aşağıdakı hallarda dayandırılır:",
          emphasis: true,
          children: {
            ordered: true,
            items: [
              "İcazə sahibi tərəfindən müvafiq ərizə təqdim edildikdə",
              "icazə sahibinin icazə şərtlərinin pozulması hallarının aradan qaldırılmasına dair icazə verən orqanın, həmçinin müvafiq nəzarət orqanının göstərişlərini yerinə yetirmədikdə",
              "Azərbaycan Respublikasının qanunları ilə müəyyən edilmiş digər hallarda",
            ],
          },
        },
        {
          text: "İxrac nəzarətinə düşən mallar (işlər, xidmətlər, əqli fəaliyyətin nəticələri) üzrə xüsusi icazənin verilməsi Qaydalarının 2.4-cü bəndinə əsasən xüsusi icazənin verilməsindən aşağıdakı hallarda imtina edilir:",
          emphasis: true,
          children: {
            ordered: true,
            items: [
              "xüsusi icazənin verilməsi Azərbaycan Respublikasının milli təhlükəsizliyinə, siyasi, hərbi və iqtisadi maraqlarına zərər gətirə bildiyi halda",
              "Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr üzrə öhdəliklərə riayət olunmaması ehtimalı olduqda",
              "ixrac nəzarətinə düşən malların ixracına qadağa və ya məhdudiyyət qoyulmuş dövlətlər və son Ərizəçilər olduqda",
              "təyinat ölkəsi Azərbaycan Respublikasının qarşısında öz öhdəliklərini yerinə yetirmədikdə",
              "Azərbaycan Respublikasının ərazisindən tranzit ərazisi kimi istifadə etməklə milli təhlükəsizliyinə toxunan ölkələrin ərazilərinə malların keçirilməsi ehtimalı olduqda",
              "araşdırma və yoxlamalar aparıldıqdan sonra ərizəçi tərəfindən doğru olmayan məlumatlar təqdim edildiyi aşkar olunduqda",
              "ixrac olunan malların kütləvi qırğın silahlarının yaradılmasında istifadə edilməsi ehtimalı olduqda",
              "sövdələşmələrdə iştirak edən vasitəçilər tərəfindən ixrac nəzarəti haqqında qanunvericiliyin tələblərinə riayət edilməməsi ehtimalı olduqda",
              "sövdələşmələrdə digər faktlar aşkar edildikdə",
            ],
          },
        },
        {
          text: "İxrac nəzarətinə düşən mallar üzrə xüsusi icazənin verilməsi Qaydalarının 6.1-ci bəndinə əsasən xüsusi icazə aşağıdakı hallarda dayandırılır:",
          emphasis: true,
          children: {
            ordered: true,
            items: [
              "sifarişçi tərəfindən müvafiq ərizə təqdim edildikdə",
              "Azərbaycan Respublikasının qanunvericiliyinə uyğun olaraq müvafiq dövlət orqanları tərəfindən xüsusi icazə sahibinin fəaliyyəti dayandırıldıqda",
              "xüsusi icazə sahibinin müflisləşməsi faktı Azərbaycan Respublikasının qanunvericiliyi ilə təsdiq edildikdə",
              "xarici iqtisadi əməliyyat növünün həyata keçirilməsi üçün bu Qaydalarda tələb olunan şərtlərin pozulduğu aşkar edildikdə",
            ],
          },
        },
      ],
    },
  ],
};

export default function PermissionDetailPage({ permission = permissionDetail }: { permission?: PermissionDetailData }) {
  return (
    <main className="bg-slate-50 px-6 pb-16 pt-4 sm:pb-20 lg:px-20" aria-labelledby="permission-page-title">
      <div className="mx-auto grid max-w-7xl items-start gap-5 lg:grid-cols-[minmax(0,847px)_minmax(0,413px)]">
        <div className="flex min-w-0 flex-col gap-5">
          <PermissionIdentity {...permission} />
          {permission.sections.map((section, index) => (
            <PermissionInfoSection key={section.title} index={index + 1} {...section} />
          ))}
        </div>
        <PermissionSummary {...permission} />
      </div>
    </main>
  );
}
