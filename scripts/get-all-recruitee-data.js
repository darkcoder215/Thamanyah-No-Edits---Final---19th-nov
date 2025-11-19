/*
 * full details: https://3.basecamp.com/4149173/buckets/22876953/todos/8755200123
 */
const axios = require("axios")
const fs = require("fs")

const COMPANY_ID = ""
const API_TOKEN = ""
const CA_LIMIT = 2
const BASE_URL = `https://api.recruitee.com/c/${COMPANY_ID}`
const DELAY_BETWEEN_CALLS = 300 // 300ms second delay between calls to avoid rate limiting
const MAX_RETRIES = 3

// store offers and stages
let offersMap = new Map()
let stagesMap = new Map()

// Utility function to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Utility function for API calls with retry logic
async function makeApiCall(url, options, retryCount = 0) {
	try {
		await delay(DELAY_BETWEEN_CALLS)
		const response = await axios(url, options)
		return response
	} catch (error) {
		if (
			retryCount < MAX_RETRIES &&
			(error.response?.status === 429 || error.response?.status === 503)
		) {
			const backoffDelay = Math.pow(2, retryCount) * 1000 // Exponential backoff
			console.log(`⚠️ Rate limited, retrying in ${backoffDelay}ms...`)
			await delay(backoffDelay)
			return makeApiCall(url, options, retryCount + 1)
		}
		throw error
	}
}

async function fetchAllOffers() {
	try {
		const res = await makeApiCall(`${BASE_URL}/offers`, {
			headers: { Authorization: `Bearer ${API_TOKEN}` },
		})
		const offers = res.data.offers || []

		// save candidates data
		offers.forEach((offer) => {
			if (offer.candidates_count > 0) {
				offersMap.set(offer.id, {
					title: offer.title,
					department: offer.department,
					location: offer.location,
					created_at: offer.created_at,
					pipeline_template_id: offer.pipeline_template_id,
				})
			}
		})

		console.log(`✅ Fetched ${offers.length} offers`)
		return offers
	} catch (error) {
		console.error("❌ Error fetching offers:", error.response?.data || error.message)
		return []
	}
}

async function fetchAllPipelineTemplates() {
	try {
		// Get unique pipeline template IDs from offers
		const templateIds = [
			...new Set(
				[...offersMap.values()]
					.map((offer) => offer.pipeline_template_id)
					.filter((id) => id),
			),
		]

		if (templateIds.length === 0) {
			console.warn("⚠️ No pipeline templates found in offers")
			return
		}

		// Get the first offer ID that has a pipeline template
		const firstOfferWithTemplate = [...offersMap.entries()].find(
			([, offer]) => offer.pipeline_template_id,
		)

		if (!firstOfferWithTemplate) {
			console.warn("⚠️ No offers with pipeline templates found")
			return
		}

		const [offerId] = firstOfferWithTemplate

		// Fetch all pipeline templates in parallel with delay between batches
		const batchSize = 5 // Process 5 templates at a time
		for (let i = 0; i < templateIds.length; i += batchSize) {
			const batch = templateIds.slice(i, i + batchSize)
			const templatePromises = batch.map((templateId) =>
				makeApiCall(`${BASE_URL}/offers/${offerId}/pipeline_templates/${templateId}`, {
					headers: { Authorization: `Bearer ${API_TOKEN}` },
				}),
			)

			const responses = await Promise.all(templatePromises)

			// Process all templates in the batch
			responses.forEach((res) => {
				if (res.data?.pipeline_template?.stages) {
					res.data.pipeline_template.stages.forEach((stage) => {
						if (!stagesMap.has(stage.id)) {
							stagesMap.set(stage.id, stage.name)
						}
					})
				}
			})

			console.log(
				`✅ Processed batch ${i / batchSize + 1} of ${Math.ceil(templateIds.length / batchSize)}`,
			)
		}

		console.log(
			`✅ Fetched ${stagesMap.size} unique pipeline stages from ${templateIds.length} templates`,
		)
	} catch (error) {
		console.error("❌ Error fetching pipeline templates:", error.message)
	}
}

async function fetchAllCandidates() {
	try {
		const res = await makeApiCall(`${BASE_URL}/candidates`, {
			headers: { Authorization: `Bearer ${API_TOKEN}` },
			params: { limit: CA_LIMIT },
		})
		const candidates = res.data.candidates || []

		// نربط كل مرشح بتفاصيل العرض
		return candidates.map((candidate) => {
			const offerDetails = offersMap.get(candidate.offer_id) || {}
			return {
				...candidate,
				offer_title: offerDetails.title || "",
				offer_department: offerDetails.department || "",
				offer_location: offerDetails.location || "",
				offer_created_at: offerDetails.created_at || "",
			}
		})
	} catch (error) {
		console.error("❌ Error fetching candidates:", error.message)
		return []
	}
}

async function fetchCandidateDetails(id) {
	try {
		const res = await makeApiCall(`${BASE_URL}/candidates/${id}`, {
			headers: { Authorization: `Bearer ${API_TOKEN}` },
		})
		const c = res.data.candidate
		const socialLinks = c.social_links || []
		const placement = c.placements?.[0] || {}
		const offerDetails = offersMap.get(placement.offer_id) || {}
		const stageName = stagesMap.get(placement.stage_id) || ""

		return {
			id: c.id,
			name: c.name,
			email: c.emails?.[0] || "",
			phone: c.phones?.[0] || "",
			linkedin: socialLinks.find((l) => l.includes("linkedin.com")) || "",
			behance:
				socialLinks.find((l) => l.includes("behance.net") || l.includes("portfolio")) || "",
			github: socialLinks.find((l) => l.includes("github.com")) || "",
			twitter:
				socialLinks.find((l) => l.includes("twitter.com") || l.includes("x.com")) || "",
			facebook: socialLinks.find((l) => l.includes("facebook.com")) || "",
			instagram: socialLinks.find((l) => l.includes("instagram.com")) || "",
			website:
				socialLinks.find(
					(link) =>
						!link.includes("linkedin.com") &&
						!link.includes("github.com") &&
						!link.includes("twitter.com") &&
						!link.includes("x.com") &&
						!link.includes("facebook.com") &&
						!link.includes("instagram.com") &&
						!link.includes("behance.net"),
				) || "",
			offer_id: placement.offer_id || "",
			offer_title: offerDetails.title || "",
			offer_department: offerDetails.department || "",
			offer_location: offerDetails.location || "",
			offer_created_at: offerDetails.created_at || "",
			department_name: placement.department_name || "",
			stage_id: placement.stage_id || "",
			stage_name: stageName,
			referrer: c.referrer || "",
			created_at: c.created_at,
		}
	} catch (error) {
		console.warn(`⚠️ Error fetching candidate ${id}:`, error.message)
		return null
	}
}

function escapeCsv(value) {
	if (!value) return ""
	const str = value.toString().replace(/"/g, '""')
	return `"${str}"`
}

async function main() {
	await fetchAllOffers()
	await fetchAllPipelineTemplates()
	console.log(`✅ Fetched ${stagesMap.size} pipeline stages`)

	const candidates = await fetchAllCandidates()
	console.log(`✅ Fetched ${candidates.length} candidates`)

	const fullDetails = []

	for (const candidate of candidates) {
		const details = await fetchCandidateDetails(candidate.id)
		if (details) {
			fullDetails.push(details)
			console.log(`✅ Processed: ${details.name}`)
		}
	}

	const headers = [
		"id",
		"name",
		"email",
		"phone",
		"linkedin",
		"behance",
		"github",
		"twitter",
		"facebook",
		"instagram",
		"website",
		"offer_id",
		"offer_title",
		"offer_department",
		"offer_location",
		"offer_created_at",
		"department_name",
		"stage_id",
		"stage_name",
		"referrer",
		"created_at",
	]

	const rows = fullDetails.map((item) => headers.map((key) => escapeCsv(item[key])).join(","))
	const csvContent = [headers.join(","), ...rows].join("\n")

	fs.writeFileSync("candidates_detailed.csv", csvContent, "utf-8")
	fs.writeFileSync("candidates_detailed.json", JSON.stringify(fullDetails, null, 2), "utf-8")

	console.log(`📄 Saved ${fullDetails.length} candidates to CSV and JSON`)
}

main().catch(console.error)
