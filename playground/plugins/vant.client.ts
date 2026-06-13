import { Picker, DropdownMenu, DropdownItem, Cascader, Popup, Field } from 'vant'
import 'vant/lib/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Picker)
  nuxtApp.vueApp.use(DropdownMenu)
  nuxtApp.vueApp.use(DropdownItem)
  nuxtApp.vueApp.use(Cascader)
  nuxtApp.vueApp.use(Popup)
  nuxtApp.vueApp.use(Field)
})
