export * from "./utils/prop-types"

export {
	UIProvider,
	changeTheme,
	getDocumentTheme,
	getTokenValue,
	type VariantProps,
	type CSS,
	styled,
	css,
	theme,
	createTheme,
	getCssText,
	globalCss,
	keyframes,
	config,
	config as stitchesConfig,
	theme as defaultTheme,
	type Theme,
	type UITheme,
	type CreateTheme,
	type UIThemeContext,
} from "./theme"

export * from "./theme/shared-css"
export * from "./theme/colors"

// Components
export { default as Container } from "./container"
export * from "./container"
