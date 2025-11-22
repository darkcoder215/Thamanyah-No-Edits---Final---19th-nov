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

			console.log("[Step5] Starting getPreviewHTML - original JSX length:", jsx.length)

			// EDGE CASE 1: Strip component wrapper if AI still included it
			// Check for patterns like: const ComponentName = () => { return ( ... ); };
			const componentWrapperPattern =
				/const\s+\w+\s*=\s*\(\)\s*=>\s*\{[\s\n]*return\s*\(([\s\S]*)\);?[\s\n]*\};?/
			if (componentWrapperPattern.test(previewHTML)) {
				console.warn("[Step5] DETECTED COMPONENT WRAPPER - Stripping it out")
				const match = previewHTML.match(componentWrapperPattern)
				if (match && match[1]) {
					previewHTML = match[1].trim()
					console.log("[Step5] Stripped wrapper, new JSX length:", previewHTML.length)
				}
			}

			// EDGE CASE 2: Strip export statements
			previewHTML = previewHTML.replace(/export\s+default\s+\w+;?/g, "").trim()

			// EDGE CASE 3: Replace field markers with form data
			console.log(`[Step5] Replacing ${fields.length} field markers`)
			fields.forEach((field) => {
				const value = formData[field.name] || field.defaultValue || field.placeholder || ""
				const marker = `data-field="${field.name}"`
				const regex = new RegExp(`<([^>]+)${marker}([^>]*)>([^<]*)</\\1>`, "g")
				const beforeReplace = previewHTML
				previewHTML = previewHTML.replace(regex, `<$1$2>${value}</$1>`)
				if (beforeReplace !== previewHTML) {
					console.log(`[Step5] Replaced field: ${field.name} with value: ${value}`)
				}
			})

			console.log("[Step5] getPreviewHTML complete - final length:", previewHTML.length)
			return previewHTML
		} catch (error) {
			console.error("[Step5] CRITICAL ERROR in getPreviewHTML:", error)
			console.error("[Step5] Error stack:", error instanceof Error ? error.stack : "No stack")
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
			console.log("[Step5] ========== STARTING IFRAME RENDER ==========")
			let previewHTML = getPreviewHTML()

			// VALIDATION 1: Check if HTML is empty
			if (!previewHTML || previewHTML.trim().length === 0) {
				console.error("[Step5] VALIDATION FAILED: Preview HTML is empty!")
				console.error("[Step5] Original JSX length:", jsx.length)
				console.error("[Step5] Original JSX sample:", jsx.substring(0, 300))
				return
			}
			console.log("[Step5] ✓ Validation passed: HTML is not empty")

			// VALIDATION 2: Check if it looks like valid HTML/JSX
			if (!previewHTML.includes("<div") && !previewHTML.includes("<span")) {
				console.error("[Step5] VALIDATION FAILED: No HTML elements found!")
				console.error("[Step5] Preview HTML:", previewHTML.substring(0, 500))
				return
			}
			console.log("[Step5] ✓ Validation passed: Contains HTML elements")

			console.log("[Step5] Preview HTML length:", previewHTML.length)
			console.log(
				"[Step5] Preview HTML sample (before transform):",
				previewHTML.substring(0, 200),
			)

			// TRANSFORMATION 1: Convert JSX syntax to HTML syntax
			// React uses "className", but HTML iframes need "class"
			const classNameCount = (previewHTML.match(/className=/g) || []).length
			console.log(`[Step5] Found ${classNameCount} instances of 'className' to convert`)
			previewHTML = previewHTML.replace(/className=/g, "class=")

			// TRANSFORMATION 2: Handle any remaining JSX artifacts
			// Convert self-closing tags that might have /> without space
			previewHTML = previewHTML.replace(/(\w)\/>/g, "$1 />")

			console.log(
				"[Step5] Preview HTML sample (after transform):",
				previewHTML.substring(0, 200),
			)
			console.log("[Step5] ✓ Transformations complete")

			// Create complete HTML document with Tailwind CDN
			console.log("[Step5] Building iframe HTML document...")
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
		// Tailwind Configuration
		tailwind.config = {
			theme: {
				extend: {}
			}
		}

		// COMPREHENSIVE ERROR & DEBUG LOGGING
		let tailwindLoaded = false;
		let domReady = false;

		// Check if Tailwind loaded
		if (typeof tailwind !== 'undefined') {
			console.log('[Iframe] ✓ Tailwind CDN script loaded successfully');
			tailwindLoaded = true;
		} else {
			console.error('[Iframe] ✗ CRITICAL: Tailwind CDN failed to load!');
		}

		// DOM ready check
		window.addEventListener('DOMContentLoaded', () => {
			domReady = true;
			console.log('[Iframe] ✓ DOM Content Loaded');

			const container = document.getElementById('preview-container');
			if (container) {
				console.log('[Iframe] ✓ Preview container found');
				console.log('[Iframe] Container children count:', container.children.length);
				console.log('[Iframe] Container HTML sample:', container.innerHTML.substring(0, 200));
			} else {
				console.error('[Iframe] ✗ Preview container NOT found!');
			}
		});

		// Full page load check
		window.addEventListener('load', () => {
			console.log('[Iframe] ✓ Page fully loaded');
			console.log('[Iframe] Status - Tailwind:', tailwindLoaded, 'DOM:', domReady);

			// Verify styles are applied
			const firstDiv = document.querySelector('#preview-container > div');
			if (firstDiv) {
				const computed = window.getComputedStyle(firstDiv);
				console.log('[Iframe] First div computed styles:');
				console.log('[Iframe]   - width:', computed.width);
				console.log('[Iframe]   - height:', computed.height);
				console.log('[Iframe]   - position:', computed.position);
				console.log('[Iframe]   - background:', computed.backgroundColor);
			}
		});

		// Catch all errors
		window.addEventListener('error', (e) => {
			console.error('[Iframe] ✗ ERROR:', e.error || e.message);
			console.error('[Iframe] Error details:', {
				message: e.message,
				filename: e.filename,
				lineno: e.lineno,
				colno: e.colno
			});
		});

		// Unhandled promise rejections
		window.addEventListener('unhandledrejection', (e) => {
			console.error('[Iframe] ✗ UNHANDLED PROMISE REJECTION:', e.reason);
		});
	</script>
	<style>
		* {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
		body {
			margin: 0;
			padding: 0;
			background: #f5f5f5;
		}
		#preview-container {
			/* Don't interfere with absolute positioning */
			position: relative;
			display: inline-block;
			margin: 20px;
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

			console.log("[Step5] ✓ HTML document built, length:", htmlContent.length)

			// Write to iframe with error handling
			console.log("[Step5] Writing HTML to iframe...")
			try {
				iframeDoc.open()
				iframeDoc.write(htmlContent)
				iframeDoc.close()
				console.log("[Step5] ✓ Iframe document written and closed successfully")
			} catch (writeError) {
				console.error("[Step5] ✗ CRITICAL: Failed to write to iframe!", writeError)
				console.error(
					"[Step5] Write error stack:",
					writeError instanceof Error ? writeError.stack : "No stack",
				)
				throw writeError
			}

			// Mark iframe as ready after content is written
			setIframeReady(true)
			console.log("[Step5] ✓ Iframe marked as ready, loading overlay will hide")

			// VERIFICATION: Wait for iframe to load, then verify Tailwind processed
			console.log("[Step5] Scheduling verification check in 1.5 seconds...")
			setTimeout(() => {
				console.log("[Step5] ========== VERIFICATION CHECK ==========")
				try {
					const container = iframeDoc.getElementById("preview-container")
					if (!container) {
						console.error("[Step5] ✗ VERIFICATION FAILED: Preview container not found!")
						return
					}
					console.log("[Step5] ✓ Preview container exists")

					const firstDiv = container.querySelector("div")
					if (!firstDiv) {
						console.error("[Step5] ✗ VERIFICATION FAILED: No div inside container!")
						console.error(
							"[Step5] Container HTML:",
							container.innerHTML.substring(0, 500),
						)
						return
					}
					console.log("[Step5] ✓ Found first div element")

					const computedStyle = iframe.contentWindow?.getComputedStyle(firstDiv)
					if (!computedStyle) {
						console.error("[Step5] ✗ VERIFICATION FAILED: Cannot get computed styles!")
						return
					}

					console.log("[Step5] ========== COMPUTED STYLES ==========")
					console.log("[Step5] Width:", computedStyle.width)
					console.log("[Step5] Height:", computedStyle.height)
					console.log("[Step5] Position:", computedStyle.position)
					console.log("[Step5] Background:", computedStyle.backgroundColor)
					console.log("[Step5] Left:", computedStyle.left)
					console.log("[Step5] Top:", computedStyle.top)
					console.log("[Step5] Classes:", firstDiv.className)
					console.log("[Step5] ========== END VERIFICATION ==========")

					// SUCCESS CHECK: If width is set correctly, Tailwind is working
					if (computedStyle.width && computedStyle.width !== "auto") {
						console.log("[Step5] ✓✓✓ SUCCESS! Tailwind classes are being applied!")
					} else {
						console.warn(
							"[Step5] ⚠ WARNING: Width is 'auto', Tailwind may not be processing classes!",
						)
					}
				} catch (verifyError) {
					console.error("[Step5] ✗ Verification check failed:", verifyError)
					console.error(
						"[Step5] Verify error stack:",
						verifyError instanceof Error ? verifyError.stack : "No stack",
					)
				}
			}, 1500)

			console.log("[Step5] ========== IFRAME RENDER COMPLETE ==========")
		} catch (error) {
			console.error("[Step5] ========== CRITICAL ERROR ==========")
			console.error("[Step5] Error updating iframe:", error)
			console.error("[Step5] Error type:", typeof error)
			console.error("[Step5] Error stack:", error instanceof Error ? error.stack : "No stack")
			console.error(
				"[Step5] Error details:",
				JSON.stringify(error, Object.getOwnPropertyNames(error)),
			)
			console.error("[Step5] ========== END ERROR ==========")
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
