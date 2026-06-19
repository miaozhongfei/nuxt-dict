import { Picker, DropdownMenu, DropdownItem } from 'vant';

// eslint-disable-next-line import/no-unassigned-import
import 'vant/lib/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Picker);
  nuxtApp.vueApp.use(DropdownMenu);
  nuxtApp.vueApp.use(DropdownItem);
});
