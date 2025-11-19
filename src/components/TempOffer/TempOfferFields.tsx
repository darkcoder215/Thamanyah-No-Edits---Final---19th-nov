import React from "react"
import { Form, Input } from "antd"
import { TempJobOfferFormDataProps } from "../Form/JobOfferFormTypes"

const TempOfferFields: React.FC<TempJobOfferFormDataProps> = ({ formData, setFormData }) => {
	return (
		<>
			<Form.Item
				label="الاسم"
				name="name"
				initialValue={formData.name}
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					placeholder="سارة علان"
					onChange={(e) =>
						setFormData({
							...formData,
							name: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="مستلمو البريد"
				name="email"
				className="mb-10!"
				initialValue={formData.email}
				rules={[
					{
						required: false,
						message: "يرجى إدخال بريد إلكتروني صحيح.",
						validator: (_, value: string) => {
							const emails = value.split(",").map((email) => email.trim())
							const isValid = emails.every((email: string) =>
								/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
							)
							return !emails || isValid // make it required
								? Promise.resolve()
								: Promise.reject(new Error("يرجى إدخال بريد إلكتروني صحيح."))
						},
					},
				]}
				tooltip={{
					title: "كل بريد يُكتب هنا ستصله نسخة من الملف النهائي عند إرساله.",
					placement: "top",
				}}
				help={"يمكنك إضافة بريد إلكتروني واحد أو أكثر عن طريق إضافة فاصلة (,) بين كل بريد."}
			>
				<Input
					type="email"
					placeholder="mail@me.com"
					onChange={(e) =>
						setFormData({
							...formData,
							email: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المسمى الوظيفي"
				name="jobTitle"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.jobTitle}
					placeholder="منتجة متدربة | Production Intern"
					onChange={(e) =>
						setFormData({
							...formData,
							jobTitle: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المدير المباشر"
				name="directManager"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.directManager}
					placeholder="ميسم"
					onChange={(e) =>
						setFormData({
							...formData,
							directManager: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="مدة التعاقد"
				name="duration"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.duration}
					placeholder="3 أشهر"
					onChange={(e) =>
						setFormData({
							...formData,
							duration: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="اسم الطرف الثاني"
				name="recruiter"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.recruiter}
					placeholder="عبدالقدوس الحاج حسين"
					onChange={(e) =>
						setFormData({
							...formData,
							recruiter: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المسمى الوظيفي للطرف الثاني"
				name="recruiterJobTitle"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.recruiterJobTitle}
					placeholder="نائب الرئيس للموارد البشرية"
					onChange={(e) =>
						setFormData({
							...formData,
							recruiterJobTitle: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="القسم"
				name="department"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.department}
					placeholder="الإنتاج"
					onChange={(e) =>
						setFormData({
							...formData,
							department: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="الفريق"
				name="team"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.team}
					placeholder="المرئي"
					onChange={(e) =>
						setFormData({
							...formData,
							team: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المقابل الشهري"
				name="netSalary"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.netSalary}
					type="number"
					placeholder="المقابل الشهري"
					onChange={(e) =>
						setFormData({
							...formData,
							netSalary: parseInt(e.target.value),
						})
					}
				/>
			</Form.Item>
		</>
	)
}

export default TempOfferFields
