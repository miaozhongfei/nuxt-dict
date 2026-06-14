import { useNuxtApp, useCookie, useRuntimeConfig } from '#imports'
import type { DictManager } from '../core/dict-manager'
import type { ResolvedModuleOptions } from '../types'
import { defaultOptions } from '../options'

/**
 * 获取/切换当前语言。
 * 切换语言时会同步更新 cookie（客户端）并通知 DictManager 刷新缓存。
 * locale 为 DictManager 上的响应式 ref，语言切换后所有 useDict / useDictTree 组件自动重取。
 *
 * @description 从 DictManager 获取当前语言信息，提供切换语言并持久化到 cookie 的能力。
 * @returns {{ locale: Ref<string>, setLocale: (newLocale: string) => void, locales: string[] }} 当前语言 ref、语言切换函数、支持的语言列表
 *
 * @example
 * const { locale, setLocale } = useLocale()
 *
 * // 切换语言
 * setLocale('en-US')                // 切换到英文
 * console.log(locale.value)         // 'en-US'
 *
 * // 模板中直接使用
 * // <p>当前语言：{{ locale }}</p>
 * // <button @click="setLocale('zh-CN')">中文</button>
 */
export function useLocale() {
  const nuxtApp = useNuxtApp()
  const manager = nuxtApp.$dictManager as DictManager

  const options = (useRuntimeConfig().public.dict ?? defaultOptions) as ResolvedModuleOptions

  /**
   * 切换语言并持久化到 cookie。
   * 会同步更新 DictManager 的语言状态，触发所有活跃的 useDict / useDictTree 组件自动重取数据。
   *
   * @param {string} newLocale - 目标语言代码，如 'en-US'、'zh-CN'
   */
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
