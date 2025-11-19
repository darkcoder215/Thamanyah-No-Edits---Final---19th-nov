"use client"

import { Typography } from "antd"
import { useAuth } from "@/lib/context/AuthContext"
import { getGreetingEmoji } from "@/utils/helpers"

const { Title } = Typography

export default function Home() {
	const { user } = useAuth()

	return (
		<main className="flex min-h-screen items-center justify-center">
			<Title>
				أهلًا {user?.displayName?.split(" ")[0]} {getGreetingEmoji()}
			</Title>
		</main>
	)
}
