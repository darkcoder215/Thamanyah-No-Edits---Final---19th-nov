"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Form, Steps } from "antd"
import { useForm } from "antd/es/form/Form"
import ExportImportBtn from "../Form/ExportImportBtn"
import { FreelancerOfferFormData } from "../Form/JobOfferFormTypes"
import BankDetailsFields from "./BankDetailsFields"
import BasicInfoFields from "./BasicInfoFields"
import DutiesField from "./DutiesField"
import FreelancerOfferPreview from "./FreelancerOfferPreview"
import FreelancerSheet from "./FreelancerSheet"

const { Step } = Steps

const FreelancerOfferForm: React.FC = () => {
	const router = useRouter()
	const [formData, setFormData] = useState<FreelancerOfferFormData>({
		name: "",
		email: "",
		jobTitle: "",
		managerName: "",
		managerJobTitle: "",
		managerEmail: "",
		workType: "full",
		dailyHours: 4,
		contractDuration: "3",
		duties: [],
		bankName: "",
		accountHolderName: "",
		iban: "",
		phoneNumber: "",
		salary: 0,
		agreementDate: "",
		startDate: "",
		nationalNumber: "",
		projectName: "",
		gender: "male",
		managerGender: "male",
	})

	const [currentStep, setCurrentStep] = useState(0)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [form] = useForm()

	useEffect(() => {
		form.setFieldsValue(formData)
	}, [formData, form])

	const handleSubmit = () => {
		setCurrentStep(2)
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
			.catch((errorInfo: Error) => {
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
		return <FreelancerOfferPreview formData={formData} onEdit={handleEdit} />
	}

	return (
		<>
			<ExportImportBtn formData={formData} setFormData={setFormData} />
			<Form
				layout="vertical"
				onFinish={handleSubmit}
				className="mx-auto! w-[600px] max-w-full"
				form={form}
			>
				<Steps current={currentStep} rootClassName="mb-8!">
					<Step title="معلومات أساسية" />
					<Step title="المهام" />
					<Step title="معلومات البنك" />
				</Steps>

				{currentStep === 0 && (
					<>
						<FreelancerSheet formData={formData} setFormData={setFormData} />
						<BasicInfoFields formData={formData} setFormData={setFormData} />
					</>
				)}

				{currentStep === 1 && <DutiesField formData={formData} setFormData={setFormData} />}

				{currentStep === 2 && (
					<BankDetailsFields formData={formData} setFormData={setFormData} />
				)}

				<div style={{ marginTop: 20 }}>
					<Button style={{ marginInlineEnd: 8 }} onClick={prevStep}>
						السابق
					</Button>
					<Button type="primary" onClick={nextStep}>
						{currentStep < 2 ? "التالي" : "حفظ"}
					</Button>
				</div>
			</Form>
		</>
	)
}

export default FreelancerOfferForm
