import React from "react"
import Image from "next/image"
import { FreelancerOfferFormData } from "@/components/Form/JobOfferFormTypes"
import PageFooter from "@/components/Form/Preview/PageFooter"
import UL from "@/components/Form/Preview/UL"
import { formatNumbers } from "@/utils/helpers"

export default function DutiesPage({ formData }: { formData: FreelancerOfferFormData }) {
	function formatHoursAr(number: number) {
		const pr = new Intl.PluralRules("ar", { type: "cardinal" })
		const nf = new Intl.NumberFormat("ar")
		const pluralCategory = pr.select(number)
		const arabicNumber = nf.format(number)

		switch (pluralCategory) {
			case "one":
				return `${arabicNumber} ساعة` // ١ ساعة
			case "two":
				return `ساعتين` // Dual form doesn't need number
			case "few":
				return `${arabicNumber} ساعات` // ٣–١٠ ساعات
			default:
				return `${arabicNumber} ساعة` // fallback
		}
	}
	return (
		<div className="page-2 font-8-serif text-[12pt] font-normal">
			{/* Header with company info */}
			<div className="absolute top-4 flex gap-x-[60px]">
				<div className="font-8-display text-[10px] font-medium">
					شركة ثمانية للنشر والتوزيع
				</div>
				<div className="font-8-serif w-[80pt] text-[10px]">
					6731 طريق أبي بك الصديق، حي النرجس ، الرياض
				</div>
			</div>
			<div className="flex h-full gap-x-[50px]">
				<div className="w-[116px]">
					<Image
						src="/logo-black.png"
						alt="logo"
						width={116}
						height={44}
						className="h-auto"
					/>
				</div>
				<div className="grid h-full flex-1 grid-cols-2 gap-x-[30px] leading-[1.6]">
					<div className="flex flex-col justify-between">
						<div>
							<p className="mb-2 font-bold">ملحق مهام عمل الطرف الثاني الأساسية:</p>
							<UL list={formData.duties} className="text-[#EE220C]" />
						</div>
					</div>

					<div>
						<p className="mb-2 text-[12pt] font-bold">المستحقات المالية:</p>
						<ol className="list-decimal">
							<li className="mb-2">
								يستحق الطرف الثاني أجرًا شهريًا قدره «
								<span className="text-[#EE220C]">
									{formatNumbers(formData.salary)}
								</span>
								» ريال سعودي وتسلّم له المستحقات بنهاية كل شهر ميلادي عند تسليم كافة
								المنجزات واعتمادها من الطرف الأول.
							</li>
							<li className="mb-2">
								يعمل الطرف الثاني بدوام{" "}
								<span className="text-[#EE220C]">
									{formData.workType === "full" ? "كامل" : "جزئي"}
								</span>{" "}
								«
								<span className="text-[#EE220C]">
									{formatHoursAr(formData.dailyHours)}
								</span>
								» يوميًا.
							</li>
							<li className="mb-2">
								اعتمد الطرف الأول الحوالات المصرفية وسيلةً لدفع مستحقات الطرف الثاني
								على حسابه البنكي المدوّن أدناه:
							</li>
						</ol>
						<ul>
							<li>
								- الاسم الكامل للمستفيد:{" "}
								<span className="text-[#EE220C]">{formData.accountHolderName}</span>
							</li>
							<li>
								- اسم البنك:{" "}
								<span className="text-[#EE220C]">{formData.bankName}</span>
							</li>
							<li>
								- رقـــــــــــــم الآيبـــــــــــــــــــــــــــــــان:{" "}
								<span className="text-[#EE220C]">{formData.iban}</span>
							</li>
						</ul>
					</div>

					<div>
						<div>
							<p className="mb-2 text-[12pt] font-bold">الطرف الأول</p>
							<div className="text-[10pt] text-[#EE220C]">{formData.managerName}</div>
						</div>
					</div>
					<div>
						<div>
							<p className="mb-2 text-[12pt] font-bold">الطرف الثاني</p>
							<div className="text-[10pt] text-[#EE220C]">{formData.name}</div>
						</div>
					</div>
				</div>
			</div>
			<div className="-mt-30">
				<Image
					src="/icons/signature.png"
					alt="logo"
					width={116}
					height={44}
					className="mx-auto h-auto"
				/>
			</div>
			<PageFooter freelancer currentPage={3} />
		</div>
	)
}
