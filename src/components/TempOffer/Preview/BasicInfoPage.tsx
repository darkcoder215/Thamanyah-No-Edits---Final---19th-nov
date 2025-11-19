import React from "react"
import { TempJobOfferFormData } from "@/components/Form/JobOfferFormTypes"
import PageFooter from "@/components/Form/Preview/PageFooter"
import UL from "@/components/Form/Preview/UL"
import { formTypeOptions } from "@/components/Form/formTypeOptions"

export default function BasicInfoPage({ formData }: { formData: TempJobOfferFormData }) {
	const formatNumbers = (number: number) => {
		return new Intl.NumberFormat("ar").format(number)
	}

	const firstName = formData.name.split(" ")[0]
	const formType = formTypeOptions.find((t) => t.value === formData.formType)
	return (
		<div className="page font-8-sans text-[14pt] font-light">
			<h1 className="font-8-serif mb-2 text-[38pt] font-bold">أهلًا {firstName} 👋🏼</h1>
			<p className="mb-2">
				نتمنى أن تكون معنا في سعينا <strong>لإثراء المحتوى العربي</strong> وتغيير ثقافة
				الصحافة <strong>في الوطن العربي</strong>.
			</p>
			<p className="mb-6">يسعدنا العمل معك على النحو التالي:</p>

			{/* -Job description- */}
			<section className="mb-12 flex gap-x-3 text-center">
				<div className="flex-1">
					<div className="bg-green-light mb-3.5 rounded-xl p-3.5">
						<div>
							{formType?.value === "collaboration" ? "المسمى" : "المسمى التدريبي"}
						</div>
						<strong className="text-[13pt]">{formData.jobTitle}</strong>
					</div>
					<div className="bg-green-light flex justify-around rounded-xl p-3.5 text-[12pt]">
						<div>
							<div>القسم</div>
							<strong>{formData.department}</strong>
						</div>
						<span className="border-e border-black"></span>
						<div>
							<div>الفريق</div>
							<strong>{formData.team}</strong>
						</div>
						<span className="border-e border-black"></span>
						<div>
							<div>المدير المباشر</div>
							<strong>{formData.directManager}</strong>
						</div>
						<span className="border-e border-black"></span>
						<div>
							<div>نوع التعاقد</div>
							<strong>{formType?.value === "freelancer" ? "مستقل" : "تدريب"}</strong>
						</div>
					</div>
				</div>
				<div className="bg-green-full w-2/6 rounded-xl p-3.5 text-[12pt]">
					<div className="border-b border-black pt-1 pb-2.5">
						<div>
							<div>مدة التعاون</div>
							<strong>{formData.duration}</strong>
						</div>
					</div>
					<div className="pt-3.5">
						<div>
							<div>المقابل الشهري</div>
							<strong>{formatNumbers(formData.netSalary)}</strong>
							<div className="text-[9pt]">ريال سعودي شامل</div>
						</div>
					</div>
				</div>
			</section>

			{/* Expectations */}
			{formData.expectations.length > 0 && (
				<section>
					<h2 className="font-8-serif mb-4 text-[24pt] font-bold">
						{formType?.value === "collaboration"
							? "في هذا التعاون نتوقع منك التالي:"
							: "في هذه الوظيفة نتوقع منك التالي:"}
					</h2>
					<UL list={formData.expectations} />
				</section>
			)}

			{/* Finish */}
			<section className="font-8-serif mt-28">
				<p className="mb-8 text-[18pt] font-normal">
					نتمنى أن نعمل سويّــا يدًا بيد، <strong>لإثراء المحتوى العربـي.</strong>
				</p>
				<div className="flex justify-between px-16 text-center font-[15pt]">
					<div>
						<strong className="font-bold!">{formData.name}</strong>
						<div>{formData.jobTitle.split("|")[0].trim()}</div>
					</div>
					<div>
						<strong className="font-bold!">{formData.recruiter}</strong>
						<div>{formData.recruiterJobTitle}</div>
					</div>
				</div>
			</section>

			<PageFooter />
		</div>
	)
}
