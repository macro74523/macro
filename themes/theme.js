import BLOG, { LAYOUT_MAPPINGS } from '@/blog.config'
import * as ThemeComponents from '@theme-components'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

export const getThemeConfig = async themeQuery => {
  if (typeof themeQuery === 'string' && themeQuery.trim()) {
    const themeName = themeQuery.split(',')[0].trim()

    if (themeName !== BLOG.THEME) {
      try {
        const THEME_CONFIG = await import(`@/themes/${themeName}`)
          .then(m => m.THEME_CONFIG)
          .catch(err => {
            console.error(`Failed to load theme ${themeName}:`, err)
            return null
          })

        if (THEME_CONFIG) {
          return THEME_CONFIG
        } else {
          console.warn(
            `Loading ${themeName} failed. Falling back to default theme.`
          )
          return ThemeComponents?.THEME_CONFIG
        }
      } catch (error) {
        console.error(
          `Error loading theme configuration for ${themeName}:`,
          error
        )
        return ThemeComponents?.THEME_CONFIG
      }
    }
  }

  return ThemeComponents?.THEME_CONFIG
}

export const getBaseLayoutByTheme = theme => {
  const LayoutBase = ThemeComponents['LayoutBase']
  const isDefaultTheme = !theme || theme === BLOG.THEME
  if (!isDefaultTheme) {
    return dynamic(
      () => import(`@/themes/${theme}`).then(m => m['LayoutBase']),
      { ssr: true }
    )
  }

  return LayoutBase
}

export const DynamicLayout = props => {
  const { theme, layoutName } = props
  const SelectedLayout = useLayoutByTheme({ layoutName, theme })
  return <SelectedLayout {...props} />
}

export const useLayoutByTheme = ({ layoutName, theme }) => {
  const LayoutComponents =
    ThemeComponents[layoutName] || ThemeComponents.LayoutSlug

  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
  const isDefaultTheme = !themeQuery || themeQuery === BLOG.THEME

  if (!isDefaultTheme) {
    const loadThemeComponents = componentsSource => {
      const components =
        componentsSource[layoutName] || componentsSource.LayoutSlug
      setTimeout(fixThemeDOM, 500)
      return components
    }
    return dynamic(
      () => import(`@/themes/${themeQuery}`).then(m => loadThemeComponents(m)),
      { ssr: true }
    )
  }

  setTimeout(fixThemeDOM, 100)
  return LayoutComponents
}

const getLayoutNameByPath = path => {
  const layoutName = LAYOUT_MAPPINGS[path] || 'LayoutSlug'
  return layoutName
}

const fixThemeDOM = () => {
  if (isBrowser) {
    const elements = document.querySelectorAll('[id^="theme-"]')
    if (elements?.length > 1) {
      for (let i = 0; i < elements.length - 1; i++) {
        if (
          elements[i] &&
          elements[i].parentNode &&
          elements[i].parentNode.contains(elements[i])
        ) {
          elements[i].parentNode.removeChild(elements[i])
        }
      }
      elements[0]?.scrollIntoView()
    }
  }
}

export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  let newDarkMode = isPreferDark()

  const userDarkMode = loadDarkModeFromLocalStorage()
  const lastPeriod = localStorage.getItem('darkModePeriod')
  const currentPeriod = getCurrentPeriod()

  if (userDarkMode && lastPeriod === currentPeriod) {
    newDarkMode = userDarkMode === 'dark' || userDarkMode === 'true'
    saveDarkModeToLocalStorage(newDarkMode)
  } else {
    localStorage.removeItem('darkMode')
    localStorage.setItem('darkModePeriod', currentPeriod)
  }

  if (defaultDarkMode === 'true') {
    newDarkMode = true
  }

  const queryMode = getQueryVariable('mode')
  if (queryMode) {
    newDarkMode = queryMode === 'dark'
  }

  updateDarkMode(newDarkMode)
  document
    .getElementsByTagName('html')[0]
    .setAttribute('class', newDarkMode ? 'dark' : 'light')
}

export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') {
    return true
  }
  if (BLOG.APPEARANCE === 'auto') {
    const date = new Date()
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    return (
      prefersDarkMode ||
      (BLOG.APPEARANCE_DARK_TIME &&
        (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] ||
          date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
    )
  }
  return false
}

export const getCurrentPeriod = () => {
  const hour = new Date().getHours()
  const [darkStart, darkEnd] = BLOG.APPEARANCE_DARK_TIME || [18, 6]
  const isNight = hour >= darkStart || hour < darkEnd
  return isNight ? 'night' : 'day'
}

export const loadDarkModeFromLocalStorage = () => {
  return localStorage.getItem('darkMode')
}

export const saveDarkModeToLocalStorage = newTheme => {
  localStorage.setItem('darkMode', newTheme)
  localStorage.setItem('darkModePeriod', getCurrentPeriod())
}
