import type { Site, Links, Socials } from "@types"

// Global. Page titles and descriptions are localized in src/lib/i18n.ts (ui.pages.*).
export const SITE: Site = {
  TITLE: "Thomas VAN RIEL",
  DESCRIPTION: "Thomas Van Riel's personal website and articles.",
  AUTHOR: "Thomas Van Riel",
}

// Nav links. HREF is a bare (unprefixed) app path; the locale prefix is added at render
// time via localizePath(). Labels come from the i18n nav dictionary keyed by KEY.
export const LINKS: Links = [
  {
    KEY: "home",
    HREF: "/",
  },
  /*{
    KEY: "work",
    HREF: "/work",
  },*/
  {
    KEY: "articles",
    HREF: "/articles",
  },
  /*{
    KEY: "projects",
    HREF: "/projects",
  },*/
  /*{
    KEY: "photography",
    HREF: "/photography",
  },*/
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "thomas.van.riel@gmail.com",
    HREF: "mailto:thomas.van.riel@gmail.com",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "thomasvanriel",
    HREF: "https://github.com/thomasvanriel"
  },
  {
    NAME: "Discord",
    ICON: "discord",
    TEXT: "thomasvanriel",
    HREF: "https://discordapp.com/users/thomasvanriel"
  },
  /*  
  { 
    NAME: "Youtube",
    ICON: "youtube",
    TEXT: "thomas-van-riel",
    HREF: "https://www.youtube.com/@thomas-van-riel"
  },
  */
]

