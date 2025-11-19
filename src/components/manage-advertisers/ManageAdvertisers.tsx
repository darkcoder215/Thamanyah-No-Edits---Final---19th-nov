"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { revalidateAdvertisers } from "@/app/actions"
import { PlusOutlined } from "@ant-design/icons"
import { DeleteOutlined } from "@ant-design/icons"
import { createBrowserClient } from "@supabase/ssr"
// Add List to the antd imports
import { Button, Form, List, Modal, Space, Table, Typography, message } from "antd"
import { getPosts } from "@/components/manage-advertisers/lib/queries"
import { AdvertiserForm } from "./AdvertiserForm"

// Add this import at the top
const { Title } = Typography

interface Post {
	postId: string
	title: string
	productHandle: string
	productName: string
	id?: string
	advertiser_name?: string
}

interface Advertiser {
	id: string
	name: string
}

interface Props {
	initialPosts: Post[]
	initialAdvertisers: Advertiser[]
	externalPosts: Post[]
}

// Add this interface for grouped data
interface GroupedPost {
	advertiser_name: string
	posts: {
		postId: string
		title: string
		productName: string
		productHandle: string
		id?: string
	}[]
	postsCount: number
}

// Add Form to the antd imports

export default function ManageAdvertisers({
	initialPosts,
	initialAdvertisers,
	externalPosts,
}: Props) {
	const [posts, setPosts] = useState<Post[]>(initialPosts)
	const advertisers = initialAdvertisers
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedAdvertiser, setSelectedAdvertiser] = useState<string | null>(null)
	const [modal, contextHolder1] = Modal.useModal()

	const [form] = Form.useForm()
	const [selectedPost, setSelectedPost] = useState<string[]>([])
	const [messageApi, contextHolder] = message.useMessage()

	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	)

	async function handleRelatePosts() {
		try {
			const advertiser = advertisers.find((a) => a.name === selectedAdvertiser)

			let advertiserId
			if (advertiser?.id) {
				// set it
				advertiserId = advertiser.id
			} else {
				// If advertiser doesn't exists, create new one
				const { data: newAdvertiser, error: advertiserError } = await supabase
					.from("advertisers")
					.insert({ name: selectedAdvertiser })
					.select("id")
					.single()

				if (advertiserError) throw advertiserError
				advertiserId = newAdvertiser.id
			}

			if (!advertiserId) return messageApi.error("فشل في ربط المعلن بالمنشور")

			// Find all selected external posts
			const selectedExternalPosts = externalPosts.filter((p) =>
				selectedPost.includes(p.postId),
			)

			// Insert all selected posts
			const { error } = await supabase.from("posts").insert(
				selectedExternalPosts.map((post) => ({
					postId: post.postId,
					title: post.title,
					productHandle: post.productHandle,
					productName: post.productName,
					advertiserId: advertiserId,
				})),
			)

			if (error) throw error

			// Refresh posts table
			const { data, error: fetchError } = await getPosts(supabase)
			if (fetchError) throw fetchError

			setPosts(
				data?.map((post) => ({
					postId: post.postId,
					title: post.title,
					productHandle: post.productHandle,
					productName: post.productName,
					advertiser_name: (post.advertisers as unknown as { name: string })?.name || "",
				})) || [],
			)

			// Add this line to revalidate the cache
			await revalidateAdvertisers()

			messageApi.success("تم ربط المعلن بالمنشورات بنجاح")
			setIsModalOpen(false)
			setSelectedAdvertiser("")
			setSelectedPost([]) // Reset to empty array
			form.resetFields() // Reset the form
		} catch (error) {
			console.error("Error linking advertiser:", error)
			messageApi.error("فشل في ربط المعلن بالمنشورات")
		}
	}

	// Update Select options to only show external posts
	async function handleDeleteRelation(id: string) {
		try {
			const { error } = await supabase.from("posts").delete().eq("id", id)

			if (error) throw error

			// Refresh posts table
			const { data, error: fetchError } = await getPosts(supabase)
			if (fetchError) throw fetchError

			setPosts(
				data?.map((post) => ({
					id: post.id,
					postId: post.postId,
					title: post.title,
					productHandle: post.productHandle,
					productName: post.productName,
					advertiser_name: (post.advertisers as unknown as { name: string })?.name || "",
				})) || [],
			)

			await revalidateAdvertisers()
			messageApi.success("تم الحذف")
		} catch (error) {
			console.error("Error deleting connection:", error)
			messageApi.error("عذرًا, حدث خطأ أثناء الحذف")
		}
	}

	// Group posts by advertiser
	const groupedPosts = posts.reduce((acc: GroupedPost[], post) => {
		if (!post.advertiser_name) return acc

		const existingGroup = acc.find((g) => g.advertiser_name === post.advertiser_name)
		if (existingGroup) {
			existingGroup.posts.push({
				postId: post.postId,
				title: post.title,
				productHandle: post.productHandle,
				productName: post.productName,
				id: post.id!, // Include id
			})
			existingGroup.postsCount = existingGroup.posts.length
		} else {
			acc.push({
				advertiser_name: post.advertiser_name,
				posts: [
					{
						postId: post.postId,
						title: post.title,
						productHandle: post.productHandle,
						productName: post.productName,
						id: post.id!, // Include id
					},
				],
				postsCount: 1,
			})
		}
		return acc
	}, [])

	const columns = [
		{
			title: "المعلن",
			dataIndex: "advertiser_name",
			key: "advertiser_name",
		},
		{
			title: "عدد المنشورات",
			dataIndex: "postsCount",
			key: "postsCount",
		},
	]

	// Update the List renderItem to use id for deletion
	const expandedRowRender = (record: GroupedPost) => (
		<List
			style={{ padding: "0 20px" }}
			dataSource={record.posts}
			renderItem={(post) => (
				<List.Item
					key={post.postId}
					actions={[
						<Button
							key="delete"
							type="text"
							danger
							icon={<DeleteOutlined />}
							onClick={() => {
								const postTitle = posts.find((p) => p.id === post.id)?.title || ""
								modal.confirm({
									title: `هل أنت متأكد من حذف ربط ${postTitle}؟`,
									okText: "نعم",
									okType: "danger",
									cancelText: "لا",
									onOk: async () => await handleDeleteRelation(post.id!),
								})
							}}
						/>,
					]}
				>
					<span>{post.title}</span>
					<Link href={`https://thmanyah.com/@${post.productHandle}`} target="_blank">
						{post.productName}
					</Link>
				</List.Item>
			)}
		/>
	)
	const availableExternalPosts = useMemo(() => {
		const connectedPostIds = posts.map((post) => post.postId)
		return externalPosts.filter((post) => !connectedPostIds.includes(post.postId))
	}, [externalPosts, posts])

	return (
		<>
			{contextHolder1}
			{contextHolder}
			<div className="mx-auto flex min-h-screen w-[800px] max-w-full items-center p-10">
				<Space direction="vertical" size="large" style={{ width: "100%" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Title level={3}>إدارة المعلنين</Title>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => setIsModalOpen(true)}
						>
							إضافة
						</Button>
					</div>

					<Table
						columns={columns}
						expandable={{
							expandedRowRender,
							rowExpandable: (record) => record.postsCount > 0,
						}}
						dataSource={groupedPosts}
						rowKey="advertiser_name"
					/>

					<Modal
						// title="ربط معلن بمنشور"
						open={isModalOpen}
						onOk={handleRelatePosts}
						onCancel={() => {
							setIsModalOpen(false)
							form.resetFields() // Also reset when canceling
						}}
						okText="ربط"
						cancelText="إلغاء"
						okButtonProps={{
							disabled: !selectedPost || !selectedAdvertiser,
						}}
						forceRender
					>
						<AdvertiserForm
							setSelectedAdvertiser={setSelectedAdvertiser}
							setSelectedPost={setSelectedPost}
							advertisers={advertisers}
							externalPosts={availableExternalPosts}
							form={form} // Pass form instance
						/>
					</Modal>
				</Space>
			</div>
		</>
	)
}
