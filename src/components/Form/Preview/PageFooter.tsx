import React from "react"

export default function PageFooter({
	showToday,
	freelancer,
	currentPage = 0,
}: {
	showToday?: boolean
	freelancer?: boolean
	currentPage?: number
}) {
	const formatToday = () => {
		const date = new Date()
		const day = date.getDate()
		const year = date.getFullYear()
		const month = date.toLocaleDateString("ar", { month: "long" })
		return `${day} ${month} ${year}`
	}

	return (
		<footer className="absolute right-0 bottom-[55px] flex w-[210mm] items-end justify-between px-[55px]">
			<p className="font-8-sans text-center text-sm font-light">
				{showToday && formatToday()}
				{freelancer && (
					<span className="font-8-light text-[8.5pt]">freelancer@thmanyah.com</span>
				)}
			</p>
			{freelancer ? (
				<span className="font-8-light text-[8.5pt]">صفحة {currentPage} من 3</span>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="42"
					fill="none"
					viewBox="0 0 13 15"
					className="h-auto"
				>
					<path
						fill="currentColor"
						d="M3.5 14.656c1.806-2.247 2.536-4.497 2.853-6.822h.294c.317 2.325 1.047 4.575 2.853 6.822h.178l3.04-6.026C9.178 6.638 7.745 3.898 6.733.344h-.464C5.256 3.898 3.823 6.638.281 8.63l3.041 6.026z"
					></path>
				</svg>
			)}
		</footer>
	)
}
