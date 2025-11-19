import React, { useRef } from "react"
import { Button, Form, Input, type InputRef } from "antd"
import { FreelancerOfferFormProps } from "../Form/JobOfferFormTypes"

const DutiesField: React.FC<FreelancerOfferFormProps> = ({ formData, setFormData }) => {
	const dutyRefs = useRef<(InputRef | null)[]>([])

	const handleDutyChange = (index: number, value: string) => {
		const newDuties = [...formData.duties]
		newDuties[index] = value
		setFormData({ ...formData, duties: newDuties })
	}

	const addDuty = () => {
		setFormData({
			...formData,
			duties: [...formData.duties, ""],
		})
		setTimeout(() => {
			const lastIndex = formData.duties.length
			dutyRefs.current[lastIndex]?.focus()
		}, 0)
	}

	const removeDuty = (index: number) => {
		const newDuties = formData.duties.filter((_, i) => i !== index)
		setFormData({ ...formData, duties: newDuties })
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			addDuty()
		}
	}

	return (
		<>
			<Form.Item label="المهام المطلوبة" required>
				{formData.duties.map((duty, index) => (
					<div key={index} className="mb-2 flex gap-2">
						<Input
							ref={(el) => {
								dutyRefs.current[index] = el
							}}
							value={duty}
							onChange={(e) => handleDutyChange(index, e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="أدخل المهمة"
						/>
						<Button type="text" onClick={() => removeDuty(index)}>
							✕
						</Button>
					</div>
				))}
				<Button type="dashed" onClick={addDuty} block>
					+ إضافة مهمة
				</Button>
			</Form.Item>
		</>
	)
}

export default DutiesField
