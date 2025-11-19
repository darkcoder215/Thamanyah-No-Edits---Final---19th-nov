"use server"

import { revalidatePath } from "next/cache"

export async function revalidateAdvertisers() {
	revalidatePath("/manage-advertisers")
}
