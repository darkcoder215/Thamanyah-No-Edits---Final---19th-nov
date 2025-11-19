import React from "react"
import { JobOfferFormData, JobOfferFormProps } from "@/components/Form/JobOfferFormTypes"
import PageFooter from "@/components/Form/Preview/PageFooter"
import UL from "@/components/Form/Preview/UL"

export default function BasicInfoPage({
	formData,
	levels,
}: {
	formData: JobOfferFormData
	levels: JobOfferFormProps["levels"]
}) {
	const firstName = formData.name.split(" ")[0]
	const forLeague = formData.theme === "league"
	return (
		<div className="page font-8-sans text-[14pt] font-light">
			{forLeague && (
				<div className="font-8-display styled-font text-green-full mb-6 text-center text-5xl font-bold">
					عرض وظيفي
				</div>
			)}
			<h1 className="font-8-serif mb-2 text-[30pt] font-bold">أهلًا {firstName} 👋🏼</h1>
			{!forLeague && (
				<p className="mb-2">
					نتمنى أن تكون معنا في سعينا <strong>لإثراء المحتوى العربي</strong> وتغيير ثقافة
					الصحافة <strong>في الوطن العربي</strong>.
				</p>
			)}
			<p className="mb-6">يسعدنا العمل معك على النحو التالي:</p>

			{/* -Job description- */}
			<section className="mb-12 flex gap-x-3 text-center">
				<section className="flex-1">
					<div
						className={`mb-3.5 rounded-xl p-3.5 ${forLeague ? "bg-green-full" : "bg-green-light"}`}
					>
						<div>المسمى الوظيفي</div>
						<strong
							className={(() => {
								// set font size based on chars length
								const len = formData.jobTitle.length
								if (len < 52) return "text-[13pt]"
								if (len < 55) return "text-[12pt]"
								if (len < 62) return "text-[11pt]"
								if (len < 69) return "text-[10pt]"
								if (len < 82) return "text-[9.75pt]"
								if (len < 90) return "text-[9.5pt]"
								return "text-[9pt]"
							})()}
						>
							<span dir="rtl">{formData.jobTitle}</span>
							{formData.jobTitleEn && (
								<>
									{" | "}
									<span dir="ltr">{formData.jobTitleEn}</span>
								</>
							)}
						</strong>
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
						{formData.managerSignName.trim() !== formData.directManager.trim() && (
							<>
								<div>
									<div>المدير المباشر</div>
									<strong>{formData.directManager}</strong>
								</div>
								<span className="border-e border-black"></span>
							</>
						)}
						{formData?.contractDuration ? (
							<div>
								<div>مدة العقد</div>
								<strong>{formData.contractDuration}</strong>
							</div>
						) : formData?.contractCountry ? (
							<div>
								<div>بلد التعاقد</div>
								<strong>{formData.contractCountry}</strong>
							</div>
						) : formData?.contractCity ? (
							<div>
								<div>مدينة التعاقد</div>
								<strong>{formData.contractCity}</strong>
							</div>
						) : (
							<div>
								<div>نوع الدوام</div>
								<strong>{formData?.workType}</strong>
							</div>
						)}
					</div>
				</section>
				{levels && formData.level > 0 && (
					<section className="bg-green-light flex w-1/3 flex-col justify-between rounded-xl p-3.5">
						<div className="text-[14pt]">المستوى</div>
						{levels?.map(
							(level) =>
								level.level > 0 && (
									<div
										key={level.level}
										className={`flex ${
											level.level === formData.level
												? "text-[9pt] font-bold"
												: "text-[9pt] font-light"
										}`}
									>
										<div className="flex-1 text-start">{level.roleAR}</div>
										<div className="w-5 text-center">{level.level}</div>
										<div className="flex-1 text-end">{level.roleEN}</div>
									</div>
								),
						)}
					</section>
				)}
			</section>

			{/* Expectations */}
			{formData.expectations.length > 0 && (
				<section>
					<h2 className="font-8-serif mb-4 text-[24pt] font-bold">
						في هذه الوظيفة نتوقع منك التالي:
					</h2>
					<UL list={formData.expectations} />
				</section>
			)}

			{/* Targets */}
			{formData.targets.length > 0 && (
				<section>
					<h2 className="font-8-serif mt-6 mb-4 text-[24pt] font-bold">المستهدفات:</h2>
					<UL list={formData.targets} />
				</section>
			)}
			<PageFooter />
		</div>
	)
}
