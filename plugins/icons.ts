import { defineNuxtPlugin } from "#app"
import { Building2Icon, ShoppingBagIcon, GlobeIcon, PlaneIcon, StoreIcon, Gamepad2Icon } from "lucide-vue-next"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Building2Icon", Building2Icon)
  nuxtApp.vueApp.component("ShoppingBagIcon", ShoppingBagIcon)
  nuxtApp.vueApp.component("GlobeIcon", GlobeIcon)
  nuxtApp.vueApp.component("PlaneIcon", PlaneIcon)
  nuxtApp.vueApp.component("StoreIcon", StoreIcon)
  nuxtApp.vueApp.component("Gamepad2Icon", Gamepad2Icon)
})

