import type { Metadata } from "next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import "@ant-design/v5-patch-for-react-19"
import { ConfigProvider } from "antd"
import "./globals.css"

export const metadata: Metadata = {
	title: "Figma Template Converter",
	description: "Convert Figma designs to fillable PDF templates",
}

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				<AntdRegistry>
					<ConfigProvider
						theme={{
							token: {
								colorPrimary: "#1890ff",
								borderRadius: 8,
							},
						}}
					>
						{children}
					</ConfigProvider>
				</AntdRegistry>
			</body>
		</html>
	)
}
