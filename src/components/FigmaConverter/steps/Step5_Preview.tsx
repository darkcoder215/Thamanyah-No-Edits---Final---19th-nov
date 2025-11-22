"use client"

import React, { useState } from "react"
import { Button, Tabs, Alert, Form, Input, InputNumber, message } from "antd"
import {
	ArrowLeftOutlined,
	DownloadOutlined,
	CodeOutlined,
	EyeOutlined,
	SaveOutlined,
} from "@ant-design/icons"
import { type WizardData } from "@/types/template"
import { type TemplateField } from "@/types/field"
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
	const [showDimensions, setShowDimensions] = useState(false)

	const fields = wizardData.step3 || []
	const jsx = wizardData.step2?.jsx || ""

	const handleFormChange = (changedValues: Record<string, unknown>) => {
		setFormData((prev) => ({ ...prev, ...changedValues }))
	}

	const handleDownloadPDF = () => {
		setShowDimensions(false)
		setTimeout(() => {
			window.print()
		}, 100)
	}

	const handleSaveTemplate = () => {
		// TODO: Implement template saving to localStorage/database
		message.success("Template saved successfully!")
	}

	// Create a simple preview by rendering the JSX as HTML
	const renderPreview = () => {
		try {
			// Replace field markers with form data
			let previewHTML = jsx

			fields.forEach((field) => {
				const value = formData[field.name] || field.defaultValue || field.placeholder || ""
				const marker = `data-field="${field.name}"`
				const regex = new RegExp(`<([^>]+)${marker}([^>]*)>([^<]*)</\\1>`, "g")
				previewHTML = previewHTML.replace(
					regex,
					`<$1$2>${value}</$1>`,
				)
			})

			return (
				<div
					dangerouslySetInnerHTML={{ __html: previewHTML }}
					className="preview-content border rounded p-4 bg-white min-h-[500px]"
				/>
			)
		} catch (error) {
			return (
				<Alert
					type="error"
					message="Preview Error"
					description="Failed to render preview. Please check the generated code."
				/>
			)
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
							<div className="border rounded bg-gray-50 p-4 overflow-auto max-h-[600px]">
								{renderPreview()}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-between mt-6 pt-4 border-t">
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
							>
								Download as PDF
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

			{/* Print CSS */}
			<style jsx global>{`
				@media print {
					.no-print,
					.ant-tabs,
					button,
					.hide-print {
						display: none !important;
					}

					.preview-content {
						border: none !important;
						padding: 0 !important;
						min-height: auto !important;
					}

					* {
						-webkit-print-color-adjust: exact !important;
						print-color-adjust: exact !important;
					}

					@page {
						size: A4;
						margin: 0;
					}

					body {
						background: white !important;
					}
				}
			`}</style>
		</div>
	)
}
