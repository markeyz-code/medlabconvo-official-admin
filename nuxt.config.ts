import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,

  devServer: {
    port: 3001,
    host: 'localhost'
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      title: "medlabconvo | Admin",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "description",
          content:
            "medlabconvo - Health research publications and resources for healthcare professionals in Africa",
        },
        {
          name: "keywords",
          content:
            "health research, publications, Africa, healthcare, medical research",
        },
        { name: "author", content: "medlabconvo" },
        { property: "og:title", content: "medlabconvo" },
        {
          property: "og:description",
          content:
            "Health research publications and resources for healthcare professionals in Africa",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://medlabconvo.com" },
        { property: "og:image", content: "https://medlabconvo.com/icon.jpg" },

        { name: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://medlabconvo.com" },
        { name: "twitter:title", content: "medlabconvo" },
        {
          name: "twitter:description",
          content:
            "Health research publications and resources for healthcare professionals in Africa",
        },
        {
          name: "twitter:image",
          content: "https://medlabconvo.com/icon.jpg",
        },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  build: {
    transpile: ["lucide-vue-next"],
  },

   css: ['/assets/font/stylesheet.css', "/assets/css/main.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@vite-pwa/nuxt"
  ],

   googleFonts: {
    families: {
      "Inter": [400, 500, 600, 700],
      "Poppins": [400, 500, 600, 700],
      "Onest": [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: "swap",
    preload: true,
  },
  nitro: {
    ssr: false,
  },
  compatibilityDate: '2025-04-08'
});