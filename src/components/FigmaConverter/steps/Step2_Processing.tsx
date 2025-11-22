"use client"

import React, { useEffect, useState } from "react"
import { convertFigmaToTailwind } from "@/app/actions/figma-converter"
import { type ConversionResult } from "@/types/figma"
import { type WizardData } from "@/types/template"
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	LoadingOutlined,
	WarningOutlined,
} from "@ant-design/icons"
import { Alert, Button, Progress, Spin } from "antd"
import { FigmaConverterError, errorMessages } from "@/utils/errorHandler"

interface Step2Props {
	wizardData: WizardData
	onNext: (data: Partial<WizardData>) => void
	onPrev: () => void
}

export default function Step2_Processing({ wizardData, onNext, onPrev }: Step2Props) {
	const [progress, setProgress] = useState(0)
	const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
	const [message, setMessage] = useState("Initializing...")
	const [result, setResult] = useState<ConversionResult | null>(null)
	const [error, setError] = useState<FigmaConverterError | null>(null)

	useEffect(() => {
		if (!wizardData.step1) {
			setStatus("error")
			setMessage("No input data found. Please go back and fill the form.")
			return
		}

		processConversion()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const processConversion = async () => {
		if (!wizardData.step1) return

		try {
			setProgress(10)
			setMessage("Sending request to AI...")

			// Simulate progress updates
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval)
						return 90
					}
					return prev + 5
				})
			}, 500)

			// Call the AI conversion
			const conversionResult = await convertFigmaToTailwind(wizardData.step1)

			clearInterval(progressInterval)
			setProgress(100)
			setMessage("Conversion complete!")
			setStatus("success")
			setResult(conversionResult)

			// Auto-proceed after 1 second
			setTimeout(() => {
				onNext({ step2: conversionResult })
			}, 1000)
		} catch (err) {
			setStatus("error")
			setProgress(0)

			// Log full error details to console for debugging
			console.error("[Step2] Full error details:", err)
			console.error("[Step2] Error type:", typeof err)
			console.error(
				"[Step2] Error stringified:",
				JSON.stringify(err, Object.getOwnPropertyNames(err)),
			)

			if (err instanceof FigmaConverterError) {
				setError(err)
				setMessage(err.message)
			} else if (err instanceof Error) {
				// Create a custom error to show full details
				const customError = new FigmaConverterError(
					`${err.message}\n\nStack: ${err.stack || "No stack trace"}`,
					ErrorCode.AI_ERROR,
				)
				setError(customError)
				setMessage(err.message)
			} else {
				setMessage(`An unexpected error occurred: ${JSON.stringify(err)}`)
			}
		}
	}

	const handleRetry = () => {
		setStatus("processing")
		setProgress(0)
		setError(null)
		processConversion()
	}

	return (
		<div className="py-8">
			<h2 className="mb-6 text-2xl font-semibold">AI Processing</h2>

			{/* Progress Bar */}
			<div className="mb-8">
				<Progress
					percent={progress}
					status={
						status === "error"
							? "exception"
							: status === "success"
								? "success"
								: "active"
					}
					strokeColor={
						status === "error"
							? "#ff4d4f"
							: status === "success"
								? "#52c41a"
								: "#1890ff"
					}
				/>
			</div>

			{/* Status Message */}
			<div className="mb-8 text-center">
				{status === "processing" && (
					<div className="flex items-center justify-center gap-3">
						<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
						<span className="text-lg text-gray-600">{message}</span>
					</div>
				)}

				{status === "success" && (
					<div className="flex items-center justify-center gap-3 text-green-600">
						<CheckCircleOutlined style={{ fontSize: 32 }} />
						<span className="text-lg font-medium">{message}</span>
					</div>
				)}

				{status === "error" && (
					<div className="flex items-center justify-center gap-3 text-red-600">
						<WarningOutlined style={{ fontSize: 32 }} />
						<span className="text-lg font-medium">{message}</span>
					</div>
				)}
			</div>

			{/* Error Details */}
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
					className="mb-6"
				/>
			)}

			{/* Result Preview */}
			{result && status === "success" && (
				<Alert
					type="success"
					message="Conversion Successful"
					description={
						<div>
							<p className="mb-2">✓ JSX code generated</p>
							<p className="mb-2">
								✓ {result.fields.length} fillable fields detected
							</p>
							<p className="mb-2">
								✓ {result.tailwindClasses.length} Tailwind classes used
							</p>
							{result.warnings && result.warnings.length > 0 && (
								<div className="mt-3">
									<p className="font-semibold">Warnings:</p>
									<ul className="list-inside list-disc">
										{result.warnings.map((warning, idx) => (
											<li key={idx} className="text-sm">
												{warning}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					}
					className="mb-6"
				/>
			)}

			{/* Actions */}
			<div className="flex justify-between pt-4">
				<Button onClick={onPrev} icon={<ArrowLeftOutlined />}>
					Back
				</Button>

				{status === "error" && (
					<Button type="primary" onClick={handleRetry}>
						Retry
					</Button>
				)}
			</div>
		</div>
	)
}
