"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Form, Steps } from "antd"
import { useForm } from "antd/es/form/Form"
import BasicInfo from "../Form/BasicInfo"
import ExpectationsAndTargets from "../Form/ExpectationsAndTargets"
import ExportImportBtn from "../Form/ExportImportBtn"
import { JobOfferFormData } from "../Form/JobOfferFormTypes"
import SalaryInfo from "../Form/SalaryInfo"
import JobOfferPreview from "./JobOfferPreview"

const { Step } = Steps

const JobOfferForm: React.FC = () => {
	const router = useRouter()
	const [formData, setFormData] = useState<JobOfferFormData>({
		offerType: "general",
		name: "",
		email: "",
		jobTitle: "",
		jobTitleEn: "",
		workType: "كامل",
		directManager: "",
		directManagerJobTitle: "",
		team: "",
		department: "",
		level: 1,
		expectations: [],
		targets: [],
		isSaudi: false,
		monthlySalary: 0,
		basicSalary: 0,
		housingAllowance: 0,
		transportAllowance: 0,
		additionalAllowances: 0,
		netSalary: 0,
		managerSignName: "",
		theme: "general",
		salaryType: "withAllowances",
		workTypeParent: "employee",
		saudiLocation: "inSaudi",
		contractType: "collaboration",

		// theme: "league",
		// offerType: "general",
		// name: "مُدثّر عبدالرؤوف",
		// jobTitle: "مديرة منتج | Product Manager",
		// email: "m.farah@thmanyah.com",
		// workType: "كامل",
		// directManager: "علي بوصالح",
		// directManagerJobTitle: "الرئيس التنفيذي للتقنية",
		// team: "الفريق",
		// department: "القسم",
		// level: 1,
		// expectations: [
		// 	"التعرف على اتجاهات السوق واحتياجات العملاء والمشهد التنافسي للمساهمة في اتخاذ القرارات الاستراتيجية.",
		// 	"تحديد الأولويات وضبط آلية العمل وبناء خارطة الطريق للمنتجات.",
		// 	"التعاون مع الفرق المختلفة، لضمان تنفيذ سلس لأهداف المنتج.",
		// 	"المساعدة في توظيف فريق المنتجات وتقييم الموظفين.",
		// 	"الإشراف على إدارة منتجات «ثمانية» التقنية.",
		// 	"الإشراف على تفصيل المهام لفريق التطوير.",
		// ],
		// targets: ["مثل", "مثل"],
		// isSaudi: false,
		// monthlySalary: 16000,
		// basicSalary: 16875,
		// housingAllowance: 4219,
		// transportAllowance: 506,
		// additionalAllowances: 14400,
		// netSalary: 33943,
		// managerSignName: "حسن",
		// leagueCoverImage: "",
	})

	const [currentStep, setCurrentStep] = useState(0)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [form] = useForm()
	const levelsMap = {
		managerial: [
			{ roleEN: "", level: 0, roleAR: "بدون مستوى" }, // for league
			{ roleEN: "Lead", level: 4, roleAR: "قائد" },
			// { roleEN: "Senior Lead", level: 4.5, roleAR: "قائد أول" },
			{ roleEN: "Manager", level: 5, roleAR: "مدير" },
			// { roleEN: "Senior Manager", level: 5.5, roleAR: "مدير أول" },
			{ roleEN: "Director", level: 6, roleAR: "مدير قسم" },
			// { roleEN: "Senior Director / Senior Head", level: 6.5, roleAR: "مدير أول لقسم" },
			{ roleEN: "Vice President", level: 7, roleAR: "نائب رئيس" },
			// { roleEN: "Senior VP", level: 7.5, roleAR: "نائب أول للرئيس" },
			{ roleEN: "CXO", level: 8, roleAR: "رئيس الـ" },
		],
		technical: [
			{ roleEN: "", level: 0, roleAR: "بدون مستوى" }, // for league
			{ roleEN: "Junior", level: 1, roleAR: "مبتدئ" },
			{ roleEN: "Level I", level: 2, roleAR: "مستوى I" },
			{ roleEN: "Level II", level: 3, roleAR: "مستوى II" },
			{ roleEN: "Senior", level: 4, roleAR: "أول" },
			{ roleEN: "Staff", level: 5, roleAR: "كبير" },
			// { roleEN: "Senior Staff", level: 5.5, roleAR: "كبير أول" },
			{
				roleEN: "Expert",
				level: 6,
				roleAR: "خبير",
			},
		],
		general: [
			{ roleEN: "", level: 0, roleAR: "بدون مستوى" }, // for league
			{ roleEN: "Associate", level: 1, roleAR: "مساعد" },
			{ roleEN: "Officer", level: 2, roleAR: "مسؤول" },
			{ roleEN: "Specialist", level: 3, roleAR: "أخصائي" },
			{ roleEN: "Sr. Specialist", level: 4, roleAR: "أخصائي أول" },
			{ roleEN: "Staff", level: 5, roleAR: "كبير" },
			// { roleEN: "Senior Staff", level: 5.5, roleAR: "كبير أول" },
		],
	}
	const [levels, setLevels] = useState(levelsMap["general"])

	useEffect(() => {
		setLevels(levelsMap[formData.offerType || "general"])

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
		return <JobOfferPreview formData={formData} onEdit={handleEdit} levels={levels} />
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
					<Step title="المتوقعات والمستهدفات" />
					<Step title="معلومات الراتب" />
				</Steps>

				{currentStep === 0 && (
					<BasicInfo formData={formData} setFormData={setFormData} levels={levels} />
				)}

				{currentStep === 1 && (
					<ExpectationsAndTargets formData={formData} setFormData={setFormData} />
				)}

				{currentStep === 2 && (
					<SalaryInfo formData={formData} setFormData={setFormData} form={form} />
				)}

				<div style={{ marginTop: 20 }}>
					<Button style={{ marginInlineEnd: 8 }} onClick={prevStep}>
						السابق
					</Button>
					<Button type="primary" onClick={nextStep}>
						{currentStep < 2 ? "التالي" : "حفظ"}
					</Button>
					{/* <Button
						type="primary"
						onClick={() => {
							setIsSubmitted(true)
						}}
					>
						skip
					</Button> */}
				</div>
			</Form>
		</>
	)
}

export default JobOfferForm
