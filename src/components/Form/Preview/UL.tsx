import React from "react"

export default function UL({ list, className }: { list: string[]; className?: string }) {
	return (
		<ul className={`leading-8 font-normal ${className}`}>
			{list.map((item, index) => (
				<li key={index} className="flex w-full list-none justify-start text-[12pt]">
					<span className="me-2.5 -mt-1 text-[16pt]">.</span>
					{item}
				</li>
			))}
		</ul>
	)
}
