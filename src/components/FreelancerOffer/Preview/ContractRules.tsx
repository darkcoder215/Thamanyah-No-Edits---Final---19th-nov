import React from "react"
import Image from "next/image"
import PageFooter from "@/components/Form/Preview/PageFooter"

export default function ContractRules() {
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
				<div className="grid flex-1 grid-cols-2 gap-x-[30px] leading-[1.6]">
					<div>
						<p className="mb-2">
							أي مرحلة من مراحل العمل، وله كامل الحق في تقدير ما يستحقه الطرف الثاني
							من أجر مقابل ما أنجزه من عمل آخذًا في الاعتبار تقدير الأجر المستحق.
						</p>
						<ol className="mb-8 list-decimal" start={4}>
							<li className="mb-2">
								<strong>المنافسة:</strong> لا يحق للطرف الثاني منافسة الطرف الأول في
								مشروعه أو أي مشروع مماثلٍ له في تفاصيل موضوعه أو مخرجاته «موقع إنشاء
								المدونات والمقالات» سواءً لصالح نفسه أو لصالح الغير، فيما يطابق أو
								يشابه مهام عمل الطرف الثاني أو مشروع الطرف الأول محل هذه الاتفاقية،{" "}
								<strong>وذلك لمدة تنتهي مع إطلاق المنصة</strong>.
							</li>
							<li className="mb-2">
								<strong>السرية:</strong> يلتزم الطرف الثاني بالمحافظة على سرية العمل
								مع الطرف الأول فيما يتعلق بجميع تفاصيل مشروعه. وأنّ أي إفشاء أو
								تسريب للمعلومات أو الوثائق أو غيرها من قبل الطرف الثاني فإن للطرف
								الأول الحق في فسخ هذه الاتفاقية دون تحمل أي مسؤولية، وعلى الطرف
								الثاني تحمل التبعات القانونية لهذا الإفشاء.
							</li>
							<li className="mb-2">
								<strong>ملكية المخرجات:</strong> اتفق الطرفان على أن كل المخرجات
								التي ينتجها ويعمل عليها الطرف الثاني بموجب هذه الاتفاقية هي ملك
								للطرف الأول ولا يحق للطرف الثاني استعمالها لصالحه أو لصالح الغير
								إطلاقًا.
							</li>
							<li className="mb-2">
								<strong>المسؤولية القانونية أمام الغير:</strong> يضمن الطرف الثاني
								بعدم تعدّيه على أي حقوق محفوظة للغير وأنها لا تتضمن إساءة للغير بأي
								شكل من الأشكال، ويتحمل الطرف الثاني منفردًا جميع الأضرار المترتبة
								على تعديه لها.
							</li>
						</ol>
					</div>
					<div>
						<ol className="mb-8 list-decimal" start={8}>
							<li className="mb-2">
								المنازعات: في حال نشوء خلاف لا قدر الله بين الطرفين حول هذه
								الاتفاقية أو ملاحقه فإن الترافع القضائي ينعقد للجهات المختصة في
								مدينة الرياض.
							</li>
							<li className="mb-2">
								يقر الطرفان بصحة عناوينهم البريدية المدونة بصدر هذه الاتفاقية أعلاه،
								وأن المراسلات فيما بينهما تكون عن طريقها.
							</li>
							<li className="mb-2">
								يقوم الإرسال على البريد الإلكتروني مقام التسليم دون الحاجة للإشعار
								أو أي إجراء آخر.
							</li>
							<li className="mb-2">
								حررت هذه الاتفاقية من نسختين أصليتين واستلم كل طرف نسخة منها للعمل
								بموجبها. والله الموفق.
							</li>
						</ol>
					</div>
				</div>
			</div>
			<PageFooter freelancer currentPage={2} />
		</div>
	)
}
