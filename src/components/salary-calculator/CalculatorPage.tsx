"use client"

import React, { useMemo } from "react"
import { Card, Checkbox, Form, Input, Radio, Select, Space, Table, Typography } from "antd"
import {
	DepartmentData,
	baseSalaries2025,
	levels,
	newSalaries,
	regionAdjustments,
	saudiExtraPercent,
} from "./salary-data"

const { Title } = Typography

interface FormValues {
	department: string
	level: number
	region?: string
	changesByManager?: number
	isSaudi: boolean
	expertise?: "beginner" | "mid" | "expert"
	isManagerial: boolean
	movingToRiyadh: boolean
}

interface TableRecord {
	key: string
	level: number
	levelTitle: string
	percent: number
	min: number
	average: number
	max: number
}

// const getColSpan = (record: TableRecord, isFirstColumn: boolean) => {
// 	const allSame = record.min === record.average && record.average === record.max
// 	if (isFirstColumn) {
// 		return {
// 			colSpan: allSame ? 3 : 1,
// 		}
// 	}
// 	return {
// 		colSpan: allSame ? 0 : 1,
// 	}
// }

const getLevelName = (level: number) => {
	return level.toString().replace(".5", "S")
}

const getLevelTitle = (level: number, isManagerial: boolean, department?: string, lang = "all") => {
	const levelInfo = levels.find((l) => l.level === level)
	if (!levelInfo) return ""
	let title = ""
	if (
		// department === "tech"
		department !== "base-2025" &&
		department !== "business" &&
		department !== "growth-and-visual-identity"
	) {
		title =
			lang === "ar"
				? levelInfo.techTitleAr
				: lang === "en"
					? levelInfo.techTitleEn
					: `${levelInfo.techTitleAr} (${levelInfo.techTitleEn})`
	} else {
		title = isManagerial
			? lang === "ar"
				? levelInfo.managerialTitleAr
				: lang === "en"
					? levelInfo.managerialTitleEn
					: `${levelInfo.managerialTitleAr} (${levelInfo.managerialTitleEn})`
			: lang === "ar"
				? levelInfo.titleAr
				: lang === "en"
					? levelInfo.titleEn
					: `${levelInfo.titleAr} (${levelInfo.titleEn})`
	}
	return lang !== "en" ? `${getLevelName(level)} - ${title}` : title
}

const getSelectedCell = (
	record: TableRecord,
	dataIndex: string,
	expertise?: string,
	selectedLevel?: number,
) => {
	if (record.level === selectedLevel) {
		if (expertise === "beginner" && dataIndex === "min") return "selected-cell"
		if (expertise === "mid" && dataIndex === "average") return "selected-cell"
		if (expertise === "expert" && dataIndex === "max") return "selected-cell"
	}
	return ""
}

export default function CalculatorPage() {
	const [form] = Form.useForm<FormValues>()
	const department = Form.useWatch("department", form)
	const level = Form.useWatch("level", form)
	const region = Form.useWatch("region", form)
	const changesByManager = Form.useWatch("changesByManager", form)
	const isSaudi = Form.useWatch("isSaudi", form)
	const expertise = Form.useWatch("expertise", form)
	const isManagerial = Form.useWatch("isManagerial", form)
	const movingToRiyadh = Form.useWatch("movingToRiyadh", form)

	const getTableData = useMemo(() => {
		if (!department) return []

		const departmentData = newSalaries.find((d) => d.departmentKey === department) as
			| DepartmentData
			| undefined
		if (!departmentData) return []

		const regionData = region ? regionAdjustments.find((r) => r.value === region) : null
		let regionPercent = 0
		if (regionData) {
			if (regionData.value === "egypt" && typeof regionData.getPercent === "function") {
				regionPercent = regionData.getPercent(level)
			} else {
				regionPercent = regionData.percent || 0
			}
		}

		// Map all levels for this department
		return Object.entries(departmentData.levelPercentages)
			.filter(([levelKey]) => {
				const levelNum = Number(levelKey)
				return isManagerial ? levelNum > 3 : levelNum <= 5.5
			})
			.filter(([levelKey]) => Number(levelKey) !== 8) // Temporarily hide CXO level
			.map(([levelKey, percent]) => {
				const levelNum = Number(levelKey)
				const levelInfo = levels.find((l) => l.level === levelNum)
				const isFloatLevel = levelNum % 1 !== 0

				// Calculate salary with all adjustments
				const calculateFinalSalary = (baseValue: number) => {
					let salary = baseValue
					// Apply region adjustment
					if (regionPercent) {
						salary = Math.round(salary * (1 + regionPercent / 100))
					}
					// Apply extension if enabled
					if (changesByManager && changesByManager !== 0) {
						salary = Math.round(salary * (1 + changesByManager / 100))
					}
					// Apply Saudi extension if enabled
					if (isSaudi) {
						salary = Math.round(salary * saudiExtraPercent) // 10% extension for Saudi employees
					}
					// Apply moving to Riyadh extension if enabled
					if (movingToRiyadh) {
						salary = Math.round(salary * 1.1) // 10% extra for moving to Riyadh
					}
					return salary
				}

				// For float levels, calculate based on next level's minimum salary
				if (isFloatLevel) {
					const nextLevel = Math.ceil(levelNum)
					const prevLevel = Math.floor(levelNum)
					const nextLevelBase = baseSalaries2025.find((b) => b.level === nextLevel)
					const prevLevelBase = baseSalaries2025.find((b) => b.level === prevLevel)
					const floatAdjustment =
						departmentData.floatLevelAdjustments[
							levelNum as keyof typeof departmentData.floatLevelAdjustments
						]
					const nextLevelPercent = departmentData.levelPercentages[nextLevel]
					const prevLevelPercent = departmentData.levelPercentages[prevLevel]

					if (
						nextLevelBase &&
						prevLevelBase &&
						floatAdjustment !== undefined &&
						nextLevelPercent !== undefined &&
						prevLevelPercent !== undefined
					) {
						// Calculate max salary based on next level's min
						const maxBaseSalary = Math.round(
							nextLevelBase.min * (1 + nextLevelPercent / 100),
						)
						const maxSalary =
							floatAdjustment.max > 0
								? maxBaseSalary + floatAdjustment.max
								: maxBaseSalary - Math.abs(floatAdjustment.max)

						// Calculate min salary based on previous level's max
						const minBaseSalary = Math.round(
							prevLevelBase.max * (1 + prevLevelPercent / 100),
						)
						const minSalary =
							floatAdjustment.min > 0
								? minBaseSalary + floatAdjustment.min
								: minBaseSalary - Math.abs(floatAdjustment.min)

						// Calculate average as midpoint between min and max
						const averageSalary = Math.round((minSalary + maxSalary) / 2)

						return {
							key: levelKey,
							level: levelNum,
							levelTitle: levelInfo ? levelInfo.titleAr : "",
							percent,
							min: calculateFinalSalary(minSalary),
							average: calculateFinalSalary(averageSalary),
							max: calculateFinalSalary(maxSalary),
						} as TableRecord
					}
					return null
				}

				// For regular levels
				const base = baseSalaries2025.find((b) => b.level === levelNum)
				if (!base) return null

				const baseMin = Math.round(base.min * (1 + percent / 100))
				const baseAverage = Math.round(base.average * (1 + percent / 100))
				const baseMax = Math.round(base.max * (1 + percent / 100))

				return {
					key: levelKey,
					level: levelNum,
					levelTitle: levelInfo ? levelInfo.titleAr : "",
					percent,
					min: calculateFinalSalary(baseMin),
					average: calculateFinalSalary(baseAverage),
					max: calculateFinalSalary(baseMax),
				} as TableRecord
			})
			.filter((item): item is TableRecord => item !== null)
			.sort((a, b) => a.level - b.level) // Sort by level ascending
	}, [department, region, changesByManager, isSaudi, isManagerial, movingToRiyadh, level])

	const columns = useMemo(
		() => [
			{
				title: "المستوى",
				dataIndex: "level",
				key: "level",
				// align: "center" as const,
				render: (value: number) => getLevelTitle(value, isManagerial, department, "ar"),
			},
			{
				// title: "Level",
				dataIndex: "level",
				key: "levelEn",
				align: "left" as const,
				render: (value: number) => getLevelTitle(value, isManagerial, department, "en"),
			},
			{
				title: "الحد الأدنى",
				dataIndex: "min",
				key: "min",
				align: "center" as const,
				render: (value: number) => (value ? value.toLocaleString() : "-"),
				onCell: (record: TableRecord) => ({
					// ...getColSpan(record, true),
					className: getSelectedCell(record, "min", expertise, level),
				}),
			},
			{
				title: "المتوسط",
				dataIndex: "average",
				key: "average",
				align: "center" as const,
				render: (value: number) => (value ? value.toLocaleString() : "-"),
				onCell: (record: TableRecord) => ({
					// ...getColSpan(record, false),
					className: getSelectedCell(record, "average", expertise, level),
				}),
			},
			{
				title: "الحد الأقصى",
				dataIndex: "max",
				key: "max",
				align: "center" as const,
				render: (value: number) => (value ? value.toLocaleString() : "-"),
				onCell: (record: TableRecord) => ({
					// ...getColSpan(record, false),
					className: getSelectedCell(record, "max", expertise, level),
				}),
			},
			// {
			// title: "النسبة",
			// dataIndex: "percent",
			// key: "percent",
			// align: "center",
			// render: (value: number) => `${value}%`,
			// // onCell: (record: TableRecord) => getColSpan(record, false),
			// }
		],
		[level, expertise, isManagerial, department],
	)

	const departmentData = useMemo(
		() => newSalaries.find((d) => d.departmentKey === department),
		[department],
	)
	const departmentTitle = departmentData ? departmentData.title : ""
	return (
		<Card>
			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				<Title level={3}>حاسبة الراتب</Title>

				<Form
					form={form}
					layout="horizontal"
					requiredMark={false}
					className="[&_label]:min-w-[110px]"
					initialValues={{
						isManagerial: false,
						isSaudi: false,
						changesByManager: 0,
						movingToRiyadh: false,
					}}
				>
					<Form.Item
						name="department"
						label="المسار الوظيفي"
						rules={[
							{
								required: true,
								message: "الرجاء اختيار المسار الوظيفي",
							},
						]}
					>
						<Select
							placeholder="اختر المسار الوظيفي"
							options={newSalaries.map((dept) => ({
								label: (
									<>
										{dept.title}{" "}
										<span
											style={{
												fontSize: "12px",
												opacity: 0.5,
											}}
										>
											- {dept.description}
										</span>
									</>
								),
								value: dept.departmentKey,
							}))}
						/>
					</Form.Item>

					<Form.Item name="isManagerial" label="نوع المنصب">
						<Radio.Group>
							<Radio.Button className="text-center" value={false}>
								موظف
							</Radio.Button>
							<Radio.Button className="text-center" value={true}>
								منصب إداري
							</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						name="level"
						label="المستوى الوظيفي"
						className="flex-1"
						rules={[
							{
								required: true,
								message: "الرجاء اختيار المستوى الوظيفي",
							},
						]}
					>
						<Select
							placeholder="اختر المستوى الوظيفي"
							options={levels
								.filter((level) =>
									isManagerial ? level.level > 3 : level.level <= 5.5,
								)
								.filter((level) => level.level !== 8) // Temporarily hide CXO level
								.map((level) => ({
									label: getLevelTitle(level.level, isManagerial, department),
									value: level.level,
								}))}
						/>
					</Form.Item>

					<Form.Item name="expertise" label="مكانه في المستوى" className="flex-1">
						<Select
							placeholder="اختر مكانه في المستوى"
							allowClear
							options={[
								{ label: "بداية المستوى", value: "beginner" },
								{ label: "متوسط", value: "mid" },
								{ label: "خبير في مستواه", value: "expert" },
							]}
						/>
					</Form.Item>

					<Form.Item name="region" label="مكان العمل">
						<Select
							placeholder="اختر المنطقة أو المدينة"
							allowClear
							options={regionAdjustments.map((r) => ({
								label: r.label,
								value: r.value,
							}))}
						/>
					</Form.Item>

					<Form.Item name="isSaudi" label="الجنسية">
						<Radio.Group>
							<Radio.Button value={true}>سعودي</Radio.Button>
							<Radio.Button value={false}>غير سعودي</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						name="changesByManager"
						label="تغيير من المدير"
						tooltip="نسبة اختيارية تطبق على الراتب (من -5% إلى +5%)"
						rules={[
							{
								validator: (_: unknown, value: unknown) => {
									if (value === undefined || value === "")
										return Promise.resolve()
									const num = Number(value)
									if (isNaN(num)) return Promise.reject("الرجاء إدخال رقم صحيح")
									if (num < -5 || num > 5)
										return Promise.reject("يجب أن تكون النسبة بين -5% و +5%")
									return Promise.resolve()
								},
							},
						]}
					>
						<Input
							type="number"
							min={-5}
							max={5}
							className="!w-28"
							placeholder="±5"
							addonAfter="%"
						/>
					</Form.Item>

					<Form.Item
						name="movingToRiyadh"
						label="الانتقال للرياض"
						tooltip="+10%"
						valuePropName="checked"
					>
						<Checkbox>نعم</Checkbox>
					</Form.Item>
				</Form>

				<Table
					columns={columns}
					dataSource={getTableData}
					pagination={false}
					bordered
					size="small"
					rowClassName={(record: any) =>
						record.level === level && !expertise ? "selected-row" : ""
					}
					title={() => (
						<Title level={4} style={{ textAlign: "center", margin: 0 }}>
							{departmentTitle}
						</Title>
					)}
				/>
			</Space>
		</Card>
	)
}
