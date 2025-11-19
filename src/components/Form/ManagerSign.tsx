import React, { useState } from "react"
import { Checkbox, Form, Select } from "antd"
import { JobOfferFormData } from "./JobOfferFormTypes"

interface ManagerSignProps {
	formData: JobOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<JobOfferFormData>>
}

export const managers = [
	{ value: "عبدالرحمن أبومالح", label: "عبدالرحمن أبومالح", jobTitle: "الرئيس التنفيذي" },
	{ value: "ياسر الأحمد", label: "ياسر الأحمد", jobTitle: "الرئيس التنفيذي للمالية" },
	{ value: "أسيل باعبدالله", label: "أسيل باعبدالله", jobTitle: "الرئيسة التنفيذية للإنتاج" },
	{ value: "فيصل الغامدي", label: "فيصل الغامدي", jobTitle: "الرئيس التنفيذي للأعمال" },
	{ value: "علي بوصالح", label: "علي بوصالح", jobTitle: "الرئيس التنفيذي للتقنية" },
	{
		value: "البراء العوهلي",
		label: "البراء العوهلي",
		jobTitle: "الرئيس التنفيذي لثقافة المنظومة",
	},
	{
		value: "معاذ الحربي",
		label: "معاذ الحربي",
		jobTitle: "الرئيس التنفيذي للتصميم",
	},
	{
		value: "إبراهيم القرعاوي",
		label: "إبراهيم القرعاوي",
		jobTitle: "الرئيس التنفيذي للتسويق",
	},
	{
		value: "أنس الأهدل",
		label: "أنس الأهدل",
		jobTitle: "نائب رئيس النمو والنشر",
	},
	{
		value: "عبدالقدوس الحاج حسين",
		label: "عبدالقدوس الحاج حسين",
		jobTitle: "نائب الرئيس للموارد البشرية",
	},
	{
		value: "رامي القاضي",
		label: "رامي القاضي",
		jobTitle: "نائب الرئيس للإنتاج المباشر",
	},
]

export default function ManagerSign({ formData, setFormData }: ManagerSignProps) {
	const [showManagerSelect, setShowManagerSelect] = useState(false)

	return (
		<>
			<Form.Item name="signByBoss" valuePropName="checked" className="mb-2!">
				<Checkbox
					onChange={(e) => {
						if (!e.target.checked) {
							setFormData({
								...formData,
								managerSignName: "",
							})
						}
						setShowManagerSelect(e.target.checked)
					}}
				>
					التوقيع من قبل تنفيذي القسم؟
				</Checkbox>
			</Form.Item>

			{showManagerSelect && (
				<Form.Item
					label="اختر المدير"
					name="managerSignName"
					rules={[
						{
							required: true,
							message: "الرجاء اختيار المدير",
						},
					]}
				>
					<Select
						placeholder="اختر المدير"
						options={managers}
						onChange={(value) =>
							setFormData({
								...formData,
								managerSignName: value,
							})
						}
					/>
				</Form.Item>
			)}
		</>
	)
}
