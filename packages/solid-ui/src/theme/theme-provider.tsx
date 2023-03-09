import {
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	onCleanup,
	onMount,
	ParentComponent,
} from "solid-js"
import { isServer } from "solid-js/web"
import deepMerge from "../utils/deepMerge"
import { copyObject } from "../utils/object"
import CSSBaseline from "./css-baseline"
import { StitchesTheme } from "./stitches.config"
import ThemeContext, { defaultContext } from "./theme-context"
import { CreateTheme, ThemeType, UIThemeContext } from "./types"
import { changeTheme, getDocumentCSSTokens, getDocumentTheme, getThemeName } from "./utils"

type ThemeProviderProps = {
	theme?: CreateTheme
	disableBaseline?: boolean
}

const ThemeProvider: ParentComponent<ThemeProviderProps> = props => {
	const [getCurrentTheme, setCurrentTheme] = createSignal<ThemeType | string>(defaultContext.type)
	const mergedProps = mergeProps({ disableBaseline: false }, props)

	const changeCurrentTheme = (theme: ThemeType | string) => {
		setCurrentTheme(ct => (ct !== theme ? theme : ct))
	}

	const changeBaseElement = (element: HTMLElement) => {
		const themeValue = getDocumentTheme(element)

		if (themeValue) {
			changeCurrentTheme(themeValue)
		}
	}

	const providerValue = createMemo<UIThemeContext>(() => {
		const themeTokens = isServer ? {} : getDocumentCSSTokens()
		const themeName = getThemeName(getCurrentTheme())
		const theme = deepMerge(copyObject(defaultContext.theme), themeTokens) as StitchesTheme

		return {
			theme,
			type: themeName,
			isDark: themeName === "dark",
		}
	})

	const observer = new MutationObserver(mutations => {
		if (mutations && mutations.length && mutations[0]?.target.nodeName === "BODY") {
			const documentTheme = document.body.dataset["theme"]

			if (documentTheme) {
				changeCurrentTheme(documentTheme)
			}
		} else {
			changeBaseElement(document.documentElement)
		}
	})
	onMount(() => {
		changeBaseElement(document.documentElement)

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme", "style"],
		})

		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["data-theme", "style"],
		})
	})

	onCleanup(() => {
		observer.disconnect()
	})

	createEffect(() => {
		if (isServer || !mergedProps.theme) return
		if (mergedProps.theme.className) {
			changeTheme(mergedProps.theme.className)
			changeCurrentTheme(getThemeName(mergedProps.theme.className))
		}
	})

	return (
		<>
			<ThemeContext.Provider value={providerValue()}>
				{!mergedProps.disableBaseline && <CSSBaseline />}
				{mergedProps.children}
			</ThemeContext.Provider>
		</>
	)
}

export default ThemeProvider
