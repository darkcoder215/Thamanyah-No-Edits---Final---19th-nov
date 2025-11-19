import { AutoComplete, Form, FormInstance, Select } from "antd"
import { Advertiser, Post } from "./lib/types"

interface AdvertiserFormProps {
	setSelectedAdvertiser: (value: string | null) => void
	setSelectedPost: (value: string[]) => void
	advertisers: Advertiser[]
	externalPosts: Post[]
	form: FormInstance<unknown> // Add form prop
}

export function AdvertiserForm({
	setSelectedAdvertiser,
	setSelectedPost,
	advertisers,
	externalPosts,
	form,
}: AdvertiserFormProps) {
	return (
		<Form layout="vertical" form={form}>
			<Form.Item label="اسم المعلن" name="advertiser">
				<AutoComplete
					style={{ width: "100%" }}
					placeholder="اختر أو أدخل اسم المعلن..."
					allowClear
					onChange={(value) => setSelectedAdvertiser(value || null)}
					onSelect={(value) => setSelectedAdvertiser(value || null)}
					options={advertisers.map((advertiser) => ({
						label: advertiser.name,
						value: advertiser.name,
					}))}
					filterOption={(input, option) => (option?.label ?? "").includes(input)}
					optionFilterProp="label"
				/>
			</Form.Item>

			<Form.Item label="المنشورات" name="post">
				<Select
					showSearch
					mode="multiple" // Added multiple selection
					style={{ width: "100%" }}
					placeholder="اختر المنشورات..."
					onChange={setSelectedPost}
					options={externalPosts.map((post) => ({
						value: post.postId,
						label: post.title,
					}))}
					optionFilterProp="label"
				/>
			</Form.Item>
		</Form>
	)
}
