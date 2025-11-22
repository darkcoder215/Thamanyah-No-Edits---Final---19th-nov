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

		// Prepare messages
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

		// Call OpenRouter API with timeout
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
					"X-Title": "Thmanyah Figma Converter",
				},
				body: JSON.stringify({
					model: "anthropic/claude-sonnet-4.5",
					messages,
					temperature: 0.3,
					max_tokens: 4000,
					// Force JSON output for structured responses
					response_format: { type: "json_object" },
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
			throw err
		} finally {
			clearTimeout(timeoutId)
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new FigmaConverterError(
				`OpenRouter API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`,
				ErrorCode.AI_ERROR,
				errorData,
			)
		}

		const data = await response.json()
		const content = data.choices?.[0]?.message?.content

		if (!content) {
			throw new FigmaConverterError("No content received from AI", ErrorCode.AI_ERROR)
		}

		// Parse the AI response
		const result = parseAIResponse(content)

		return result
	} catch (error) {
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
