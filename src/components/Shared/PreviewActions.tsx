import React, { useState } from "react"
import { Button, Checkbox, Tooltip, message } from "antd"

interface PreviewActionsProps {
	onEdit: () => void
	onFileUpload: (file: File) => Promise<void>
	email?: string
}

const PreviewActions: React.FC<PreviewActionsProps> = ({ onEdit, onFileUpload, email }) => {
	const [loading, setLoading] = useState(false)
	const [sendDisabled, isSendDisabled] = useState(true)
	const [designMode, setDesignMode] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()

	const toggleDesignMode = (checked: boolean) => {
		setDesignMode(checked)
		if (typeof document !== "undefined") {
			document.designMode = checked ? "on" : "off"
		}
	}

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setLoading(true)
			try {
				await onFileUpload(file)
				messageApi.success({
					content: "تم رفع الملف بنجاح!",
					duration: 8,
				})
				isSendDisabled(true)
			} catch (error) {
				console.error("Error uploading file:", error)
				messageApi.error({
					content: "فشل رفع الملف. يرجى المحاولة مرة أخرى.",
					duration: 8,
				})
			} finally {
				setLoading(false)
			}
		}
	}

	return (
		<div className="hide-print fixed-bottom fixed right-1/2 bottom-2 flex translate-x-1/2 items-center justify-center gap-x-2 rounded-xl bg-black/70 p-2 text-center backdrop-blur-xs">
			{contextHolder}
			<Button type="default" onClick={onEdit}>
				تعديل
			</Button>
			<Button
				type="primary"
				onClick={() => {
					window.print()
					isSendDisabled(false)
				}}
			>
				1. حمّل العرض
			</Button>
			<Tooltip
				title="يجب رفع الملف أولاً قبل الإرسال."
				open={sendDisabled ? undefined : false}
			>
				<Button
					type="primary"
					onClick={() => document.getElementById("pdf-upload")?.click()}
					loading={loading}
					disabled={sendDisabled || !email}
				>
					2. أرسله لبريد الموظف
				</Button>
			</Tooltip>
			<input
				id="pdf-upload"
				type="file"
				accept="application/pdf"
				style={{ display: "none" }}
				onChange={handleFileUpload}
			/>
			<Tooltip title="تفعيل وضع التحرير المباشر في المتصفح">
				<Checkbox checked={designMode} onChange={(e) => toggleDesignMode(e.target.checked)}>
					🪄 تعديل سريع؟
				</Checkbox>
			</Tooltip>
		</div>
	)
}

export default PreviewActions
