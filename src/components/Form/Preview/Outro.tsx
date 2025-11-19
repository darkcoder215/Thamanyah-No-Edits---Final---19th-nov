import React from "react"
import Image from "next/image"
import PageFooter from "./PageFooter"

export default function Outro() {
	return (
		<div className="outro page mb-4 flex flex-col justify-center border-0! bg-black! *:text-white print:bg-black!">
			<div className="-mt-8">
				<Image
					src="/logo.png"
					alt="logo"
					width={260}
					height={260}
					className="mb-3 h-auto"
				/>
				<h2 className="font-8-sans text-[14pt] font-light">
					كُتب بإحسان من مدينة الرياض ❤️
				</h2>
			</div>
			<PageFooter />
		</div>
	)
}
