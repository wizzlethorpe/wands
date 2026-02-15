import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration for Wands & Wizards
 *
 * A Harry Potter 5e adaptation rulebook and compendium
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Wands & Wizards",
    pageTitleSuffix: " - W&W",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "wands.example.com", // Update with your actual domain
    ignorePatterns: ["private", "templates", "Templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Playfair Display",  // Elegant serif, evokes British magical academia
        body: "Lora",                // Literary, readable, classic feel
        code: "JetBrains Mono",      // Modern monospace for spells/code
      },
      colors: {
        lightMode: {
          light: "#f8f5f0",        // Aged parchment
          lightgray: "#e6ddd0",    // Warm light gray
          gray: "#8b8178",         // Stone gray
          darkgray: "#3d3532",     // Dark charcoal
          dark: "#1a1518",         // Near black with warmth
          secondary: "#740001",    // Gryffindor maroon/burgundy
          tertiary: "#d3a625",     // Hogwarts gold
          highlight: "rgba(116, 0, 1, 0.12)",
          textHighlight: "#d3a62555",
        },
        darkMode: {
          light: "#0a0f0a",        // Deep dark green-black
          lightgray: "#1a2419",    // Dark forest
          gray: "#5a6a58",         // Muted green-gray (slightly lighter)
          darkgray: "#d0d8d0",     // Silver-gray text
          dark: "#e8ece8",         // Silver-white
          secondary: "#2d8049",    // Brighter Slytherin green
          tertiary: "#c0c0c0",     // Brighter silver
          highlight: "rgba(45, 128, 73, 0.25)",
          textHighlight: "#2d804944",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
