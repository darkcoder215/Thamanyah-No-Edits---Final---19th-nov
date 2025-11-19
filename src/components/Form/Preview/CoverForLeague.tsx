import React from "react"
import Image from "next/image"
import clsx from "clsx"
import PageFooter from "./PageFooter"

export default function CoverForLeague({
	name,
	title,
	cover,
}: {
	name: string
	title?: string
	cover?: string
}) {
	const nameArr = name.split(" ")
	return (
		<>
			<div
				className={clsx(
					"page mb-4 flex flex-col justify-center border-0! bg-black! *:text-white print:bg-black!",
					cover && "no-corners",
				)}
				style={{
					backgroundImage: `url(${cover || "/job-league-cover.png"})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{!cover && (
					<>
						<div className="-mt-50">
							<h1 className="font-8-display mb-6 text-[25pt] font-light">
								{title || "العزيــــز"}
							</h1>
							<h2 className="font-8-display max-w-1/2 text-[86pt] leading-[86pt] font-medium">
								{nameArr.length === 2
									? nameArr.map((word, index) => (
											<span
												key={index}
												className={clsx(index === 1 && "text-[66pt]")}
											>
												{word}
												{index < nameArr.length - 1 && " "}
											</span>
										))
									: name}
							</h2>
						</div>
						<footer className="absolute right-0 bottom-[55px] flex w-[210mm] items-end justify-between px-[55px]">
							<Image
								src="/logo.png"
								alt="logo"
								width={110}
								height={110}
								className="mb-3 h-auto"
							/>
						</footer>
					</>
				)}
			</div>

			{/* page */}
			<div className="page mb-4 flex flex-col justify-center border-0! bg-black! *:text-[#fafafa] print:bg-black!">
				<div className="font-8-sans flex flex-col gap-6 text-xl leading-9 font-light">
					<p>
						<strong className="text-white">
							منذ عام 2016 ونحن ننتج وننشر المحتوى بإحسـان من الرياض
						</strong>{" "}
						— نشرنا أكثـر من ثمانية آلاف مادة، صوتيّة ومرئيّة ومكتوبة، في كل المجالات.
					</p>
					<p>
						حتّى صرنا شبكة البودكاست الأعلى انتشارًا في العالم العربي، وحزنا على درع
						تذكاري من قينيس للأرقام القياسية، بأكثر حلقة بودكاست مشاهدةً في التاريخ. غير
						أننا أكبر منتج للأفلام الوثائقيّـة في السعودية، ونشراتنا البريديـة تنافس
						عالميًّــا في معــدل الفتـح. نزعم أننا نقدّم أفضـل محتوى عربي على الإنترنت!
					</p>
					<p>
						اليــوم، رغم الإنفاق الضخــم لتطويــر البطولات والدوري السعودي، إلا أن خدمات
						وتقنيــات البث والنقــل لا تــزال ... متواضعـة، أو ضعيفـة. أما مكتبة المحتوى
						الرياضي ... شحيحة وبعيدة عن التأثير والانتشار.
					</p>
					<p>
						فرصة أن ثمانية هي الناقل الحصري للدوري، صعبة وتحدياتها الكبيرة. إلا أنّي
						مؤمن أنّنا سنقدم أفضــل تجربــة نقــل للدوري السعودي في تاريخه، وسنصنــع
						محتوى يشغف قلب الجماهير للدوري في كل أرجاء العالم العربي، ونتمنـى أن تكون
						جزء من هذه القصّة!
					</p>
					<Image
						src="/icons/abumaleh-sign.svg"
						width={186}
						height={78}
						className="h-auto"
						alt=""
					/>
				</div>
				<PageFooter showToday />
			</div>
		</>
	)
}
