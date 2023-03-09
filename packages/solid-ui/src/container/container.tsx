import type { CSS } from "../theme/stitches.config"

import { createMemo, mergeProps, ParentComponent, splitProps, type JSX } from "solid-js"
import { Wrap, Display, Justify, Direction, AlignItems, AlignContent } from "../utils/prop-types"

import StyledContainer from "./container.styles"

type BaseContainerProps = {
	gap?: number
	xs?: boolean
	sm?: boolean
	md?: boolean
	lg?: boolean
	xl?: boolean
	responsive?: boolean
	fluid?: boolean
	wrap?: Wrap
	display?: Display
	justify?: Justify
	direction?: Direction
	alignItems?: AlignItems
	alignContent?: AlignContent
	as?: keyof JSX.IntrinsicElements
	css?: CSS
	ref?: HTMLElement
}

const defaultProps = {
	gap: 2,
	xs: false,
	sm: false,
	md: false,
	lg: false,
	xl: false,
	responsive: true,
	fluid: false,
	wrap: "wrap",
	as: "div",
	display: "block",
} satisfies BaseContainerProps

type NativeAttrs = Omit<JSX.HTMLAttributes<unknown>, keyof BaseContainerProps>

export type ContainerProps = BaseContainerProps & NativeAttrs

const Container: ParentComponent<ContainerProps> = props => {
	const mergedProps = mergeProps(defaultProps, props)
	const [local, others] = splitProps(mergedProps, [
		"alignItems",
		"alignContent",
		"wrap",
		"display",
		"justify",
		"direction",
		"css",
		"gap",
		"xs",
		"sm",
		"md",
		"lg",
		"xl",
		"as",
		"fluid",
		"responsive",
		"children",
	])
	const gapUnit = createMemo(() => `calc(${local.gap} * $space$sm)`)

	const getMaxWidth = () => {
		if (local.xs) return "$breakpoints$xs"
		if (local.sm) return "$breakpoints$sm"
		if (local.md) return "$breakpoints$md"
		if (local.lg) return "$breakpoints$lg"
		if (local.xl) return "$breakpoints$xl"

		return ""
	}

	return (
		<StyledContainer
			as={local.as}
			fluid={local.fluid}
			responsive={local.responsive}
			css={{
				px: gapUnit(),
				maxWidth: getMaxWidth(),
				alignItems: local.alignItems,
				alignContent: local.alignContent,
				flexWrap: local.wrap,
				display: local.display,
				justifyContent: local.justify,
				flexDirection: local.direction,
				...local.css,
			}}
			{...others}
		>
			{props.children}
		</StyledContainer>
	)
}

Container.toString = () => ".solid-container"

export default Container
