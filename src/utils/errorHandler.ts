export class FigmaConverterError extends Error {
	constructor(
		message: string,
		public code: ErrorCode,
		public context?: unknown,
	) {
		super(message)
		this.name = "FigmaConverterError"
	}
}

export enum ErrorCode {
	INVALID_JSX = "INVALID_JSX",
	INVALID_IMAGE = "INVALID_IMAGE",
	INVALID_DIMENSIONS = "INVALID_DIMENSIONS",
	AI_TIMEOUT = "AI_TIMEOUT",
	AI_ERROR = "AI_ERROR",
	PARSE_ERROR = "PARSE_ERROR",
	EXCEL_PARSE_ERROR = "EXCEL_PARSE_ERROR",
	PDF_GENERATION_ERROR = "PDF_GENERATION_ERROR",
	TEMPLATE_SAVE_ERROR = "TEMPLATE_SAVE_ERROR",
	NETWORK_ERROR = "NETWORK_ERROR",
}

export const errorMessages: Record<
	ErrorCode,
	{ title: string; suggestion: string; action: string }
> = {
	[ErrorCode.INVALID_JSX]: {
		title: "Invalid JSX Code",
		suggestion: "Check that your Figma Dev code is valid React JSX.",
		action: "Edit Code",
	},
	[ErrorCode.INVALID_IMAGE]: {
		title: "Invalid Image File",
		suggestion: "Please upload a PNG, JPG, or WebP image.",
		action: "Upload Again",
	},
	[ErrorCode.INVALID_DIMENSIONS]: {
		title: "Invalid Dimensions",
		suggestion: "Width and height must be positive numbers.",
		action: "Fix Dimensions",
	},
	[ErrorCode.AI_TIMEOUT]: {
		title: "Processing Timeout",
		suggestion:
			"The design is too complex. Try simplifying or splitting into multiple pages.",
		action: "Retry",
	},
	[ErrorCode.AI_ERROR]: {
		title: "AI Processing Error",
		suggestion: "An error occurred while processing. Please try again.",
		action: "Retry",
	},
	[ErrorCode.PARSE_ERROR]: {
		title: "Parse Error",
		suggestion: "Failed to parse the AI response. Please try again.",
		action: "Retry",
	},
	[ErrorCode.EXCEL_PARSE_ERROR]: {
		title: "Excel Parse Error",
		suggestion: "Failed to parse Excel file. Ensure it's a valid .xlsx file.",
		action: "Upload Again",
	},
	[ErrorCode.PDF_GENERATION_ERROR]: {
		title: "PDF Generation Error",
		suggestion: "Failed to generate PDF. Please check your template and data.",
		action: "Retry",
	},
	[ErrorCode.TEMPLATE_SAVE_ERROR]: {
		title: "Template Save Error",
		suggestion: "Failed to save template. Check your storage quota.",
		action: "Retry",
	},
	[ErrorCode.NETWORK_ERROR]: {
		title: "Network Error",
		suggestion: "Please check your internet connection and try again.",
		action: "Retry",
	},
}

export const validateJSX = (jsx: string): void => {
	if (!jsx || jsx.trim().length === 0) {
		throw new FigmaConverterError("JSX code is required", ErrorCode.INVALID_JSX)
	}

	// Basic JSX validation
	const openTags = jsx.match(/<[^/][^>]*>/g)?.length || 0
	const closeTags = jsx.match(/<\/[^>]+>/g)?.length || 0

	if (openTags !== closeTags) {
		throw new FigmaConverterError(
			"JSX has mismatched opening and closing tags",
			ErrorCode.INVALID_JSX,
		)
	}
}

export const validateImage = (file: File): void => {
	const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"]

	if (!validTypes.includes(file.type)) {
		throw new FigmaConverterError(
			`Invalid image type: ${file.type}. Must be PNG, JPG, or WebP.`,
			ErrorCode.INVALID_IMAGE,
		)
	}

	// Check file size (max 10MB)
	const maxSize = 10 * 1024 * 1024
	if (file.size > maxSize) {
		throw new FigmaConverterError(
			"Image file too large. Maximum size is 10MB.",
			ErrorCode.INVALID_IMAGE,
		)
	}
}

export const validateDimensions = (width: number, height: number): void => {
	if (width <= 0 || height <= 0) {
		throw new FigmaConverterError(
			"Width and height must be positive numbers",
			ErrorCode.INVALID_DIMENSIONS,
		)
	}

	if (width > 10000 || height > 10000) {
		throw new FigmaConverterError(
			"Dimensions are too large. Maximum is 10000px.",
			ErrorCode.INVALID_DIMENSIONS,
		)
	}
}
