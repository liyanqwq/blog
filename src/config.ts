import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://blog.liyan.moe/", // replace this with your deployed domain
  author: "Li Yan",
  desc: "Li Yan's blog for web development and cyber society.",
  title: "Li Yan's Blog",
  // ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-HK"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/liyanqwq",
    linkTitle: `${SITE.author}'s Github`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/liyanqwq",
    linkTitle: `${SITE.author}'s Twitter`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:liyanqwq@gmail.com",
    linkTitle: `Send an email to ${SITE.author}`,
    active: true,
  },
  {
    name: "Telegram",
    href: "https://t.me/real_leozhao",
    linkTitle: `${SITE.author}'s Telegram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.author}'s LinkedIn`,
    active: false,
  }
];
