import React from "react"
import { Form, Radio } from "antd"
import { TempJobOfferFormDataProps } from "@/components/Form/JobOfferFormTypes"
import { formTypeOptions } from "@/components/Form/formTypeOptions"

const FormType: React.FC<
	TempJobOfferFormDataProps & {
		setCurrentStep: React.Dispatch<React.SetStateAction<number>>
	}
> = ({ formData, setFormData, setCurrentStep }) => {
	return (
		<>
			<Form.Item
				label="نوع التعاقد"
				name="formType"
				className="grid min-h-[80vh] items-center"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Radio.Group
					value={formData.formType}
					buttonStyle="solid"
					optionType="button"
					className="grid! grid-cols-2 items-center gap-x-4 gap-y-4 text-center max-sm:grid-cols-1 [&_.eight-radio]:hidden! [&_.eight-radio-button-wrapper:not(:first-child)::before]:hidden!"
					size="large"
					options={formTypeOptions}
					onChange={(e) => {
						setFormData({
							...formData,
							formType: e.target.value,
						})
						// Move to the next step after selecting form type
						// Added timeout to let user see the selected type before moving
						setTimeout(() => setCurrentStep(1), 300)
					}}
				></Radio.Group>
			</Form.Item>
		</>
	)
}

export default FormType
