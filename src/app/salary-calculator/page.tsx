import { Metadata } from "next"
import CalculatorPage from "@/components/salary-calculator/CalculatorPage"

export const metadata: Metadata = {
	title: "حاسبة سلم الرواتب",
}

export default function SalaryCalculatorPage() {
	return (
		<div className="mx-auto min-h-screen max-w-[800px] lg:p-10">
			<CalculatorPage />
		</div>
	)
}
