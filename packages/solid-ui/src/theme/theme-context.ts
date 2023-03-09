import { createContext, type Context } from "solid-js"
import { theme } from "./stitches.config"
import type { UIThemeContext } from "./types"

export const defaultContext: UIThemeContext = {
	isDark: false,
	theme,
	type: "light",
}

const ThemeContext: Context<UIThemeContext> = createContext<UIThemeContext>(defaultContext)

export default ThemeContext
