"use client"

import React, { useState } from "react"
import { Steps } from "antd"
import { type WizardData } from "@/types/template"
import { type FigmaInput, type ConversionResult } from "@/types/figma"
import { type TemplateField } from "@/types/field"
import Step1_Input from "./steps/Step1_Input"
import Step2_Processing from "./steps/Step2_Processing"
import Step3_FieldMapping from "./steps/Step3_FieldMapping"
import Step5_Preview from "./steps/Step5_Preview"

const { Step } = Steps

interface WizardStep {
	id: number
	title: string
	description: string
	component: React.ComponentType<StepProps>
	optional?: boolean
}

interface StepProps {
	wizardData: WizardData
	onNext: (data: Partial<WizardData>) => void
	onPrev: () => void
}

const steps: WizardStep[] = [
	{
		id: 0,
		title: "Input Figma Design",
		description: "Paste JSX, styles, and upload screenshot",
		component: Step1_Input,
	},
	{
		id: 1,
		title: "AI Processing",
		description: "Converting to Tailwind layout",
		component: Step2_Processing,
	},
	{
		id: 2,
		title: "Field Mapping",
		description: "Configure fillable fields",
		component: Step3_FieldMapping,
	},
	{
		id: 3,
		title: "Preview & Export",
		description: "Test and generate PDFs",
		component: Step5_Preview,
	},
]

export default function FigmaConverterWizard() {
	const [currentStep, setCurrentStep] = useState(0)
	const [wizardData, setWizardData] = useState<WizardData>({})

	const handleNext = (stepData: Partial<WizardData>) => {
		setWizardData((prev) => ({
			...prev,
			...stepData,
			currentStep: currentStep + 1,
		}))
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
	}

	const handlePrev = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0))
	}

	const CurrentStepComponent = steps[currentStep].component

	return (
		<div className="mx-auto max-w-6xl">
			{/* Progress Steps */}
			<Steps current={currentStep} className="mb-12">
				{steps.map((step) => (
					<Step
						key={step.id}
						title={step.title}
						description={step.description}
						status={
							step.id < currentStep
								? "finish"
								: step.id === currentStep
									? "process"
									: "wait"
						}
					/>
				))}
			</Steps>

			{/* Step Content */}
			<div className="rounded-lg border bg-white p-8 shadow-sm">
				<CurrentStepComponent
					wizardData={wizardData}
					onNext={handleNext}
					onPrev={handlePrev}
				/>
			</div>
		</div>
	)
}
