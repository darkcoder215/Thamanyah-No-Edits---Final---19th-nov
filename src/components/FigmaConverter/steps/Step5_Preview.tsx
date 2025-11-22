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
	const [iframeReady, setIframeReady] = useState(false)
	const iframeRef = useRef<HTMLIFrameElement>(null)

	const fields = wizardData.step3 || []
	const jsx = wizardData.step2?.jsx || ""
	const dimensions = wizardData.step2?.dimensions || { width: "595px", height: "842px" }

	// Debug: Log what data we have
	console.log("[Step5] Component mounted/updated")
	console.log("[Step5] JSX available:", !!jsx)
	console.log("[Step5] JSX length:", jsx.length)
	console.log("[Step5] Fields count:", fields.length)
	console.log("[Step5] Dimensions:", dimensions)

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
		console.log("[Step5] useEffect triggered - jsx length:", jsx.length)

		if (!iframeRef.current) {
			console.log("[Step5] iframeRef.current is null")
			return
		}

		if (!jsx || jsx.trim().length === 0) {
			console.log("[Step5] No JSX to render")
			return
		}

		const iframe = iframeRef.current
		const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

		if (!iframeDoc) {
			console.error("[Step5] Cannot access iframe document")
			return
		}

		try {
			let previewHTML = getPreviewHTML()

			if (!previewHTML || previewHTML.trim().length === 0) {
				console.error("[Step5] Preview HTML is empty!")
				return
			}

			console.log("[Step5] Preview HTML length:", previewHTML.length)
			console.log(
				"[Step5] Preview HTML sample (before transform):",
				previewHTML.substring(0, 200),
			)

			// CRITICAL FIX: Convert JSX syntax to HTML syntax
			// React uses "className", but HTML iframes need "class"
			previewHTML = previewHTML.replace(/className=/g, "class=")

			console.log(
				"[Step5] Preview HTML sample (after transform):",
				previewHTML.substring(0, 200),
			)

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
		// Configure Tailwind
		tailwind.config = {
			theme: {
				extend: {}
			}
		}

		// Debug logging
		console.log('[Iframe] Tailwind CDN loaded')
		window.addEventListener('load', () => {
			console.log('[Iframe] Page fully loaded')
			console.log('[Iframe] Preview container:', document.getElementById('preview-container'))
		})

		// Error handling
		window.addEventListener('error', (e) => {
			console.error('[Iframe] Error:', e.error || e.message)
		})
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
	<script>
		// Log after DOM is ready
		console.log('[Iframe] DOM loaded, container HTML:', document.getElementById('preview-container')?.innerHTML?.substring(0, 200))
	</script>
</body>
</html>
			`

			// Write to iframe
			iframeDoc.open()
			iframeDoc.write(htmlContent)
			iframeDoc.close()

			console.log("[Step5] Iframe updated successfully")

			// Mark iframe as ready after content is written
			setIframeReady(true)

			// Wait for iframe to load, then check if Tailwind processed
			setTimeout(() => {
				const container = iframeDoc.getElementById("preview-container")
				if (container) {
					const firstDiv = container.querySelector("div")
					if (firstDiv) {
						const computedStyle = iframe.contentWindow?.getComputedStyle(firstDiv)
						console.log("[Step5] First div computed width:", computedStyle?.width)
						console.log("[Step5] First div classes:", firstDiv.className)
					}
				}
			}, 1000)
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

							{!jsx || jsx.trim().length === 0 ? (
								<Alert
									type="error"
									message="No JSX Code Available"
									description="The conversion step did not generate any JSX code. Please go back and run the conversion again."
									showIcon
								/>
							) : (
								<div className="relative overflow-auto rounded border bg-gray-100">
									<iframe
										ref={iframeRef}
										className="h-[900px] w-full border-0"
										title="Template Preview"
										sandbox="allow-same-origin allow-scripts"
									/>
									{!iframeReady && (
										<div className="bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white">
											<div className="text-center">
												<div className="mb-2 text-lg">
													Loading preview...
												</div>
												<div className="text-sm text-gray-500">
													Initializing Tailwind CSS
												</div>
											</div>
										</div>
									)}
								</div>
							)}
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
					<div className="mb-4 space-y-3">
						<Alert
							type="success"
							message="Code Generated Successfully"
							description="You can copy this code and use it in your React project."
						/>
						<Alert
							type="info"
							message="AI Generation Details"
							description={
								<div className="space-y-1 text-sm">
									<div>
										<strong>JSX Length:</strong> {jsx.length} characters
									</div>
									<div>
										<strong>Fields Detected:</strong> {fields.length} fillable
										fields
									</div>
									<div>
										<strong>Dimensions:</strong> {dimensions.width} ×{" "}
										{dimensions.height}
									</div>
									<div>
										<strong>Layout Strategy:</strong>{" "}
										{jsx.includes("absolute")
											? "Absolute Positioning"
											: "Flexbox/Grid"}
									</div>
									<div className="mt-2 text-xs text-gray-500">
										💡 Check Vercel Runtime Logs to see the full raw AI response
									</div>
								</div>
							}
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

					<div className="mt-4 flex justify-end gap-3">
						<Button
							onClick={() => {
								// Download as .jsx file
								const blob = new Blob([jsx], { type: "text/plain" })
								const url = URL.createObjectURL(blob)
								const a = document.createElement("a")
								a.href = url
								a.download = `generated-component-${new Date().toISOString().slice(0, 10)}.jsx`
								document.body.appendChild(a)
								a.click()
								document.body.removeChild(a)
								URL.revokeObjectURL(url)
								message.success("JSX file downloaded!")
							}}
							icon={<DownloadOutlined />}
						>
							Download JSX
						</Button>
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
