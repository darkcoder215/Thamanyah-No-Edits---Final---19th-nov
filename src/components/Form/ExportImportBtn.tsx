import React, { SetStateAction } from "react"
import { Button, message } from "antd"
import {
	FreelancerOfferFormData,
	JobOfferFormData,
	TempJobOfferFormData,
} from "./JobOfferFormTypes"

const ExportImportBtn = <
	T extends JobOfferFormData | TempJobOfferFormData | FreelancerOfferFormData,
>({
	formData,
	setFormData,
}: {
	formData: T
	setFormData: React.Dispatch<SetStateAction<T>>
}) => {
	const [messageApi, contextHolder] = message.useMessage()

	const handleExport = () => {
		try {
			const dataStr = JSON.stringify(formData)
			const blob = new Blob([dataStr], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `${formData.name ? formData.name + "-" : ""}${
				formData.jobTitle.split(" | ")[0]
			}.json`
			a.click()
			URL.revokeObjectURL(url)

			messageApi.success("تم تنزيل البيانات")
		} catch (error) {
			messageApi.error("حصل خطأ أثناء تصدير البيانات")
			console.error("error exporting data: ", error)
		}
	}

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0]
			if (file) {
				const reader = new FileReader()
				reader.onload = (e) => {
					const importedData = JSON.parse(e.target?.result as string)

					// Get valid keys from formData
					const validKeys = Object.keys(formData)

					// Filter importedData to only include valid keys
					const filteredData = Object.fromEntries(
						Object.entries(importedData).filter(([key]) => validKeys.includes(key)),
					)

					setFormData({
						...formData,
						...(filteredData as
							| JobOfferFormData
							| TempJobOfferFormData
							| FreelancerOfferFormData),
					})
				}
				event.target.value = ""
				reader.readAsText(file)
			}
			messageApi.success("تم استيراد البيانات")
		} catch (error) {
			messageApi.error("حصل خطأ أثناء الاستيراد")
			console.error("error import data: ", error)
		}
	}

	return (
		<div className="hide-print fixed-bottom fixed right-1/2 bottom-2 z-20 flex translate-x-1/2 items-center justify-center gap-x-2 rounded-xl bg-black/70 p-2 text-center backdrop-blur-xs">
			{contextHolder}
			<Button
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
						/>
					</svg>
				}
				style={{ marginInlineEnd: 4 }}
				onClick={handleExport}
			>
				تصدير
			</Button>
			<input
				type="file"
				accept=".json"
				onChange={handleImport}
				className="hidden"
				id="import-file"
			/>
			<Button
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
						/>
					</svg>
				}
				onClick={() => {
					document.getElementById("import-file")?.click()
				}}
			>
				استيراد
			</Button>
		</div>
	)
}
export default ExportImportBtn
