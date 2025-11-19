import { type SupabaseClient } from "@supabase/supabase-js"

export const getPosts = (supabase: SupabaseClient) =>
	supabase
		.from("posts")
		.select(
			`
      id,
      postId,
      title,
      productHandle,
      productName,
      advertisers (id, name)
    `,
		)
		.order("title")

export const getAdvertisers = (supabase: SupabaseClient) =>
	supabase.from("advertisers").select("id, name").order("name")
