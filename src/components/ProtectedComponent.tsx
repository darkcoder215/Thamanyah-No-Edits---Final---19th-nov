"use client"

import { LogoutOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
import { useAuth } from "@/lib/context/AuthContext"

const { Text } = Typography

const ProtectedComponent = () => {
	const { user, logout, loading } = useAuth()

	const handleLogout = async () => {
		await logout()
	}

	return (
		<div className="mx-auto my-16 w-[600px] rounded-xl border p-4">
			{user && (
				<Text className="mb-4">
					<p className="text-center">
						<strong>البريد الإلكتروني:</strong> {user.email}{" "}
						{user.emailVerified ? "✅" : "🚫"}
					</p>
				</Text>
			)}

			<Button
				type="primary"
				danger
				icon={<LogoutOutlined />}
				onClick={handleLogout}
				loading={loading}
				block
			>
				تسجيل الخروج
			</Button>
		</div>
	)
}

export default ProtectedComponent
