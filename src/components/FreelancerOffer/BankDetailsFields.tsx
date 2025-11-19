import React from "react"
import { Form, Input, InputNumber } from "antd"
import { FreelancerOfferFormProps } from "../Form/JobOfferFormTypes"

const BankDetailsFields: React.FC<FreelancerOfferFormProps> = ({ formData, setFormData }) => {
	return (
		<>
			<Form.Item label="اسم البنك" name="bankName" rules={[{ required: true }]}>
				<Input
					placeholder="البنك الأهلي السعودي"
					value={formData.bankName}
					onChange={(e) =>
						setFormData({
							...formData,
							bankName: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item
				label="اسم صاحب الحساب"
				name="accountHolderName"
				rules={[{ required: true }]}
			>
				<Input
					placeholder="محمد أحمد"
					value={formData.accountHolderName}
					onChange={(e) =>
						setFormData({
							...formData,
							accountHolderName: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="رقم الحساب" name="iban" rules={[{ required: true }]}>
				<Input
					placeholder="SA12 3456 7890 1234 5678 9012"
					value={formData.iban}
					onChange={(e) =>
						setFormData({
							...formData,
							iban: e.target.value,
						})
					}
				/>
			</Form.Item>

			<Form.Item label="المقابل المالي" name="salary" rules={[{ required: true }]}>
				<InputNumber
					min={1}
					step={1}
					className="w-full!"
					placeholder="5000"
					value={formData.salary}
					onChange={(value) =>
						setFormData({
							...formData,
							salary: value || 0,
						})
					}
				/>
			</Form.Item>
		</>
	)
}

export default BankDetailsFields
