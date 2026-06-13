import { useNuxtApp, useCookie, useRuntimeConfig } from '#imports'
import type { DictManager } from '../core/dict-manager'
import type { ResolvedModuleOptions } from '../types'
import { defaultOptions } from '../options'

/**
 * 获取/切换当前语言。
 * 切换语言时会同步更新 cookie（客户端）并通知 DictManager 刷新缓存。
 * locale 为 DictManager 上的响应式 ref，语言切换后所有 useDict / useDictTree 组件自动重取。
 */
export function useLocale() {
  const nuxtApp = useNuxtApp()
  const manager = nuxtApp.$dictManager as DictManager

  const options = (useRuntimeConfig().public.dict ?? defaultOptions) as ResolvedModuleOptions

  /** 切换语言并持久化到 cookie */
  function setLocale(newLocale: string) {
    manager.setLocale(newLocale)

    if (import.meta.client) {
      const langCookie = useCookie(options.locale.cookieKey, { maxAge: 60 * 60 * 24 * 365 })
      langCookie.value = newLocale
    }
  }

  const locales: string[] = []

  return {
    locale: manager.locale,
    setLocale,
    locales,
  }
}
