"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Form, Steps } from "antd"
import { useForm } from "antd/es/form/Form"
import ExportImportBtn from "../Form/ExportImportBtn"
import FormType from "../Form/FormType"
import { TempJobOfferFormData } from "../Form/JobOfferFormTypes"
import ExpectationsField from "./ExpectationsField"
import TempOfferFields from "./TempOfferFields"
import TempOfferPreview from "./TempOfferPreview"

const { Step } = Steps

const TempOfferForm: React.FC = () => {
	const router = useRouter()
	const [formData, setFormData] = useState<TempJobOfferFormData>({
		name: "",
		email: "",
		jobTitle: "",
		directManager: "",
		duration: "",
		recruiter: "",
		recruiterJobTitle: "",
		team: "",
		department: "",
		expectations: [],
		netSalary: 0,
		formType: "",

		// offerType: "general",
		// name: "",
		// jobTitle: "",
		// email: "",
		// workType: "كامل",
		// directManager: "",
		// team: "",
		// department: "",
		// expectations: [],
		// netSalary: 0,
		// formType: "training"
	})

	const [currentStep, setCurrentStep] = useState(0)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [form] = useForm()

	useEffect(() => {
		form.setFieldsValue(formData)
		if (isSubmitted) {
			setCurrentStep(2) // Set to the last step when editing
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSubmitted, formData]) // Add formData to dependencies

	const handleSubmit = () => {
		setIsSubmitted(true)
	}

	const handleEdit = () => {
		setIsSubmitted(false)
	}

	const nextStep = () => {
		form.validateFields()
			.then(() => {
				if (currentStep < 2) {
					setCurrentStep((prev) => Math.min(prev + 1, 2))
				} else {
					handleSubmit()
				}
			})
			.catch((errorInfo) => {
				console.log("Validation Failed:", errorInfo)
			})
	}

	const prevStep = () => {
		if (currentStep === 0) {
			router.push("/offer")
			return
		}
		setCurrentStep((prev) => Math.max(prev - 1, 0))
	}

	if (isSubmitted) {
		return <TempOfferPreview formData={formData} onEdit={handleEdit} />
	}

	return (
		<>
			{currentStep > 0 && <ExportImportBtn formData={formData} setFormData={setFormData} />}
			<Form
				layout="vertical"
				onFinish={handleSubmit}
				className="mx-auto! w-[600px] max-w-full"
				form={form}
			>
				{currentStep > 0 && (
					<Steps current={currentStep} rootClassName="mb-8!">
						<Step title="نوع التعاقد" />
						<Step title="معلومات أساسية" />
						<Step title="المتوقعات" />
					</Steps>
				)}

				{currentStep === 0 && (
					<FormType
						formData={formData}
						setFormData={setFormData}
						setCurrentStep={setCurrentStep}
					/>
				)}
				{currentStep === 1 && (
					<TempOfferFields formData={formData} setFormData={setFormData} />
				)}

				{currentStep === 2 && (
					<ExpectationsField formData={formData} setFormData={setFormData} />
				)}

				<div style={{ marginTop: 20 }}>
					<Button style={{ marginInlineEnd: 8 }} onClick={prevStep}>
						السابق
					</Button>
					{currentStep > 0 && (
						<Button type="primary" onClick={nextStep}>
							{currentStep < 2 ? "التالي" : "حفظ"}
						</Button>
					)}
				</div>
			</Form>
		</>
	)
}

export default TempOfferForm
