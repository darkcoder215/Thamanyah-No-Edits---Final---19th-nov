"use client"

import React, { useState } from "react"
import { type FigmaInput, type TextStyles } from "@/types/figma"
import { type WizardData } from "@/types/template"
import { ArrowRightOutlined, InboxOutlined } from "@ant-design/icons"
import { Alert, Button, Form, Input, InputNumber, Upload, message } from "antd"
import {
	FigmaConverterError,
	errorMessages,
	validateDimensions,
	validateImage,
	validateJSX,
} from "@/utils/errorHandler"

const { TextArea } = Input
const { Dragger } = Upload

interface Step1Props {
	wizardData: WizardData
	onNext: (data: Partial<WizardData>) => void
	onPrev: () => void
}

export default function Step1_Input({ wizardData, onNext }: Step1Props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [screenshot, setScreenshot] = useState<File | null>(null)
	const [error, setError] = useState<FigmaConverterError | null>(null)

	const handleSubmit = async (values: {
		jsx: string
		textStyles: string
		width: number
		height: number
		pageCount: number
	}) => {
		setError(null)
		setLoading(true)

		try {
			// Validate JSX
			validateJSX(values.jsx)

			// Validate screenshot
			if (!screenshot) {
				throw new Error("Screenshot is required")
			}
			validateImage(screenshot)

			// Validate dimensions
			validateDimensions(values.width, values.height)

			// Parse text styles if JSON
			let textStyles: string | TextStyles = values.textStyles
			try {
				textStyles = JSON.parse(values.textStyles)
			} catch {
				// Keep as string if not valid JSON
			}

			const figmaInput: FigmaInput = {
				jsx: values.jsx,
				textStyles,
				screenshot,
				dimensions: {
					width: values.width,
					height: values.height,
				},
				pageCount: values.pageCount || 1,
			}

			// Move to next step
			onNext({ step1: figmaInput })
		} catch (err) {
			if (err instanceof FigmaConverterError) {
				setError(err)
			} else {
				message.error(err instanceof Error ? err.message : "Validation failed")
			}
		} finally {
			setLoading(false)
		}
	}

	const handleScreenshotUpload = (file: File) => {
		try {
			validateImage(file)
			setScreenshot(file)
			message.success("Screenshot uploaded successfully")
		} catch (err) {
			if (err instanceof FigmaConverterError) {
				message.error(err.message)
			}
		}
		return false // Prevent auto upload
	}

	return (
		<div>
			<h2 className="mb-6 text-2xl font-semibold">Input Figma Design</h2>

			{error && (
				<Alert
					type="error"
					message={errorMessages[error.code].title}
					description={
						<div>
							<p className="mb-2">{error.message}</p>
							<p className="text-sm text-gray-600">
								{errorMessages[error.code].suggestion}
							</p>
						</div>
					}
					closable
					onClose={() => setError(null)}
					className="mb-6"
				/>
			)}

			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{
					width: 1920,
					height: 1080,
					pageCount: 1,
				}}
			>
				{/* JSX Code */}
				<Form.Item
					label="Figma JSX Code"
					name="jsx"
					rules={[{ required: true, message: "Please paste your Figma JSX code" }]}
					tooltip="Copy the code from Figma Dev mode and paste it here"
				>
					<TextArea
						rows={10}
						placeholder={`<div className="frame">
  <h1>Employee Name</h1>
  <p>Job Title</p>
  ...
</div>`}
						className="font-mono text-sm"
					/>
				</Form.Item>

				{/* Text Styles */}
				<Form.Item
					label="Text Styles (JSON or Plain Text)"
					name="textStyles"
					rules={[{ required: true, message: "Please provide text styles" }]}
					tooltip="Copy the text styles from Figma or paste as JSON"
				>
					<TextArea
						rows={6}
						placeholder={`{
  "heading": {
    "fontFamily": "Arial",
    "fontSize": 24,
    "fontWeight": 700
  }
}`}
						className="font-mono text-sm"
					/>
				</Form.Item>

				{/* Screenshot Upload */}
				<Form.Item
					label="Screenshot"
					required
					tooltip="Upload a screenshot of the Figma design for AI reference"
				>
					<Dragger
						accept="image/png,image/jpeg,image/jpg,image/webp"
						maxCount={1}
						beforeUpload={handleScreenshotUpload}
						onRemove={() => setScreenshot(null)}
					>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag screenshot here</p>
						<p className="ant-upload-hint">PNG, JPG, or WebP (max 10MB)</p>
					</Dragger>
				</Form.Item>

				{/* Dimensions */}
				<div className="grid grid-cols-2 gap-4">
					<Form.Item
						label="Width (px)"
						name="width"
						rules={[
							{ required: true, message: "Width is required" },
							{ type: "number", min: 1, message: "Width must be positive" },
						]}
					>
						<InputNumber className="w-full" min={1} max={10000} />
					</Form.Item>

					<Form.Item
						label="Height (px)"
						name="height"
						rules={[
							{ required: true, message: "Height is required" },
							{ type: "number", min: 1, message: "Height must be positive" },
						]}
					>
						<InputNumber className="w-full" min={1} max={10000} />
					</Form.Item>
				</div>

				{/* Page Count */}
				<Form.Item
					label="Number of Pages"
					name="pageCount"
					tooltip="How many pages should this template have?"
					rules={[{ required: true, message: "Page count is required" }]}
				>
					<InputNumber className="w-full" min={1} max={10} />
				</Form.Item>

				{/* Actions */}
				<div className="flex justify-end gap-3 pt-4">
					<Button type="primary" htmlType="submit" loading={loading} size="large">
						Next: Process with AI <ArrowRightOutlined />
					</Button>
				</div>
			</Form>
		</div>
	)
}
