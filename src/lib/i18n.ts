// Pure i18n module — safe to import from both server (.astro) and client (.tsx)
// islands. It must NOT import anything server-only (e.g. astro:content).
// Content collection localization lives in src/lib/content.ts instead.

export const LANGS = ["en", "nl"] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = "en"

export function isLang(value: string | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value)
}

/** The locale encoded in a pathname, e.g. "/nl/articles" -> "nl". */
export function getLangFromPath(pathname: string): Lang {
  const seg = pathname.split("/")[1]
  return isLang(seg) ? seg : DEFAULT_LANG
}

/** A pathname with its leading locale segment removed, e.g. "/nl/articles" -> "/articles". */
export function stripLang(pathname: string): string {
  const parts = pathname.split("/")
  if (isLang(parts[1])) {
    const rest = "/" + parts.slice(2).join("/")
    return rest === "/" ? "/" : rest.replace(/\/$/, "")
  }
  return pathname.replace(/(.)\/$/, "$1")
}

/** Prefix a bare app path with a locale, e.g. ("/articles", "nl") -> "/nl/articles". */
export function localizePath(path: string, lang: Lang): string {
  if (!path.startsWith("/")) return path // external / mailto / hash
  if (path === "/") return `/${lang}`
  return `/${lang}${path}`
}

/** Swap the locale of a full (already-prefixed) pathname. */
export function switchLocalePath(pathname: string, target: Lang): string {
  return localizePath(stripLang(pathname), target)
}

const en = {
  nav: {
    home: "Home",
    work: "Work",
    articles: "Articles",
    projects: "Projects",
    photography: "Photography",
  },
  pages: {
    home: { title: "Home", description: "Thomas Van Riel's personal website and articles." },
    work: { title: "Work", description: "Places I have worked." },
    articles: { title: "Articles", description: "Writing on topics I am passionate about." },
    projects: { title: "Projects", description: "Recent projects I have worked on." },
    photography: { title: "Photography", description: "A selection of photographs." },
    search: { title: "Search", description: "Search all posts and projects by keyword." },
  },
  home: {
    greeting: "Hello, I am",
    subtitle: "Mechanical Engineer, Tinkerer, and Creator",
    readArticles: "Read my articles",
    tryFlowchart: "Try my flowchart recipe generator",
    aboutHtml: [
      "I am a <b><i>mechanical engineer</i></b>, <b><i>researcher</i></b>, <b><i>tinkerer</i></b>, and <b><i>creator</i></b>. (And a nerd)",
      "I love to both build and break things. I am motivated by challenging projects with self-guided research and dynamic problem solving. My true passions are <b>elegant mechanical design</b> and clear <b>visual communication</b>.",
      "After finishing my PhD at the Department of Mechanical Engineering of KU Leuven, I was able to stay as a permanent member of the technical support staff. As a mechanical design expert, I guide researchers in the design of their experimental setups, and translate their and other partners' needs into a prototype which can be manufactured in house.",
    ],
    recentArticles: "Recent articles",
    allArticles: "All articles",
    recentProjects: "Recent projects",
    allProjects: "All projects",
    letsConnect: "Let's Connect",
    connectText: "Reach out to me via email or on social media.",
  },
  filter: "Filter",
  showingArticles: (count: number, total: number) => `SHOWING ${count} OF ${total} ARTICLES`,
  showingProjects: (count: number, total: number) => `SHOWING ${count} OF ${total} PROJECTS`,
  showingPhotographs: (count: number, total: number) => `SHOWING ${count} OF ${total} PHOTOGRAPHS`,
  searchPlaceholder: "What are you looking for?",
  searchResults: (count: number, query: string) => `Found ${count} results for '${query}'`,
  searchNoResults: (query: string) => `No results for '${query}'`,
  minRead: (minutes: number) => `${minutes} min read`,
  prev: "Prev",
  next: "Next",
  seeDemo: "See Demo",
  seeRepository: "See Repository",
  draft: "Draft",
  onThisPage: "On This Page",
  lastUpdated: "Last updated",
  englishOnly: "This article is only available in English.",
  backToTop: "Back to top",
  backToTopAria: "Back to top of page",
  aiManifesto: "AI Manifesto",
  allRightsReserved: "All rights reserved",
  pill: { articles: "post", projects: "project", photography: "photo" } as Record<string, string>,
  aria: {
    toggleTheme: "Toggle light and dark theme",
    toggleDrawer: "Toggle drawer open and closed",
    changeLanguage: "Change language",
    search: (site: string) => `Search articles and projects on ${site}`,
    rss: (site: string) => `RSS feed for ${site}`,
  },
}

export type UIStrings = typeof en

const nl: UIStrings = {
  nav: {
    home: "Home",
    work: "Werk",
    articles: "Artikels",
    projects: "Projecten",
    photography: "Fotografie",
  },
  pages: {
    home: { title: "Home", description: "De persoonlijke website en artikels van Thomas Van Riel." },
    work: { title: "Werk", description: "Plaatsen waar ik gewerkt heb." },
    articles: { title: "Artikels", description: "Schrijfsels over onderwerpen waar ik gepassioneerd over ben." },
    projects: { title: "Projecten", description: "Recente projecten waaraan ik gewerkt heb." },
    photography: { title: "Fotografie", description: "Een selectie van foto's." },
    search: { title: "Zoeken", description: "Doorzoek alle artikels en projecten op trefwoord." },
  },
  home: {
    greeting: "Hallo, ik ben",
    subtitle: "Werktuigkundig ingenieur, knutselaar en maker",
    readArticles: "Lees mijn artikels",
    tryFlowchart: "Probeer mijn flowchart-receptgenerator",
    aboutHtml: [
      "Ik ben een <b><i>werktuigkundig ingenieur</i></b>, <b><i>onderzoeker</i></b>, <b><i>knutselaar</i></b> en <b><i>maker</i></b>. (En een nerd)",
      "Ik hou ervan om dingen te bouwen én kapot te maken. Ik krijg energie van uitdagende projecten met zelfgestuurd onderzoek en dynamisch probleemoplossen. Mijn echte passies zijn <b>elegant mechanisch ontwerp</b> en heldere <b>visuele communicatie</b>.",
      "Na het afronden van mijn doctoraat aan het Departement Werktuigkunde van de KU Leuven kon ik blijven als vast lid van het technisch ondersteunend personeel. Als expert in mechanisch ontwerp begeleid ik onderzoekers bij het ontwerp van hun experimentele opstellingen, en vertaal ik hun noden en die van andere partners naar een prototype dat in eigen huis gemaakt kan worden.",
    ],
    recentArticles: "Recente artikels",
    allArticles: "Alle artikels",
    recentProjects: "Recente projecten",
    allProjects: "Alle projecten",
    letsConnect: "Laten we praten",
    connectText: "Bereik me via e-mail of op sociale media.",
  },
  filter: "Filter",
  showingArticles: (count, total) => `TOONT ${count} VAN ${total} ARTIKELS`,
  showingProjects: (count, total) => `TOONT ${count} VAN ${total} PROJECTEN`,
  showingPhotographs: (count, total) => `TOONT ${count} VAN ${total} FOTO'S`,
  searchPlaceholder: "Waar ben je naar op zoek?",
  searchResults: (count, query) => `${count} resultaten gevonden voor '${query}'`,
  searchNoResults: (query) => `Geen resultaten voor '${query}'`,
  minRead: (minutes) => `${minutes} min lezen`,
  prev: "Vorige",
  next: "Volgende",
  seeDemo: "Bekijk demo",
  seeRepository: "Bekijk repository",
  draft: "Concept",
  onThisPage: "Op deze pagina",
  lastUpdated: "Laatst bijgewerkt",
  englishOnly: "Dit artikel is enkel in het Engels beschikbaar.",
  backToTop: "Terug naar boven",
  backToTopAria: "Terug naar boven van de pagina",
  aiManifesto: "AI-manifest",
  allRightsReserved: "Alle rechten voorbehouden",
  pill: { articles: "artikel", projects: "project", photography: "foto" },
  aria: {
    toggleTheme: "Schakel tussen licht en donker thema",
    toggleDrawer: "Menu openen en sluiten",
    changeLanguage: "Verander taal",
    search: (site) => `Zoek artikels en projecten op ${site}`,
    rss: (site) => `RSS-feed voor ${site}`,
  },
}

export const ui: Record<Lang, UIStrings> = { en, nl }

export function useTranslations(lang: Lang): UIStrings {
  return ui[lang] ?? ui[DEFAULT_LANG]
}

/** Intl locale tag for date formatting. */
export const LOCALE_TAG: Record<Lang, string> = { en: "en-US", nl: "nl-NL" }
