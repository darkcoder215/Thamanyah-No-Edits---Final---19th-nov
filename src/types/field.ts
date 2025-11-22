export interface TemplateField {
	id: string
	name: string // e.g., "employeeName"
	label: string // e.g., "Employee Name"
	type: FieldType
	placeholder?: string
	defaultValue?: unknown
	required: boolean
	validation?: ValidationRule[]

	// Position in template
	selector: string // CSS selector or data-field attribute

	// For arrays
	isArray?: boolean
	arrayItemTemplate?: string
}

export type FieldType = "text" | "number" | "date" | "email" | "array" | "image"

export interface ValidationRule {
	type: "required" | "min" | "max" | "pattern" | "custom"
	value?: unknown
	message: string
}

export interface FieldMapping {
	[templateField: string]: string // Maps to Excel column name
}

export interface ExcelData {
	headers: string[]
	rows: Record<string, unknown>[]
	sheetName: string
}
