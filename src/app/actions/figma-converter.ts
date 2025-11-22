"use server"

import { type ConversionResult, type FigmaInput } from "@/types/figma"
import { FIGMA_CONVERSION_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/openrouter/prompts"
import { ErrorCode, FigmaConverterError } from "@/utils/errorHandler"

export async function convertFigmaToTailwind(input: FigmaInput): Promise<ConversionResult> {
	const apiKey = process.env.OPENROUTER_API_KEY

	if (!apiKey) {
		throw new FigmaConverterError("OpenRouter API key not configured", ErrorCode.AI_ERROR)
	}

	try {
		// Prepare text styles as string
		const textStyles =
			typeof input.textStyles === "string"
				? input.textStyles
				: JSON.stringify(input.textStyles, null, 2)

		// Build the user prompt
		const userPrompt = buildUserPrompt(input.jsx, textStyles, input.dimensions)

		// Define JSON schema for structured outputs
		const responseSchema = {
			type: "object" as const,
			properties: {
				jsx: {
					type: "string" as const,
					description: "React JSX code with Tailwind CSS classes",
				},
				fields: {
					type: "array" as const,
					description: "Array of detected fillable fields",
					items: {
						type: "object" as const,
						properties: {
							name: { type: "string" as const },
							type: { type: "string" as const },
							selector: { type: "string" as const },
							defaultValue: { type: "string" as const },
							placeholder: { type: "string" as const },
						},
						required: ["name", "type", "selector"],
						additionalProperties: false,
					},
				},
				dimensions: {
					type: "object" as const,
					properties: {
						width: { type: "string" as const },
						height: { type: "string" as const },
					},
					required: ["width", "height"],
					additionalProperties: false,
				},
				tailwindClasses: {
					type: "array" as const,
					items: { type: "string" as const },
				},
				warnings: {
					type: "array" as const,
					items: { type: "string" as const },
				},
			},
			required: ["jsx", "fields", "dimensions"],
			additionalProperties: false,
		}

		// Prepare messages with correct image_url format
		const messages = [
			{ role: "system", content: FIGMA_CONVERSION_SYSTEM_PROMPT },
			{
				role: "user",
				content: [
					{ type: "text", text: userPrompt },
					...(input.screenshot
						? [
								{
									type: "image_url",
									image_url: {
										url: input.screenshot, // Already base64 from client
									},
								},
							]
						: []),
				],
			},
		]

		console.log("[Figma Converter] Sending request to OpenRouter API...")

		// Call OpenRouter API with timeout and structured outputs
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 min timeout

		let response: Response
		try {
			response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					"HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
					"X-Title": "Figma Template Converter",
				},
				body: JSON.stringify({
					model: "anthropic/claude-sonnet-4.5",
					messages,
					temperature: 0.3,
					max_tokens: 16000, // Increased from 4000 to handle large JSX outputs without truncation
					// Structured outputs with proper OpenRouter format
					response_format: {
						type: "json_schema",
						json_schema: {
							name: "figma_conversion",
							strict: true,
							schema: responseSchema,
						},
					},
				}),
				signal: controller.signal,
			})
		} catch (err) {
			clearTimeout(timeoutId)
			// Handle timeout specifically
			if (err instanceof Error && err.name === "AbortError") {
				throw new FigmaConverterError(
					"AI processing timed out after 2 minutes. Try a simpler design or smaller screenshot.",
					ErrorCode.AI_TIMEOUT,
				)
			}
			// Log the actual error for debugging
			console.error("[Figma Converter] Fetch error:", err)
			throw err
		} finally {
			clearTimeout(timeoutId)
		}

		console.log("[Figma Converter] Response status:", response.status)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error("[Figma Converter] API error:", errorData)
			throw new FigmaConverterError(
				`OpenRouter API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`,
				ErrorCode.AI_ERROR,
				errorData,
			)
		}

		const data = await response.json()
		console.log("[Figma Converter] Response received, parsing content...")

		const content = data.choices?.[0]?.message?.content

		if (!content) {
			console.error("[Figma Converter] No content in response:", data)
			throw new FigmaConverterError("No content received from AI", ErrorCode.AI_ERROR)
		}

		// LOG THE RAW AI RESPONSE FOR DEBUGGING
		console.log("========================================")
		console.log("[Figma Converter] RAW AI RESPONSE:")
		console.log("========================================")
		console.log(content)
		console.log("========================================")
		console.log("[Figma Converter] END RAW AI RESPONSE")
		console.log("========================================")

		// Parse the AI response
		const result = parseAIResponse(content)

		// LOG THE PARSED JSX CODE
		console.log("========================================")
		console.log("[Figma Converter] PARSED JSX CODE:")
		console.log("========================================")
		console.log(result.jsx)
		console.log("========================================")
		console.log("[Figma Converter] END PARSED JSX CODE")
		console.log("========================================")

		console.log(`[Figma Converter] Success! Generated JSX with ${result.fields.length} fields`)

		return result
	} catch (error) {
		// Log full error details for debugging
		console.error("[Figma Converter] Error occurred:", {
			error,
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		})

		if (error instanceof FigmaConverterError) {
			throw error
		}

		throw new FigmaConverterError(
			`Failed to convert Figma design: ${error instanceof Error ? error.message : "Unknown error"}`,
			ErrorCode.AI_ERROR,
			{ originalError: error },
		)
	}
}

function parseAIResponse(content: string): ConversionResult {
	try {
		// Remove markdown code blocks if present
		let jsonContent = content.trim()

		if (jsonContent.startsWith("```json")) {
			jsonContent = jsonContent.replace(/^```json\n/, "").replace(/\n```$/, "")
		} else if (jsonContent.startsWith("```")) {
			jsonContent = jsonContent.replace(/^```\n/, "").replace(/\n```$/, "")
		}

		const parsed = JSON.parse(jsonContent)

		// Validate the structure
		if (!parsed.jsx || typeof parsed.jsx !== "string") {
			throw new Error("Missing or invalid 'jsx' field in AI response")
		}

		if (!Array.isArray(parsed.fields)) {
			throw new Error("Missing or invalid 'fields' array in AI response")
		}

		// Validate each field has required properties
		type ValidatedField = {
			name: string
			type: string
			selector: string
			defaultValue?: string
			placeholder?: string
		}

		const validatedFields = parsed.fields
			.map((field: unknown, idx: number): ValidatedField | null => {
				if (
					!field ||
					typeof field !== "object" ||
					!("name" in field) ||
					!("type" in field) ||
					!("selector" in field)
				) {
					console.warn(`Invalid field at index ${idx}, skipping:`, field)
					return null
				}

				return {
					name: String((field as { name: unknown }).name),
					type: String((field as { type: unknown }).type),
					selector: String((field as { selector: unknown }).selector),
					defaultValue:
						"defaultValue" in field
							? String((field as { defaultValue: unknown }).defaultValue)
							: undefined,
					placeholder:
						"placeholder" in field
							? String((field as { placeholder: unknown }).placeholder)
							: undefined,
				}
			})
			.filter((field: ValidatedField | null): field is ValidatedField => field !== null)

		return {
			jsx: parsed.jsx,
			fields: validatedFields,
			dimensions: parsed.dimensions || { width: "210mm", height: "297mm" },
			tailwindClasses: Array.isArray(parsed.tailwindClasses) ? parsed.tailwindClasses : [],
			warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
			errors: [],
		}
	} catch (error) {
		throw new FigmaConverterError(
			`Failed to parse AI response: ${error instanceof Error ? error.message : "Invalid JSON"}`,
			ErrorCode.PARSE_ERROR,
			{ content, error },
		)
	}
}
