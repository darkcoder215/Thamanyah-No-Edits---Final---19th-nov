import React from "react"
import CoverForLeague from "./CoverForLeague"
import PageFooter from "./PageFooter"

export default function Cover({
	name,
	title,
	forLeague,
	cover,
}: {
	name: string
	title?: string
	forLeague?: boolean
	cover?: string
}) {
	return forLeague ? (
		<CoverForLeague name={name} cover={cover} />
	) : (
		<>
			<div className="page mb-4 flex flex-col justify-center border-0! bg-black! *:text-white print:bg-black!">
				<div className="-mt-8">
					<h1 className="font-8-serif text-[66pt] font-bold">{title || "عرض وظيفي"}</h1>
					<h2 className="font-8-display text-[25pt]">{name}</h2>
				</div>
				<PageFooter showToday />
			</div>
		</>
	)
}
