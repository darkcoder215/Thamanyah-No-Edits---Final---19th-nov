"use client"

import { useRouter } from "next/navigation"
import { Radio, type RadioChangeEvent } from "antd"

export default function SelectForm() {
	const router = useRouter()
	return (
		<Radio.Group
			buttonStyle="solid"
			optionType="button"
			className="grid! flex-1 grid-cols-2 items-center gap-x-4 gap-y-4 text-center max-sm:grid-cols-1 [&_.eight-radio]:hidden! [&_.eight-radio-button-wrapper:not(:first-child)::before]:hidden!"
			size="large"
			options={[
				{
					value: "job-offer",
					label: (
						<>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="mx-auto size-8"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
								/>
							</svg>
							عرض وظيفي
						</>
					),
					style: {
						borderRightWidth: 1,
						borderRadius: 20,
						padding: "48px 0 24px",
						height: "auto",
					},
				},

				{
					value: "temp-offer",
					label: (
						<>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="mx-auto size-8"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
								/>
							</svg>
							عرض مؤقت
						</>
					),
					style: {
						borderRightWidth: 1,
						borderRadius: 20,
						padding: "48px 0 24px",
						height: "auto",
					},
				},
				// {
				// 	value: "freelancer",
				// 	label: (
				// 		<>
				// 			<svg
				// 				xmlns="http://www.w3.org/2000/svg"
				// 				fill="none"
				// 				viewBox="0 0 24 24"
				// 				strokeWidth={1.5}
				// 				stroke="currentColor"
				// 				className="mx-auto size-8"
				// 			>
				// 				<path
				// 					strokeLinecap="round"
				// 					strokeLinejoin="round"
				// 					d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
				// 				/>
				// 			</svg>
				// 			عقد تعاون مع مستقل
				// 		</>
				// 	),
				// 	style: {
				// 		borderRightWidth: 1,
				// 		borderRadius: 20,
				// 		padding: "48px 0 24px",
				// 		height: "auto",
				// 		gridColumn: "span 2",
				// 	},
				// },
				{
					value: "calculator",
					label: (
						<>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="mx-auto size-8"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
								/>
							</svg>
							حاسبة الرواتب
						</>
					),
					style: {
						borderRightWidth: 1,
						borderRadius: 20,
						padding: "16px 0 8px",
						height: "auto",
						gridColumn: "span 2",
					},
				},
			]}
			onChange={(e: RadioChangeEvent) => {
				if (e.target.value === "freelancer") {
					router.push("/freelancer-offer")
				} else if (e.target.value === "temp-offer") {
					router.push("/temp-offer")
				} else if (e.target.value === "job-offer") {
					router.push("/job-offer")
				} else if (e.target.value === "calculator") {
					router.push("/salary-calculator")
				}
			}}
		></Radio.Group>
	)
}
