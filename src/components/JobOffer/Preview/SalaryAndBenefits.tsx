import React from "react"
import Image from "next/image"
import Link from "next/link"
import { formatNumbers } from "@/utils/helpers"
import { type JobOfferFormData } from "../../Form/JobOfferFormTypes"

export default function SalaryAndBenefits({ formData }: { formData: JobOfferFormData }) {
	const forLeague = formData.theme === "league"

	const featuresIcons = {
		league: {
			plane: "airplane-green.svg",
			arrow: "arrow-green.svg",
			medicalShield: "medical-shield-green.svg",
			laptop: "laptop-green.svg",
			weekend: "weekend-green.svg",
			flexibility: "flexibility-green.svg",
		},
		general: {
			plane: "airplane.png",
			arrow: "arrow.png",
			medicalShield: "medical-shield.png",
			laptop: "laptop.png",
			weekend: "weekend.png",
			flexibility: "flexibility.png",
		},
	}

	return (
		<>
			{/* Salary */}
			<section className="mb-6 text-center">
				<div className="bg-green-full mb-1.5 flex items-center justify-between rounded-xl px-4 py-3.5">
					<div className="font-8-serif text-[18pt] font-medium">الراتب الشهري شامــل</div>
					<strong className="font-8-serif text-[15pt] font-bold!">
						({formatNumbers(formData.monthlySalary)}){" "}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1124.14 1256.39"
							className="ms-1 inline-block size-6"
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
				<div className="flex gap-x-1.5 text-[12pt]">
					<div className="bg-green-light mb-3.5 flex flex-1 justify-between rounded-xl px-3.5 pt-3.5 pb-2.5">
						<div className="flex-1">
							<div>أجر أساسي</div>
							<strong>{formatNumbers(formData.basicSalary)}</strong>
						</div>
						<span className="border-e border-black"></span>
						<div className="flex-1">
							<div>بدل سكن</div>
							<strong>{formatNumbers(formData.housingAllowance)}</strong>
						</div>
						<span className="border-e border-black"></span>
						<div className="flex-1">
							<div>بدل نقل</div>
							<strong>{formatNumbers(formData.transportAllowance)}</strong>
						</div>
						{formData.additionalAllowances > 0 && (
							<>
								<span className="border-e border-black"></span>
								<div className="flex-1">
									<div>بدلات إضافية</div>
									<strong>{formatNumbers(formData.additionalAllowances)}</strong>
								</div>
							</>
						)}
					</div>
					{formData.netSalary > 0 &&
						formData.monthlySalary > 0 &&
						formData.netSalary !== formData.monthlySalary && (
							<div
								className={`mb-3.5 w-2/6 rounded-xl p-3.5 ${forLeague ? "bg-green-light" : "bg-green-full"}`}
							>
								<div>الراتب (بعد خصم التأمينات)</div>
								<strong className="font-bold!">
									{formatNumbers(formData.netSalary)}
								</strong>
							</div>
						)}
				</div>
			</section>

			{/* Benefits */}
			<section>
				<h2 className="font-8-serif mb-3 text-[24pt] font-bold">
					المزايا الوظيفية الإضافيـة
				</h2>
				<div className="grid grid-cols-2 gap-2 gap-x-7 text-[12pt]">
					<div className="bg-green-light flex items-center rounded-xl p-1 px-6">
						<Image
							src={`/icons/${featuresIcons[formData.theme || "general"].plane}`}
							width={40}
							height={40}
							alt=""
						/>
						<div className="ms-6">
							<strong>{formatNumbers(5000)} ريال سنويًـا</strong>
							<div className="text-[10pt]">بدل سفر لإجازتك السنوية</div>
						</div>
					</div>
					<div className="bg-green-light flex items-center rounded-xl p-1 px-6">
						<Image
							src={`/icons/${featuresIcons[formData.theme || "general"].arrow}`}
							width={42}
							height={42}
							alt=""
						/>
						<div className="ms-6">
							<strong>{formatNumbers(1000)} ريال سنويًـا</strong>
							<div className="text-[10pt]">بدل تدريب وتعليم</div>
						</div>
					</div>
					<div className="bg-green-light flex items-center rounded-xl p-1 px-6 font-normal">
						<Image
							src={`/icons/${featuresIcons[formData.theme || "general"].medicalShield}`}
							width={42}
							height={42}
							alt=""
						/>
						<div className="ms-6">
							{formData.saudiLocation === "inSaudi" ? (
								<>
									<strong>التأمين الطبي </strong>
									<span className="text-[10pt]">
										(بوبا أعلى فئة:{" "}
										<Link
											href="https://buy.bupa.com.sa/business/munshaat"
											className="underline"
											target="_blank"
										>
											تميّز 3.0
										</Link>
										)
									</span>
									<div className="text-[10pt]">
										بالإضافة إلى الأهل أو أحد الوالدين
									</div>
								</>
							) : (
								<>
									<strong>التأمين الطبي</strong>
									<div className="text-[10pt]">بدل مادي</div>
								</>
							)}
						</div>
					</div>
					<div className="bg-green-light flex items-center rounded-xl p-1 px-6">
						<Image
							src={`/icons/${featuresIcons[formData.theme || "general"].laptop}`}
							width={46}
							height={46}
							alt=""
						/>
						<div className="ms-6">
							<strong>تغطيـة 100%</strong>
							<div className="text-[10pt]">من الاحتياجات التقنية</div>
						</div>
					</div>
					<div className="bg-green-light flex items-center rounded-xl p-1 px-6">
						<Image
							src={`/icons/${featuresIcons[formData.theme || "general"].weekend}`}
							width={42}
							height={42}
							alt=""
						/>
						<div className="ms-6">
							<strong>عدد أيام إجازات مفتوحـة</strong>
							<div className="text-[10pt]">
								<Link
									href="https://blog.thmanyah.com/post/2320_1jhggnmybp"
									className="underline"
									target="_blank"
								>
									365 يوم في السنة
								</Link>
							</div>
						</div>
					</div>
					<div className="bg-green-light flex items-center rounded-xl p-1 px-6">
						<Image
							src={`/icons/${featuresIcons[formData.theme || "general"].flexibility}`}
							width={42}
							height={42}
							alt=""
						/>
						<div className="ms-6">
							<strong>المرونة في أوقات العمل</strong>
							<div className="text-[10pt]">في المكتب أو من أي مكان</div>
						</div>
					</div>
				</div>
				<p className="mt-4 text-[11pt] font-normal">
					<span className="text-[#E92218]">*</span> بالإضافة لجميع مزايا «ثمانية» حسب{" "}
					<Link
						href="https://company.thmanyah.com/handbook"
						className="underline"
						target="_blank"
					>
						الدستور الرسمي
					</Link>{" "}
					وهي قابله للتغيير.
				</p>
			</section>
		</>
	)
}
