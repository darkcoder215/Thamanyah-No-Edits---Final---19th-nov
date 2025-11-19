import type { Metadata } from "next"
import AntdLayout from "@/layout/AntdLayout"
import "@ant-design/v5-patch-for-react-19"
import "./globals.css"

export const metadata: Metadata = {
	title: "ادوات",
	robots: {
		index: false,
		follow: false,
	},
}

export default function RootLayout({ children }: React.PropsWithChildren) {
	return <AntdLayout>{children}</AntdLayout>
}
