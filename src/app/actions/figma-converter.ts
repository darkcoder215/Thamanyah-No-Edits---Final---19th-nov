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

		// Call OpenRouter API
		const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
			}),
		})

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

		return {
			jsx: parsed.jsx,
			fields: parsed.fields || [],
			dimensions: parsed.dimensions || { width: "210mm", height: "297mm" },
			tailwindClasses: parsed.tailwindClasses || [],
			warnings: parsed.warnings || [],
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
