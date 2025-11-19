import React, { useEffect } from "react"
import { type JobOfferFormData, type JobOfferFormProps } from "../Form/JobOfferFormTypes"
import { managers } from "../Form/ManagerSign"
import Cover from "../Form/Preview/Cover"
import Outro from "../Form/Preview/Outro"
import PreviewActions from "../Shared/PreviewActions"
import TempBasicInfoPage from "../TempOffer/Preview/BasicInfoPage"
import BasicInfoPage from "./Preview/BasicInfoPage"
import SalaryPage from "./Preview/SalaryPage"

interface JobOfferPreviewProps {
	formData: JobOfferFormData
	levels: JobOfferFormProps["levels"]
	onEdit: () => void
}

const JobOfferPreview: React.FC<JobOfferPreviewProps> = ({ formData, levels, onEdit }) => {
	const handleFileUpload = async (file: File) => {
		const data = new FormData()
		data.append("pdf", file)
		data.append("offerData", JSON.stringify(formData))

		const response = await fetch("https://hook.eu1.make.com/y7agyrr6d16y57vrcnuz1qv1h16e8j80", {
			method: "POST",
			body: data,
		})
		if (!response.ok) {
			throw new Error("Network response was not ok")
		}
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.document.title = `العرض الوظيفي - ${formData.name}`
		}
	}, [formData.name])

	const selectedManager = formData.managerSignName
		? managers.find((m) => m.value === formData.managerSignName)
		: null

	return (
		<>
			<div className={`overflow-x-auto ${formData.theme === "league" ? "theme-league" : ""}`}>
				<Cover
					forLeague={formData.theme === "league"}
					name={formData.name}
					cover={formData.leagueCoverImage}
					title={formData.contractType === "employment" ? "عرض وظيفي" : "عرض تعاوني"}
				/>
				{formData.contractType === "employment" ? (
					<>
						<BasicInfoPage formData={formData} levels={levels} />
						<SalaryPage formData={formData} />
					</>
				) : (
					<TempBasicInfoPage
						formData={{
							name: formData.name,
							email: formData.email,
							jobTitle: formData.jobTitle,
							directManager: formData.directManager,
							duration: formData.contractDuration || "",
							recruiter: formData.managerSignName || formData.directManager,
							recruiterJobTitle:
								formData.managerSignName && selectedManager
									? selectedManager.jobTitle
									: formData.directManagerJobTitle,
							team: formData.team,
							department: formData.department,
							expectations: formData.expectations,
							netSalary: formData.monthlySalary,
							formType: "collaboration",
						}}
					/>
				)}
				<Outro />
			</div>
			<PreviewActions
				onEdit={onEdit}
				onFileUpload={handleFileUpload}
				email={formData.email}
			/>
		</>
	)
}

export default JobOfferPreview
