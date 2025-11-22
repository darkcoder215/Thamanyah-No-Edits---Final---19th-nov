import Link from "next/link"
import { GithubOutlined, ToolOutlined } from "@ant-design/icons"
import { Button } from "antd"

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
			<div className="max-w-4xl text-center">
				<div className="mb-8 flex justify-center">
					<ToolOutlined className="text-8xl text-blue-500" />
				</div>

				<h1 className="mb-4 text-6xl font-bold text-gray-900">Figma Template Converter</h1>

				<p className="mb-8 text-xl text-gray-600">
					Transform your Figma designs into fillable PDF templates with AI-powered
					conversion using Claude Sonnet 4.5
				</p>

				<div className="mb-12 flex justify-center gap-4">
					<Link href="/figma-converter">
						<Button type="primary" size="large" icon={<ToolOutlined />}>
							Launch Converter
						</Button>
					</Link>
					<Button
						size="large"
						icon={<GithubOutlined />}
						href="https://github.com"
						target="_blank"
					>
						View on GitHub
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
					<div className="rounded-lg bg-white p-6 shadow-md">
						<h3 className="mb-2 text-lg font-semibold text-gray-900">
							🎨 AI-Powered Conversion
						</h3>
						<p className="text-gray-600">
							Upload Figma JSX and screenshots - Claude Sonnet 4.5 converts them to
							pixel-perfect Tailwind CSS
						</p>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-md">
						<h3 className="mb-2 text-lg font-semibold text-gray-900">
							📝 Auto Field Detection
						</h3>
						<p className="text-gray-600">
							Automatically identifies fillable fields in your design and maps them to
							form inputs
						</p>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-md">
						<h3 className="mb-2 text-lg font-semibold text-gray-900">📄 PDF Export</h3>
						<p className="text-gray-600">
							Generate professional PDFs directly from your browser using native print
							capabilities
						</p>
					</div>
				</div>
			</div>
		</main>
	)
}
