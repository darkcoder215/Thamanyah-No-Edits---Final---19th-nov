export const formTypeOptions = [
	{
		value: "freelancer",
		name: "عرض تعاون مستقل",
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
						d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
					/>
				</svg>
				عرض تعاون مستقل
			</>
		),
		style: {
			borderRightWidth: 1,
			borderRadius: 20,
			padding: "48px 0 24px",
			height: "auto",
			gridColumn: "span 2",
		},
	},
	// {
	// 	value: "collaboration",
	// 	name: "عرض تعاوني",
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
	// 					d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
	// 				/>
	// 			</svg>
	// 			عرض تعاوني
	// 		</>
	// 	),
	// 	style: {
	// 		borderRightWidth: 1,
	// 		borderRadius: 20,
	// 		padding: "48px 0 24px",
	// 		height: "auto",
	// 	},
	// },
	{
		value: "training",
		name: "عرض تدريبي",
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
						d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
					/>
				</svg>
				عرض تدريبي
			</>
		),
		style: {
			borderRightWidth: 1,
			borderRadius: 20,
			padding: "48px 0 24px",
			height: "auto",
			gridColumn: "span 2",
		},
	},
]
