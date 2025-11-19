import React, { useEffect } from "react"
import { FreelancerOfferFormData } from "../Form/JobOfferFormTypes"
import PreviewActions from "../Shared/PreviewActions"
import ContractRules from "./Preview/ContractRules"
import DutiesPage from "./Preview/DutiesPage"
import FreelancerBasicInfoPage from "./Preview/FreelancerBasicInfoPage"

interface FreelancerOfferPreviewProps {
	formData: FreelancerOfferFormData
	onEdit: () => void
}

const FreelancerOfferPreview: React.FC<FreelancerOfferPreviewProps> = ({ formData, onEdit }) => {
	const handleFileUpload = async (file: File) => {
		const data = new FormData()
		data.append("file", file)
		data.append("offer", JSON.stringify(formData))

		const response = await fetch("/api/send-freelancer-offer", {
			method: "POST",
			body: data,
		})

		if (!response.ok) {
			throw new Error("Network response was not ok")
		}
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.document.title = `اتفاقية إنجاز عمل - ${formData.name}`
		}
	}, [formData.name])

	return (
		<>
			<div className="overflow-x-auto">
				<FreelancerBasicInfoPage formData={formData} />
				<ContractRules />
				<DutiesPage formData={formData} />
			</div>
			<PreviewActions
				onEdit={onEdit}
				onFileUpload={handleFileUpload}
				email={formData.email}
			/>
		</>
	)
}

export default FreelancerOfferPreview
