import React, { useRef } from "react"
import { Button, Form, Input, type InputRef } from "antd"
import { TempJobOfferFormData } from "../Form/JobOfferFormTypes"

const ExpectationsField: React.FC<{
	formData: TempJobOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<TempJobOfferFormData>>
}> = ({ formData, setFormData }) => {
	const expectationRefs = useRef<(InputRef | null)[]>([])

	const handleExpectationChange = (index: number, value: string) => {
		const newExpectations = [...formData.expectations]
		newExpectations[index] = value
		setFormData({ ...formData, expectations: newExpectations })
	}

	const addExpectation = () => {
		setFormData({
			...formData,
			expectations: [...formData.expectations, ""],
		})
	}

	const removeExpectation = (index: number) => {
		const newExpectations = formData.expectations.filter((_, i) => i !== index)
		setFormData({ ...formData, expectations: newExpectations })
	}

	const onPaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
		event.preventDefault() // Prevent the default paste behavior
		const pastedData = event.clipboardData.getData("text") // Get the pasted text
		const newItems = pastedData.split("\n") // Split by new lines

		// Check if index is within bounds for the expectations/targets array
		const isValidIndex = index >= 0 && index < formData["expectations"]?.length

		if (!isValidIndex) {
			return // If the index is out of bounds, do nothing
		}

		// Update the form data with the new expectations or targets
		setFormData((prevFormData) => ({
			...prevFormData,
			["expectations"]: [
				...prevFormData["expectations"].slice(0, index),
				...newItems,
				...prevFormData["expectations"].slice(index + 1),
			],
		}))
	}

	return (
		<Form.Item label="المتوقعات">
			{formData.expectations.map((expectation, index) => (
				<div
					key={index}
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "8px",
					}}
				>
					<Input
						ref={(el) => {
							if (el) expectationRefs.current[index] = el
						}}
						value={expectation}
						onChange={(e) => handleExpectationChange(index, e.target.value)}
						onPaste={(e) => onPaste(e, index)}
						style={{ minWidth: "50%", flex: 1 }}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								addExpectation()
								setTimeout(() => {
									expectationRefs.current[index + 1]?.focus()
								}, 0)
							}
						}}
					/>
					<Button
						type="link"
						onClick={() => removeExpectation(index)}
						style={{ marginLeft: "8px" }}
					>
						حذف
					</Button>
				</div>
			))}
			<Button type="dashed" onClick={addExpectation}>
				+ إضافة
			</Button>
		</Form.Item>
	)
}
export default ExpectationsField
