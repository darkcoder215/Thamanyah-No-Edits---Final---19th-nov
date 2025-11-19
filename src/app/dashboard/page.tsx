import ProtectedComponent from "@/components/ProtectedComponent"

export default function DashboardPage() {
	return (
		<div className="container mx-auto p-4">
			<ProtectedComponent />
		</div>
	)
}
