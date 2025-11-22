"use client"

import React, { useEffect, useRef, useState } from "react"
import { type WizardData } from "@/types/template"
import {
	ArrowLeftOutlined,
	CodeOutlined,
	DownloadOutlined,
	EyeOutlined,
	SaveOutlined,
} from "@ant-design/icons"
import { Alert, Button, Form, Input, InputNumber, Tabs, message } from "antd"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

const { TabPane } = Tabs

interface Step5Props {
	wizardData: WizardData
	onNext: (data: Partial<WizardData>) => void
	onPrev: () => void
}

export default function Step5_Preview({ wizardData, onNext, onPrev }: Step5Props) {
	const [form] = Form.useForm()
	const [formData, setFormData] = useState<Record<string, unknown>>({})
	const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
	const iframeRef = useRef<HTMLIFrameElement>(null)

	const fields = wizardData.step3 || []
	const jsx = wizardData.step2?.jsx || ""
	const dimensions = wizardData.step2?.dimensions || { width: "595px", height: "842px" }

	const handleFormChange = (changedValues: Record<string, unknown>) => {
		setFormData((prev) => ({ ...prev, ...changedValues }))
	}

	// Generate preview HTML with filled form data
	const getPreviewHTML = () => {
		try {
			let previewHTML = jsx

			// Replace field markers with form data
			fields.forEach((field) => {
				const value = formData[field.name] || field.defaultValue || field.placeholder || ""
				const marker = `data-field="${field.name}"`
				const regex = new RegExp(`<([^>]+)${marker}([^>]*)>([^<]*)</\\1>`, "g")
				previewHTML = previewHTML.replace(regex, `<$1$2>${value}</$1>`)
			})

			return previewHTML
		} catch (error) {
			console.error("[Step5] Error generating preview HTML:", error)
			return ""
		}
	}

	// Update iframe content whenever formData or jsx changes
	useEffect(() => {
		if (!iframeRef.current) return

		const iframe = iframeRef.current
		const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

		if (!iframeDoc) {
			console.error("[Step5] Cannot access iframe document")
			return
		}

		try {
			const previewHTML = getPreviewHTML()

			// Create complete HTML document with Tailwind CDN
			const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Preview</title>
	<!-- Tailwind CDN with all features enabled -->
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			theme: {
				extend: {
					// Enable all arbitrary values
				}
			}
		}
	</script>
	<style>
		* {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
		body {
			margin: 0;
			padding: 20px;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			min-height: 100vh;
			background: #f5f5f5;
		}
		#preview-container {
			background: white;
			box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		}
	</style>
</head>
<body>
	<div id="preview-container">
		${previewHTML}
	</div>
</body>
</html>
			`

			// Write to iframe
			iframeDoc.open()
			iframeDoc.write(htmlContent)
			iframeDoc.close()

			console.log("[Step5] Iframe updated successfully")
		} catch (error) {
			console.error("[Step5] Error updating iframe:", error)
		}
	}, [jsx, formData, fields])

	const handleDownloadPDF = async () => {
		if (!iframeRef.current) {
			message.error("Preview not ready. Please wait and try again.")
			return
		}

		setIsGeneratingPDF(true)

		try {
			console.log("[Step5] Starting PDF generation...")

			const iframe = iframeRef.current
			const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

			if (!iframeDoc) {
				throw new Error("Cannot access iframe document")
			}

			const previewContainer = iframeDoc.getElementById("preview-container")

			if (!previewContainer) {
				throw new Error("Preview container not found in iframe")
			}

			console.log("[Step5] Capturing preview as canvas...")

			// Capture the preview container as canvas
			const canvas = await html2canvas(previewContainer, {
				scale: 2, // Higher quality
				useCORS: true,
				allowTaint: true,
				backgroundColor: "#ffffff",
				logging: true,
			})

			console.log("[Step5] Canvas captured, creating PDF...")

			// Parse dimensions
			const widthPx = parseFloat(dimensions.width)
			const heightPx = parseFloat(dimensions.height)

			// Convert pixels to mm (assuming 96 DPI)
			const widthMm = (widthPx * 25.4) / 96
			const heightMm = (heightPx * 25.4) / 96

			// Create PDF with exact dimensions
			const pdf = new jsPDF({
				orientation: heightPx > widthPx ? "portrait" : "landscape",
				unit: "mm",
				format: [widthMm, heightMm],
			})

			// Add canvas as image to PDF
			const imgData = canvas.toDataURL("image/png")
			pdf.addImage(imgData, "PNG", 0, 0, widthMm, heightMm)

			// Download PDF
			const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
			pdf.save(`template-${timestamp}.pdf`)

			console.log("[Step5] PDF generated successfully!")
			message.success("PDF downloaded successfully!")
		} catch (error) {
			console.error("[Step5] PDF generation error:", error)
			message.error(
				`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
			)
		} finally {
			setIsGeneratingPDF(false)
		}
	}

	const handleSaveTemplate = () => {
		try {
			// Save to localStorage
			const template = {
				jsx,
				fields,
				dimensions,
				createdAt: new Date().toISOString(),
			}

			const existingTemplates = JSON.parse(localStorage.getItem("saved-templates") || "[]")
			existingTemplates.push(template)
			localStorage.setItem("saved-templates", JSON.stringify(existingTemplates))

			message.success("Template saved successfully!")
			console.log("[Step5] Template saved to localStorage")
		} catch (error) {
			console.error("[Step5] Error saving template:", error)
			message.error("Failed to save template")
		}
	}

	return (
		<div>
			<h2 className="mb-6 text-2xl font-semibold">Preview & Export</h2>

			<Tabs defaultActiveKey="preview">
				{/* Preview Tab */}
				<TabPane
					tab={
						<span>
							<EyeOutlined /> Live Preview
						</span>
					}
					key="preview"
				>
					<div className="grid grid-cols-2 gap-6">
						{/* Form */}
						<div>
							<h3 className="mb-4 text-lg font-semibold">Fill Template Data</h3>

							{fields.length === 0 ? (
								<Alert
									type="info"
									message="No fillable fields"
									description="This template has no dynamic fields. You can still download it as PDF."
								/>
							) : (
								<Form
									form={form}
									layout="vertical"
									onValuesChange={handleFormChange}
								>
									{fields.map((field) => (
										<Form.Item
											key={field.id}
											label={field.label}
											name={field.name}
											rules={[
												{
													required: field.required,
													message: `${field.label} is required`,
												},
											]}
										>
											{field.type === "number" ? (
												<InputNumber
													className="w-full"
													placeholder={field.placeholder}
												/>
											) : field.type === "array" ? (
												<Input.TextArea
													rows={3}
													placeholder={
														field.placeholder ||
														"Enter items separated by newlines"
													}
												/>
											) : (
												<Input
													type={field.type}
													placeholder={field.placeholder}
												/>
											)}
										</Form.Item>
									))}
								</Form>
							)}
						</div>

						{/* Preview */}
						<div>
							<h3 className="mb-4 text-lg font-semibold">Preview</h3>
							<div className="overflow-auto rounded border bg-gray-100">
								<iframe
									ref={iframeRef}
									className="h-[900px] w-full border-0"
									title="Template Preview"
									sandbox="allow-same-origin"
								/>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="mt-6 flex justify-between border-t pt-4">
						<Button onClick={onPrev} icon={<ArrowLeftOutlined />}>
							Back
						</Button>

						<div className="flex gap-3">
							<Button onClick={handleSaveTemplate} icon={<SaveOutlined />}>
								Save Template
							</Button>
							<Button
								type="primary"
								onClick={handleDownloadPDF}
								icon={<DownloadOutlined />}
								loading={isGeneratingPDF}
								disabled={isGeneratingPDF}
							>
								{isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
							</Button>
						</div>
					</div>
				</TabPane>

				{/* Code Tab */}
				<TabPane
					tab={
						<span>
							<CodeOutlined /> Generated Code
						</span>
					}
					key="code"
				>
					<div className="mb-4">
						<Alert
							type="success"
							message="Code Generated Successfully"
							description="You can copy this code and use it in your React project."
						/>
					</div>

					<SyntaxHighlighter
						language="jsx"
						style={vscDarkPlus}
						customStyle={{
							borderRadius: "8px",
							fontSize: "14px",
							maxHeight: "600px",
						}}
						showLineNumbers
					>
						{jsx}
					</SyntaxHighlighter>

					<div className="mt-4 flex justify-end">
						<Button
							onClick={() => {
								navigator.clipboard.writeText(jsx)
								message.success("Code copied to clipboard!")
							}}
						>
							Copy Code
						</Button>
					</div>
				</TabPane>
			</Tabs>
		</div>
	)
}
