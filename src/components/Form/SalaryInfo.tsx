import React, { useCallback } from "react"
import { Form, type FormInstance, Input, Radio } from "antd"
import { type JobOfferFormData } from "./JobOfferFormTypes"

const SalaryInfo: React.FC<{
	formData: JobOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<JobOfferFormData>>
	form: FormInstance
}> = ({ formData, setFormData, form }) => {
	const calculateSalary = useCallback(
		(monthly: number, isSaudi: boolean, deductionPercent: number) => {
			// const inSaudi = formData.saudiLocation === "inSaudi"
			const notSaudiBasicSalary = monthly / 1.28
			const baseSalary = isSaudi
				? notSaudiBasicSalary * ((100 - deductionPercent) / 100)
				: notSaudiBasicSalary
			const housingAllowance = baseSalary * 0.25
			const transportAllowance = baseSalary * 0.03
			const insurance = (baseSalary + housingAllowance) * 0.0975
			const netSalary = monthly - insurance
			const additionalAllowances =
				monthly - housingAllowance - transportAllowance - baseSalary

			form.setFields([
				{
					name: "basicSalary",
					value: Math.round(baseSalary),
				},
				{
					name: "housingAllowance",
					value: Math.round(housingAllowance),
				},
				{
					name: "transportAllowance",
					value: Math.round(transportAllowance),
				},
				{
					name: "netSalary",
					value: isSaudi ? Math.round(netSalary) : 0,
				},
				{
					name: "additionalAllowances",
					value: isSaudi ? Math.round(additionalAllowances) : 0,
				},
			])

			setFormData((prevData) => ({
				...prevData,
				basicSalary: Math.round(baseSalary),
				housingAllowance: Math.round(housingAllowance),
				transportAllowance: Math.round(transportAllowance),
				netSalary: isSaudi ? Math.round(netSalary) : 0,
				additionalAllowances: isSaudi ? Math.round(additionalAllowances) : 0,
			}))

			return monthly
		},
		[form, setFormData],
	)

	return (
		<>
			{formData.contractType !== "collaboration" && (
				<Form.Item label="نوع الراتب" name="salaryType" rules={[{ required: true }]}>
					<Radio.Group
						value={formData.salaryType || "withAllowances"}
						onChange={(e) => {
							const salaryType = e.target.value
							setFormData((prev) => ({ ...prev, salaryType }))
						}}
						options={[
							{ value: "withAllowances", label: "الراتب مع البدلات والمزايا" },
							{ value: "netOnly", label: "راتب صافي فقط" },
						]}
					/>
				</Form.Item>
			)}
			{formData.contractType !== "collaboration" && (
				<>
					<Form.Item
						name="isSaudi"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Radio.Group
							value={formData.isSaudi}
							options={[
								{ value: true, label: "سعودي" },
								{ value: false, label: "غير سعودي" },
							]}
							onChange={(e) => {
								const monthlySalary = form.getFieldValue("monthlySalary") || 0
								const deductionPercent =
									form.getFieldValue("deductionPercent") || 40
								const isSaudiVal = e.target.value
								setFormData((prevData) => ({
									...prevData,
									isSaudi: isSaudiVal,
								}))
								if (monthlySalary > 0)
									calculateSalary(monthlySalary, isSaudiVal, deductionPercent)
							}}
						/>
					</Form.Item>

					<Form.Item
						label="الموقع"
						name="saudiLocation"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Radio.Group
							value={formData.saudiLocation}
							options={[
								{
									value: "inSaudi",
									label: (
										<span title="الموظف سيعمل داخل المملكة العربية السعودية">
											داخل المملكة
										</span>
									),
								},
								{
									value: "outOfSaudi",
									label: (
										<span title="الموظف سيعمل خارج المملكة العربية السعودية">
											خارج المملكة
										</span>
									),
								},
							]}
							onChange={(e) => {
								const saudiLocation = e.target.value
								setFormData((prevData) => ({
									...prevData,
									saudiLocation,
								}))
							}}
						/>
					</Form.Item>
				</>
			)}

			<Form.Item
				label="الراتب الشهري"
				name="monthlySalary"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					type="number"
					value={formData.monthlySalary}
					onChange={(e) => {
						const monthlySalary = parseInt(e.target.value)
						if (!isNaN(monthlySalary)) {
							setFormData({
								...formData,
								monthlySalary: monthlySalary,
							})
							// Only calculate salary breakdown for non-collaboration contracts
							if (
								monthlySalary > 0 &&
								formData.salaryType !== "netOnly" &&
								formData.contractType !== "collaboration"
							) {
								const deductionPercent = formData.deductionPercent ?? 40
								calculateSalary(monthlySalary, formData.isSaudi, deductionPercent)
							}
						}
					}}
				/>
			</Form.Item>

			{formData.salaryType !== "netOnly" && formData.contractType !== "collaboration" && (
				<>
					{formData.isSaudi && (
						<Form.Item
							label="نسبة خصم التأمينات (%)"
							name="deductionPercent"
							rules={[{ required: true }]}
						>
							<Radio.Group
								value={formData.deductionPercent ?? 40}
								onChange={(e) => {
									const deductionPercent = e.target.value
									setFormData((prevData) => ({
										...prevData,
										deductionPercent,
									}))
									const monthlySalary = form.getFieldValue("monthlySalary") || 0
									if (monthlySalary > 0)
										calculateSalary(
											monthlySalary,
											formData.isSaudi,
											deductionPercent,
										)
								}}
								options={[
									{ value: 30, label: "30% (النجوم)" },
									{ value: 40, label: "40% (راتب < 39.000)" },
									{ value: 60, label: "60% (راتب > 40.000)" },
								]}
							/>
						</Form.Item>
					)}
					<div className={`${formData.isSaudi ? "" : "hidden"}`}>
						<Form.Item
							label="أجر أساسي"
							name="basicSalary"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input
								type="number"
								value={formData.basicSalary}
								onChange={(e) =>
									setFormData({
										...formData,
										basicSalary: parseInt(e.target.value),
									})
								}
								disabled={true}
							/>
						</Form.Item>

						<Form.Item
							label="بدل سكن"
							name="housingAllowance"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input
								type="number"
								value={formData.housingAllowance}
								onChange={(e) =>
									setFormData({
										...formData,
										housingAllowance: parseInt(e.target.value),
									})
								}
								disabled={true}
							/>
						</Form.Item>

						<Form.Item
							label="بدل نقل"
							name="transportAllowance"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input
								type="number"
								value={formData.transportAllowance}
								onChange={(e) =>
									setFormData({
										...formData,
										transportAllowance: parseInt(e.target.value),
									})
								}
								disabled={true}
							/>
						</Form.Item>
						{formData.isSaudi && (
							<>
								<Form.Item
									label="الراتب (بعد خصم التأمينات)"
									name="netSalary"
									rules={[
										{
											required: true,
										},
									]}
								>
									<Input
										type="number"
										value={formData.netSalary}
										onChange={(e) =>
											setFormData({
												...formData,
												netSalary: parseInt(e.target.value),
											})
										}
										disabled={true}
									/>
								</Form.Item>
								<Form.Item
									label="بدلات إضافية"
									name="additionalAllowances"
									rules={[
										{
											required: true,
										},
									]}
								>
									<Input
										type="number"
										value={formData.additionalAllowances}
										onChange={(e) =>
											setFormData({
												...formData,
												additionalAllowances: parseInt(e.target.value),
											})
										}
										disabled={true}
									/>
								</Form.Item>
							</>
						)}
					</div>
				</>
			)}
		</>
	)
}

export default SalaryInfo
