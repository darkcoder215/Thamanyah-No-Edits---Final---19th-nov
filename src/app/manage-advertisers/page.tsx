import ManageAdvertisers from "../../components/manage-advertisers/ManageAdvertisers"
import { getInitialData } from "../../components/manage-advertisers/lib/api"
import { getSpreadsheetData } from "../actions/spreadsheet"

const id = process.env.NEXT_PUBLIC_POSTS_SPREADSHEET_ID
const range = process.env.NEXT_PUBLIC_POSTS_SHEET_RANGE

interface Post {
	postId: string
	title: string
	productHandle: string
	productName: string
	id?: string
	advertiser_name?: string
}

async function fetchExternalPosts(): Promise<Post[]> {
	if (!id || !range) {
		throw new Error("Missing spreadsheet configuration")
	}
	const data = await getSpreadsheetData(id, range)
	if (!data) return []

	return data.map((row) => ({
		postId: row.postId || "",
		title: row.title || "",
		advertiser_name: row.advertiser_name,
		productHandle: row.productHandle || "",
		productName: row.productName || "",
	}))
}

export default async function Page() {
	const [initialData, externalPosts] = await Promise.all([getInitialData(), fetchExternalPosts()])

	return (
		<ManageAdvertisers
			initialPosts={initialData.posts}
			initialAdvertisers={initialData.advertisers}
			externalPosts={externalPosts}
		/>
	)
}
