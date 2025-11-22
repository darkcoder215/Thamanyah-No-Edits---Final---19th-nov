"use client"

import React, { useState } from "react"
import { type FieldType, type TemplateField } from "@/types/field"
import { type WizardData } from "@/types/template"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { Alert, Button, Input, Select, Switch, Table } from "antd"

const { Option } = Select

interface Step3Props {
	wizardData: WizardData
	onNext: (data: Partial<WizardData>) => void
	onPrev: () => void
}

export default function Step3_FieldMapping({ wizardData, onNext, onPrev }: Step3Props) {
	const [fields, setFields] = useState<TemplateField[]>(() => {
		// Convert detected fields to template fields
		const detectedFields = wizardData.step2?.fields || []
		return detectedFields.map((field, idx) => ({
			id: `field-${idx}`,
			name: field.name,
			label: field.name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
			type: field.type,
			selector: field.selector,
			required: true,
			placeholder: field.placeholder,
			defaultValue: "",
			validation: [],
		}))
	})

	const handleFieldUpdate = (id: string, updates: Partial<TemplateField>) => {
		setFields((prev) =>
			prev.map((field) => (field.id === id ? { ...field, ...updates } : field)),
		)
	}

	const handleNext = () => {
		onNext({ step3: fields })
	}

	const columns = [
		{
			title: "Field Name",
			dataIndex: "name",
			key: "name",
			width: 150,
			render: (text: string, record: TemplateField) => (
				<Input
					value={record.name}
					onChange={(e) => handleFieldUpdate(record.id, { name: e.target.value })}
					placeholder="fieldName"
				/>
			),
		},
		{
			title: "Label",
			dataIndex: "label",
			key: "label",
			width: 150,
			render: (text: string, record: TemplateField) => (
				<Input
					value={record.label}
					onChange={(e) => handleFieldUpdate(record.id, { label: e.target.value })}
					placeholder="Field Label"
				/>
			),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			width: 120,
			render: (type: FieldType, record: TemplateField) => (
				<Select
					value={type}
					onChange={(value) => handleFieldUpdate(record.id, { type: value })}
					className="w-full"
				>
					<Option value="text">Text</Option>
					<Option value="number">Number</Option>
					<Option value="date">Date</Option>
					<Option value="email">Email</Option>
					<Option value="array">Array</Option>
					<Option value="image">Image</Option>
				</Select>
			),
		},
		{
			title: "Required",
			dataIndex: "required",
			key: "required",
			width: 100,
			render: (required: boolean, record: TemplateField) => (
				<Switch
					checked={required}
					onChange={(checked) => handleFieldUpdate(record.id, { required: checked })}
				/>
			),
		},
		{
			title: "Placeholder",
			dataIndex: "placeholder",
			key: "placeholder",
			width: 150,
			render: (text: string, record: TemplateField) => (
				<Input
					value={record.placeholder}
					onChange={(e) => handleFieldUpdate(record.id, { placeholder: e.target.value })}
					placeholder="Enter placeholder..."
				/>
			),
		},
		{
			title: "Default Value",
			dataIndex: "defaultValue",
			key: "defaultValue",
			width: 150,
			render: (value: unknown, record: TemplateField) => (
				<Input
					value={String(record.defaultValue || "")}
					onChange={(e) => handleFieldUpdate(record.id, { defaultValue: e.target.value })}
					placeholder="Default value..."
				/>
			),
		},
	]

	return (
		<div>
			<h2 className="mb-6 text-2xl font-semibold">Field Mapping</h2>

			<Alert
				type="info"
				message="Configure Fillable Fields"
				description="These fields were automatically detected from your design. You can edit their properties or add validation rules."
				className="mb-6"
			/>

			{fields.length === 0 ? (
				<Alert
					type="warning"
					message="No Fields Detected"
					description="The AI didn't detect any fillable fields in your design. You can still proceed to preview the static template."
					className="mb-6"
				/>
			) : (
				<>
					<div className="mb-4 text-sm text-gray-600">
						{fields.length} field{fields.length !== 1 ? "s" : ""} detected
					</div>

					<Table
						dataSource={fields}
						columns={columns}
						rowKey="id"
						pagination={false}
						scroll={{ x: 800 }}
						className="mb-6"
					/>
				</>
			)}

			{/* Actions */}
			<div className="flex justify-between pt-4">
				<Button onClick={onPrev} icon={<ArrowLeftOutlined />}>
					Back
				</Button>

				<Button type="primary" onClick={handleNext} icon={<ArrowRightOutlined />}>
					Next: Preview & Export
				</Button>
			</div>
		</div>
	)
}
