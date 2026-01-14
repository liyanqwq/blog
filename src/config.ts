export const SITE = {
  website: "https://blog.liyan.moe/", // replace this with your deployed domain
  author: "Li Yan",
  profile: "https://liyan.moe/",
  desc: "於數字長河一隅，煮「碼」論道。 Brewing code beyond the digital stream.",
  title: "對岸茶館 Cyber Teahouse - Li Yan's Blog",
  ogImage: "dnit-og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  showCalendarIcon: false,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: false, // show back button in post detail
  showBreadcrumb: false,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-HK", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Hong_Kong", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
