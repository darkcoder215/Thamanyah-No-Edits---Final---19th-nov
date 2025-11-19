"use server"

import {
	BaseExternalAccountClient,
	Compute,
	Impersonated,
	JWT,
	UserRefreshClient,
} from "google-auth-library"
import { google, sheets_v4 } from "googleapis"

// Reusable authentication client
const convertSheetToObjects = (
	sheetData: sheets_v4.Schema$ValueRange,
): Record<string, string>[] => {
	const keys = sheetData?.values?.[0]
	const values = sheetData?.values?.slice(1)

	if (!keys || !values) return []

	return values.map((row) => {
		const obj: Record<string, string> = {}
		keys.forEach((key: string, index: number) => {
			obj[key] = row[index] || ""
		})
		return obj
	})
}

let authClient:
	| JWT
	| UserRefreshClient
	| BaseExternalAccountClient
	| Impersonated
	| Compute
	| null = null

async function getAuthClient() {
	if (!authClient) {
		authClient = await google.auth.getClient({
			projectId: process.env.PROJECT_ID,
			credentials: {
				type: process.env.TYPE,
				project_id: process.env.PROJECT_ID,
				private_key_id: process.env.PRIVATE_KEY_ID,
				private_key: process.env.PRIVATE_KEY,
				client_email: process.env.CLIENT_EMAIL,
				client_id: process.env.CLIENT_ID,
				universe_domain: "googleapis.com",
			},
			scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		})
	}
	return authClient
}

export type SpreadsheetData = Record<string, string>[]

export async function getSpreadsheetData(
	id: string,
	range: string,
): Promise<SpreadsheetData | null> {
	try {
		if (!id || !range) {
			throw new Error("Missing required parameters")
		}

		const auth = await getAuthClient()
		const sheets = google.sheets({ version: "v4", auth })

		const data = await sheets.spreadsheets.values.get({
			spreadsheetId: id,
			range: range,
		})

		if (!data.data.values) return null
		return convertSheetToObjects(data.data)
	} catch (error) {
		console.error("Error occurred:", error)
		throw new Error(error instanceof Error ? error.message : "Failed to fetch spreadsheet data")
	}
}
