import React, { useEffect } from "react"
import { type TempJobOfferFormData } from "../Form/JobOfferFormTypes"
import Cover from "../Form/Preview/Cover"
import Outro from "../Form/Preview/Outro"
import { formTypeOptions } from "../Form/formTypeOptions"
import PreviewActions from "../Shared/PreviewActions"
import BasicInfoPage from "./Preview/BasicInfoPage"

interface TempOfferPreview {
	formData: TempJobOfferFormData
	onEdit: () => void
}

const JobOfferPreview: React.FC<TempOfferPreview> = ({ formData, onEdit }) => {
	const formType = formTypeOptions.find((t) => t.value === formData.formType)

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

	return (
		<>
			<div className="overflow-x-auto">
				<Cover
					name={formData.name}
					title={formType?.value === "collaboration" ? "عرض التعاون" : "العرض التدريبي"}
				/>
				<BasicInfoPage formData={formData} />
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
