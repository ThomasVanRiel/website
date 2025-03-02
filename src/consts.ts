import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Thomas VAN RIEL",
  DESCRIPTION: "Thomas Van Riel's personal website and blog.",
  AUTHOR: "Thomas Van Riel",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  /*{ 
    TEXT: "Work", 
    HREF: "/work", 
  },*/
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
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

