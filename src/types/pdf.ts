import { type PrintConfig } from "./template"

export interface PDFGenerationOptions {
	filename: string
	printConfig: PrintConfig
	data: Record<string, unknown>
}

export interface AlignmentGuide {
	type: "vertical" | "horizontal"
	position: number
	color?: string
}

export interface CanvasState {
	zoom: number
	gridSize: number
	showGrid: boolean
	showGuides: boolean
	snapToGrid: boolean
}
