"use client"

import Link from "next/link"
import { Typography, Card, Row, Col } from "antd"
import {
	FileTextOutlined,
	ToolOutlined,
	CalculatorOutlined,
	TeamOutlined,
} from "@ant-design/icons"
import { useAuth } from "@/lib/context/AuthContext"
import { getGreetingEmoji } from "@/utils/helpers"

const { Title } = Typography

const tools = [
	{
		title: "Job Offers",
		description: "Create employment offer letters",
		href: "/offer",
		icon: <FileTextOutlined style={{ fontSize: "2rem" }} />,
	},
	{
		title: "Salary Calculator",
		description: "Calculate salary breakdowns",
		href: "/salary-calculator",
		icon: <CalculatorOutlined style={{ fontSize: "2rem" }} />,
	},
	{
		title: "Manage Advertisers",
		description: "Admin advertiser management",
		href: "/manage-advertisers",
		icon: <TeamOutlined style={{ fontSize: "2rem" }} />,
	},
	{
		title: "Figma Converter",
		description: "Convert Figma designs to PDF templates",
		href: "/figma-converter",
		icon: <ToolOutlined style={{ fontSize: "2rem" }} />,
		new: true,
	},
]

export default function Home() {
	const { user } = useAuth()

	return (
		<main className="container mx-auto min-h-screen py-12">
			<div className="mb-12 text-center">
				<Title>أهلًا {user?.displayName?.split(" ")[0]} {getGreetingEmoji()}</Title>
				<p className="text-lg text-gray-600">Choose a tool to get started</p>
			</div>

			<Row gutter={[24, 24]} className="max-w-6xl mx-auto">
				{tools.map((tool) => (
					<Col xs={24} sm={12} lg={6} key={tool.href}>
						<Link href={tool.href}>
							<Card
								hoverable
								className="h-full text-center transition-all hover:shadow-lg"
							>
								<div className="mb-4 flex justify-center text-blue-500">
									{tool.icon}
								</div>
								<h3 className="mb-2 text-lg font-semibold">
									{tool.title}
									{tool.new && (
										<span className="ml-2 rounded bg-green-500 px-2 py-0.5 text-xs text-white">
											NEW
										</span>
									)}
								</h3>
								<p className="text-sm text-gray-600">{tool.description}</p>
							</Card>
						</Link>
					</Col>
				))}
			</Row>
		</main>
	)
}
