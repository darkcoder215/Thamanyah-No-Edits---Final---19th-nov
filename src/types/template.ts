import { type FigmaInput, type ConversionResult } from "./figma"
import { type TemplateField } from "./field"

export interface Template {
	id: string
	name: string
	description?: string

	// Original Figma data
	figmaInput: FigmaInput

	// AI-generated output
	generatedJSX: string
	tailwindClasses: string[]

	// Field configuration
	fields: TemplateField[]

	// Layout configuration
	pages: TemplatePage[]

	// Print settings
	printConfig: PrintConfig

	// Metadata
	thumbnail: string
	createdAt: Date
	updatedAt: Date
}

export interface TemplatePage {
	id: string
	order: number
	jsx: string
	dimensions: { width: number; height: number }
}

export interface PrintConfig {
	pageSize: "A4" | "Letter" | "Legal"
	orientation: "portrait" | "landscape"
	margins: {
		top: number
		right: number
		bottom: number
		left: number
	}
	colorMode: "color" | "grayscale"
	mergePDFs: boolean
}

export interface BatchGenerationConfig {
	template: Template
	data: Record<string, unknown>[]
	outputFormat: "separate" | "merged" | "zip"
	filenamePattern: string // e.g., "offer_{name}_{date}.pdf"
}

export interface WizardData {
	step1?: FigmaInput
	step2?: ConversionResult
	step3?: TemplateField[]
	step4?: EditableElement[]
	currentStep?: number
}

export interface EditableElement {
	id: string
	type: "text" | "image" | "shape" | "group"

	// Position
	x: number
	y: number
	width: number
	height: number

	// Styling
	className: string
	styles: React.CSSProperties

	// Content
	content: string | React.ReactNode

	// Field mapping
	fieldName?: string
	isDynamic: boolean

	// Hierarchy
	parentId?: string
	children?: string[]

	// Constraints
	locked: boolean
	visible: boolean
}
