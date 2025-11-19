import React from "react"
import PageFooter from "@/components/Form/Preview/PageFooter"
import { formatNumbers } from "@/utils/helpers"
import { type JobOfferFormData } from "../../Form/JobOfferFormTypes"
import { managers } from "../../Form/ManagerSign"
import SalaryAndBenefits from "./SalaryAndBenefits"

export default function SalaryPage({ formData }: { formData: JobOfferFormData }) {
	// Find the selected manager's details if managerSignName exists
	const selectedManager = formData.managerSignName
		? managers.find((m) => m.value === formData.managerSignName)
		: null

	return (
		<div className="page font-8-sans text-[14pt] font-light">
			{formData.salaryType === "withAllowances" ? (
				<>
					<h2 className="font-8-serif mb-2 text-[24pt] font-bold">الراتب والبدلات</h2>
					<SalaryAndBenefits formData={formData} />
				</>
			) : (
				<>
					<h2 className="font-8-serif mt-40 mb-4 text-[24pt] font-bold">
						{formData.level === 0 ? "المكافئة الشهرية" : "الراتب الشهري"}
					</h2>
					<section className="mb-80 text-center">
						<div className="bg-green-full mb-1.5 rounded-3xl px-4 py-8">
							<strong className="font-8-serif text-4xl font-bold!">
								({formatNumbers(formData.monthlySalary)})
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 1124.14 1256.39"
									className="ms-1 inline-block size-8"
								>
									<path
										fill="currentColor"
										d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
									/>
									<path
										fill="currentColor"
										d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
									/>
								</svg>
							</strong>
						</div>
					</section>
				</>
			)}

			{/* Finish */}
			<section className="font-8-serif mt-28">
				<p className="mb-8 text-[18pt] font-normal">
					نتمنى أن نعمل سويّــا يدًا بيد، <strong>لإثراء المحتوى العربـي.</strong>
				</p>
				<div className="flex justify-between px-16 text-center font-[15pt]">
					<div>
						<strong className="font-bold!">{formData.name}</strong>
						<div className="max-w-[400px]">{formData.jobTitle.trim()}</div>
					</div>
					<div>
						<strong className="font-bold!">
							{selectedManager ? selectedManager.value : formData.directManager}
						</strong>
						<div className="max-w-[400px]">
							{selectedManager
								? selectedManager.jobTitle.split("|")[0].trim() // [0] to get only the arabic title considering title like "ar title | en title"
								: formData.directManagerJobTitle.split("|")[0].trim()}
						</div>
					</div>
				</div>
			</section>

			<PageFooter />
		</div>
	)
}
