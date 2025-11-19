import React, { useEffect, useState } from "react"
import { Select } from "antd"
import { FreelancerOfferFormData } from "../Form/JobOfferFormTypes"

interface FreelancerSheetProps {
	name: string
	email: string
	bankName: string
	accountHolderName: string
	iban: string
	nationalNumber: string
}

function convertToObjects(data: string[][]): FreelancerSheetProps[] {
	if (!data || data.length < 2) {
		throw new Error("Invalid data: Must have at least headers and one row of data.")
	}
	//
	const [headers, ...rows] = data
	return rows.map((row) => {
		console.log(row)
		const obj: FreelancerSheetProps = {
			name: row[headers.indexOf("الاسم الثلاثي بالعربية")] || "",
			email: row[headers.indexOf("البريد الإلكتروني")] || "",
			bankName: row[headers.indexOf("نوع البنك")] || "",
			accountHolderName: row[headers.indexOf("اسم المستفيد")] || "",
			iban: row[headers.indexOf("الآيبان")] || "",
			nationalNumber: row[headers.indexOf("رقم الهوية")] || "",
		}
		return obj
	})
}
export default function FreelancerSheet({
	formData,
	setFormData,
}: {
	formData: FreelancerOfferFormData
	setFormData: (data: FreelancerOfferFormData) => void
}) {
	const spreadsheetId = "1rOoUv1qe9wrbAIIhv-Av2faBGNh_BUmlq_2P3ZgKYes"
	const range = "Sheet1!A:Z"
	const api = `https://hr-360-review.vercel.app/getSheet?id=${spreadsheetId}&range=${range}`
	const [freelancers, setFreelancers] = useState<FreelancerSheetProps[]>([])

	useEffect(() => {
		const fetchFreelancers = async () => {
			try {
				const response = await fetch(api)
				if (!response.ok) {
					throw new Error("Failed to fetch freelancers")
				}
				const data = await response.json()
				setFreelancers(convertToObjects(data))
			} catch (error) {
				console.error("Error fetching freelancers:", error)
			}
		}

		fetchFreelancers()
	}, [api])

	const handleFreelancerSelect = (value: string) => {
		const selectedFreelancer = freelancers.find((f) => f.name === value)
		if (selectedFreelancer) {
			setFormData({
				...formData,
				name: selectedFreelancer.name,
				email: selectedFreelancer.email,
				bankName: selectedFreelancer.bankName,
				accountHolderName: selectedFreelancer.accountHolderName,
				iban: selectedFreelancer.iban,
				nationalNumber: selectedFreelancer.nationalNumber,
			})
		}
	}

	return (
		<div>
			<Select
				style={{ width: "100%", marginBottom: 16 }}
				placeholder="اختر الموظف"
				onChange={handleFreelancerSelect}
				options={freelancers.map((freelancer) => ({
					value: freelancer.name,
					label: freelancer.name,
				}))}
			/>
		</div>
	)
}
