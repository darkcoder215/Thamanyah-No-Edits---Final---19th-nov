import React from "react"
import Image from "next/image"
import { FreelancerOfferFormData } from "@/components/Form/JobOfferFormTypes"
import PageFooter from "@/components/Form/Preview/PageFooter"

export default function FreelancerBasicInfoPage({
	formData,
}: {
	formData: FreelancerOfferFormData
}) {
	const t = {
		male: {
			email: "وبريده",
			he: "إليه",
		},
		female: {
			email: "وبريدها",
			he: "إليها",
		},
	}
	const contractDurationText = {
		"1": "شهر",
		"2": "شهرين",
		"3": "ثلاثة أشهر",
		"4": "أربعة أشهر",
		"5": "خمسة أشهر",
		"6": "ستة أشهر",
		"7": "سبعة أشهر",
		"8": "ثمانية أشهر",
		"9": "تسعة أشهر",
		"10": "عشرة أشهر",
		"11": "أحد عشر شهرًا",
		"12": "سنة واحدة",
	}[formData.contractDuration]

	// Calculate contract end date based on duration
	const getContractDates = () => {
		const today = formData.agreementDate ? new Date(formData.agreementDate) : new Date()
		const agreementDate = new Date(formData.agreementDate)
		const startDate = new Date(formData.startDate)
		const endDate = new Date(today)
		endDate.setMonth(today.getMonth() + parseInt(formData.contractDuration))

		// Format dates in Arabic style
		const formatDate = (date: Date) => {
			const day = date.getDate()
			const month = date.toLocaleString("ar", { month: "long" })
			const year = date.getFullYear()
			return `${day} ${month}، ${year}`
		}

		return {
			agreementDate: formatDate(agreementDate),
			startDate: formatDate(startDate),
			endDate: formatDate(endDate),
			agreementDayName: agreementDate.toLocaleString("ar", {
				weekday: "long",
			}),
		}
	}

	const { startDate, endDate, agreementDayName, agreementDate } = getContractDates()
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
			<div className="flex gap-x-[50px]">
				<div className="w-[116px]">
					<Image
						src="/logo-black.png"
						alt="logo"
						width={116}
						height={44}
						className="h-auto"
					/>
				</div>
				<div className="grid flex-1 grid-cols-2 gap-x-[20px] leading-[1.6]">
					<div>
						<h1 className="font-8-display mb-9 text-[27pt] font-bold">
							اتفاقية إنجاز عمل
						</h1>
						<p className="mb-8">
							إنه في يوم <span className="text-[#EE220C]">{agreementDayName}</span>{" "}
							الموافق <span className="text-[#EE220C]">{agreementDate}</span>،{" "}
							<strong>تم الاتفاق بين كلٍّ من:</strong>
						</p>
						<p className="mb-8">
							<strong>الطرف الأول: </strong>
							<span className="text-[#EE220C]">
								شركة ثمانية للنشر والتوزيع، بسجل رقم (1010523606)، وعنوانها: 6731
								طريق أبي بكر الصديق، حي النرجس، الرياض. يمثلها في هذا العقد{" "}
								<span>{formData.managerJobTitle}</span>«
								<span>{formData.managerName}</span>»،{" "}
								{t[formData.managerGender].email} «
								<span>{formData.managerEmail}</span>». ويُشار{" "}
								{t[formData.managerGender].he} في هذه الاتفاقية بالطرف الأول.
							</span>
						</p>
						<p className="mb-8">
							<strong>الطرف الثاني: </strong>الأستاذ «
							<span className="text-[#EE220C]">{formData.name}</span>» ويحمل هوية
							وطنية رقم «
							<span className="text-[#EE220C]">{formData.nationalNumber}</span>» ورقم
							جواله «<span className="text-[#EE220C]">{formData.phoneNumber}</span>
							»، {t[formData.gender].email} «
							<span className="text-[#EE220C]">{formData.email}</span>
							». ويُشار {t[formData.gender].he} في هذه الاتفاقية بالطرف الثاني.
						</p>
						<p>
							<strong>تمهيد:</strong>
						</p>
						<p>
							حيث أن الطرف الأول شركة سعودية تعمل في إنتاج المحتوى المرئي والمسموع
							والمكتوب، وحيث أن الطرف الثاني يجد في نفسه القدرة المناسبة لإنجاز العمل
							المنصوص عليه في ملحق هذه الاتفاقية لصالح الطرف الأول،
						</p>
					</div>
					<div>
						<p className="mb-4">
							عليه فقد اتفق الطرفان بعد أن أقرّ كل منهما بأهليته المعتبرة شرعًا
							ونظامًا.
							<strong> لإبرام هذه الاتفاقية على ما يلي:</strong>
						</p>
						<ol className="mb-8 list-decimal">
							<li className="mb-2">
								<p>
									مدة هذه الاتفاقية هي{" "}
									<span className="text-[#EE220C]">{contractDurationText}</span>{" "}
									ميلادية تبدأ من تاريخ{" "}
									<span className="text-[#EE220C]">{startDate}</span> وتنتهي في
									تاريخ <span className="text-[#EE220C]">{endDate}</span>.
								</p>
							</li>
							<li className="mb-2">
								<p>
									هذا العقد للعمل كمستقل بمسمّى «
									<span className="text-[#EE220C]">{formData.jobTitle}</span>»
									لمشروع{" "}
									<span className="text-[#EE220C]">{formData.projectName}</span>.
								</p>
							</li>
							<li className="mb-2">
								أنّ التمهيد أعلاه والملحق جزآن لا يتجزآن من هذه الاتفاقية.
							</li>
						</ol>
						<div>
							<strong>الأحكام العامة:</strong>
							<ol className="list-decimal">
								<li className="mb-2">
									يلتزم الطرف الثاني بالعمل تحت إدارة وإشراف الطرف الأول وفق ما
									يمليه عليه من تكاليف ومهام لتنفيذ العمل.
								</li>
								<li className="mb-2">
									المهام الموضحة في ملحق{" "}
									<span className="border-b">
										«مهام عمل الطرف الثاني الأساسية»
									</span>{" "}
									تكون بناء على جدول زمني مواعيد تسليم يحددها الطرف الأول، وترسل
									لاحقًا على عنوان بريد الطرف الثاني الموضحة أعلاه إن اقتضت حاجة
									العمل لذلك.
								</li>
								<li className="mb-2">
									<strong>الفسخ والإنهاء:</strong> للطرف الأول الحق منفردًا في فسخ
									وإلغاء هــذه الاتفاقية في
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
			<PageFooter freelancer currentPage={1} />
		</div>
	)
}
