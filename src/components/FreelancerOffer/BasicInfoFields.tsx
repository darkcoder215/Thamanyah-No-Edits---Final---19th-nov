import React from "react"
import { Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select } from "antd"
import { FreelancerOfferFormProps } from "../Form/JobOfferFormTypes"

const BasicInfoFields: React.FC<FreelancerOfferFormProps> = ({ formData, setFormData }) => {
	return (
		<>
			<Form.Item label="الاسم" name="name" rules={[{ required: true }]}>
				<Input
					placeholder="محمد أحمد"
					value={formData.name}
					onChange={(e) =>
						setFormData({
							...formData,
							name: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="الجنس" name="gender" rules={[{ required: true }]}>
				<Radio.Group
					value={formData.gender}
					onChange={(e) =>
						setFormData({
							...formData,
							gender: e.target.value,
						})
					}
					options={[
						{ label: "ذكر", value: "male" },
						{ label: "أنثى", value: "female" },
					]}
				/>
			</Form.Item>

			<Form.Item
				label="البريد الإلكتروني"
				name="email"
				rules={[
					{
						required: true,
						type: "email",
						message: "يرجى إدخال بريد إلكتروني صحيح",
					},
				]}
			>
				<Input
					placeholder="example@thmanyah.com"
					value={formData.email}
					onChange={(e) =>
						setFormData({
							...formData,
							email: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="المسمى الوظيفي" name="jobTitle" rules={[{ required: true }]}>
				<Input
					placeholder="مطور برمجيات"
					value={formData.jobTitle}
					onChange={(e) =>
						setFormData({
							...formData,
							jobTitle: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="رقم الهوية" name="nationalNumber" rules={[{ required: true }]}>
				<Input
					placeholder="2553451233"
					value={formData.nationalNumber}
					onChange={(e) =>
						setFormData({
							...formData,
							nationalNumber: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="اسم المشروع" name="projectName" rules={[{ required: true }]}>
				<Input
					placeholder="مشروع الموقع"
					value={formData.projectName}
					onChange={(e) =>
						setFormData({
							...formData,
							projectName: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="رقم الجوال" name="phoneNumber" rules={[{ required: true }]}>
				<Input
					placeholder="+966555555555"
					value={formData.phoneNumber}
					onChange={(e) =>
						setFormData({
							...formData,
							phoneNumber: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="اسم المدير" name="managerName" rules={[{ required: true }]}>
				<Input
					placeholder="عبدالله محمد"
					value={formData.managerName}
					onChange={(e) =>
						setFormData({
							...formData,
							managerName: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="جنس المدير" name="managerGender" rules={[{ required: true }]}>
				<Radio.Group
					value={formData.managerGender}
					onChange={(e) =>
						setFormData({
							...formData,
							managerGender: e.target.value,
						})
					}
					options={[
						{ label: "ذكر", value: "male" },
						{ label: "أنثى", value: "female" },
					]}
				/>
			</Form.Item>

			<Form.Item
				label="المسمى الوظيفي للمدير"
				name="managerJobTitle"
				rules={[{ required: true }]}
			>
				<Input
					placeholder="مدير المشروع"
					value={formData.managerJobTitle}
					onChange={(e) =>
						setFormData({
							...formData,
							managerJobTitle: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item
				label="البريد الإلكتروني للمدير"
				name="managerEmail"
				rules={[
					{
						required: true,
						type: "email",
						message: "يرجى إدخال بريد إلكتروني صحيح",
					},
				]}
			>
				<Input
					placeholder="manager@thmanyah.com"
					value={formData.managerEmail}
					onChange={(e) =>
						setFormData({
							...formData,
							managerEmail: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item
				label="تاريخ العقد"
				name="agreementDate"
				rules={[{ required: true, message: "يرجى اختيار تاريخ العقد" }]}
			>
				<DatePicker
					placeholder="اختر التاريخ"
					className="w-full!"
					format="YYYY-MM-DD"
					value={formData.agreementDate ? formData.agreementDate : undefined}
					onChange={(date) => {
						setFormData({
							...formData,
							agreementDate: date,
						})
					}}
				/>
			</Form.Item>

			<Form.Item
				label="تاريخ البدء"
				name="startDate"
				rules={[{ required: true, message: "يرجى اختيار تاريخ البدء" }]}
			>
				<DatePicker
					placeholder="اختر التاريخ"
					className="w-full!"
					format="YYYY-MM-DD"
					value={formData.startDate ? formData.startDate : undefined}
					onChange={(date) => {
						setFormData({
							...formData,
							startDate: date,
						})
					}}
				/>
			</Form.Item>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label="مدة العقد"
						name="contractDuration"
						rules={[{ required: true }]}
					>
						<Select
							value={formData.contractDuration}
							onChange={(value) =>
								setFormData({
									...formData,
									contractDuration: value,
								})
							}
							options={[
								{ label: "شهر", value: "1" },
								{ label: "شهرين", value: "2" },
								{ label: "3 أشهر", value: "3" },
								{ label: "4 أشهر", value: "4" },
								{ label: "5 أشهر", value: "5" },
								{ label: "6 أشهر", value: "6" },
								{ label: "7 أشهر", value: "7" },
								{ label: "8 أشهر", value: "8" },
								{ label: "9 أشهر", value: "9" },
								{ label: "10 أشهر", value: "10" },
								{ label: "11 شهر", value: "11" },
								{ label: "سنة", value: "12" },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="عدد الساعات في اليوم"
						name="dailyHours"
						rules={[
							{
								required: true,
								message: "الرجاء إدخال عدد الساعات",
							},
							{
								type: "number",
								min: 1,
								max: 24,
								message: "عدد الساعات يجب أن يكون بين 1 و 24",
							},
						]}
					>
						<InputNumber
							min={1}
							max={24}
							step={1}
							placeholder="8"
							value={formData.dailyHours}
							onChange={(value) =>
								setFormData({
									...formData,
									dailyHours: value ?? 0,
								})
							}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item label="نوع الدوام" name="workType" rules={[{ required: true }]}>
				<Radio.Group
					value={formData.workType}
					onChange={(e) =>
						setFormData({
							...formData,
							workType: e.target.value,
						})
					}
					options={[
						{ label: "دوام كامل", value: "full" },
						{ label: "دوام جزئي", value: "part" },
					]}
				/>
			</Form.Item>
		</>
	)
}

export default BasicInfoFields
