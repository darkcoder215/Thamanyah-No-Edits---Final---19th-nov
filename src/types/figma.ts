export interface FigmaInput {
	jsx: string
	textStyles: string | TextStyles
	screenshot: File | string // File or base64
	dimensions: {
		width: number
		height: number
	}
	pageCount: number
}

export interface TextStyles {
	[key: string]: {
		fontFamily: string
		fontSize: number
		fontWeight: number
		lineHeight?: number
		letterSpacing?: number
		color?: string
	}
}

export interface ConversionResult {
	jsx: string
	fields: DetectedField[]
	dimensions: { width: string; height: string }
	tailwindClasses: string[]
	errors?: string[]
	warnings?: string[]
}

export interface DetectedField {
	name: string
	type: FieldType
	selector: string
	defaultValue?: string
	placeholder?: string
}

export type FieldType = "text" | "number" | "date" | "email" | "array" | "image"
