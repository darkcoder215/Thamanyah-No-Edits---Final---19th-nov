import { createClient } from "@supabase/supabase-js"
import { getAdvertisers, getPosts } from "@/components/manage-advertisers/lib/queries"

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function getInitialData() {
	const [postsResult, advertisersResult] = await Promise.all([
		getPosts(supabase),
		getAdvertisers(supabase),
	])

	if (postsResult.error || advertisersResult.error) {
		console.error(postsResult.error || advertisersResult.error)
		throw new Error("Error fetching data from Supabase")
	}

	return {
		posts:
			postsResult.data?.map((post) => ({
				id: post.id,
				postId: post.postId,
				title: post.title,
				productHandle: post.productHandle,
				productName: post.productName,
				advertiser_name: (post.advertisers as unknown as { name: string })?.name || "",
			})) || [],
		advertisers: advertisersResult.data || [],
	}
}
