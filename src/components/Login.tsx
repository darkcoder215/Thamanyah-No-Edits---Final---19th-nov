import { useEffect } from "react"
import { GoogleOutlined } from "@ant-design/icons"
import { Alert, Button, Card, message } from "antd"
import { useAuth } from "@/lib/context/AuthContext"

const Login = () => {
	const [messageApi, contextHolder] = message.useMessage()

	const { signInWithGoogleProvider, loading, error, clearError } = useAuth()

	useEffect(() => {
		if (error) {
			messageApi.error({ content: error, duration: 4 })
		}
	}, [error, messageApi])

	const handleGoogleSignIn = async () => {
		await signInWithGoogleProvider()
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="mx-auto w-[400px] max-w-[90%] rounded-lg p-5 shadow-md">
				{contextHolder}
				{error && (
					<Alert
						message={error}
						type="error"
						showIcon
						closable
						onClose={clearError}
						className="mb-4"
					/>
				)}
				<Button
					icon={<GoogleOutlined />}
					onClick={handleGoogleSignIn}
					loading={loading}
					block
					size="large"
					className="mt-4"
				>
					سجّل دخولك بواسطة Google
				</Button>
			</Card>
		</div>
	)
}

export default Login
