import React, { useRef } from "react"
import { Button, Form, Input, type InputRef } from "antd"
import { type JobOfferFormData } from "./JobOfferFormTypes"

const ExpectationsAndTargets: React.FC<{
	formData: JobOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<JobOfferFormData>>
}> = ({ formData, setFormData }) => {
	const expectationRefs = useRef<(InputRef | null)[]>([])
	const targetRefs = useRef<(InputRef | null)[]>([])

	const handleExpectationChange = (index: number, value: string) => {
		const newExpectations = [...formData.expectations]
		newExpectations[index] = value
		setFormData({ ...formData, expectations: newExpectations })
	}

	const handleTargetChange = (index: number, value: string) => {
		const newTargets = [...formData.targets]
		newTargets[index] = value
		setFormData({ ...formData, targets: newTargets })
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

	const addTarget = () => {
		setFormData({ ...formData, targets: [...formData.targets, ""] })
	}

	const removeTarget = (index: number) => {
		const newTargets = formData.targets.filter((_, i) => i !== index)
		setFormData({ ...formData, targets: newTargets })
	}

	const onPaste = (
		event: React.ClipboardEvent<HTMLInputElement>,
		index: number,
		inputName: "expectations" | "targets",
	) => {
		event.preventDefault() // Prevent the default paste behavior
		const pastedData = event.clipboardData.getData("text") // Get the pasted text
		const newItems = pastedData.split("\n") // Split by new lines

		// Check if index is within bounds for the expectations/targets array
		const isValidIndex = index >= 0 && index < formData[inputName]?.length

		if (!isValidIndex) {
			return // If the index is out of bounds, do nothing
		}

		// Update the form data with the new expectations or targets
		setFormData((prevFormData) => ({
			...prevFormData,
			[inputName]: [
				...prevFormData[inputName].slice(0, index),
				...newItems,
				...prevFormData[inputName].slice(index + 1),
			],
		}))
	}

	return (
		<>
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
							onPaste={(e) => onPaste(e, index, "expectations")}
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
			<Form.Item label="المستهدفات">
				{formData.targets.map((target, index) => (
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
								if (el) targetRefs.current[index] = el
							}}
							value={target}
							onChange={(e) => handleTargetChange(index, e.target.value)}
							onPaste={(e) => onPaste(e, index, "targets")}
							style={{ minWidth: "50%", flex: 1 }}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									addTarget()
									setTimeout(() => {
										targetRefs.current[index + 1]?.focus()
									}, 0)
								}
							}}
						/>
						<Button
							type="link"
							onClick={() => removeTarget(index)}
							style={{ marginLeft: "8px" }}
						>
							حذف
						</Button>
					</div>
				))}
				<Button type="dashed" onClick={addTarget}>
					+ إضافة
				</Button>
			</Form.Item>
		</>
	)
}
export default ExpectationsAndTargets
