"use client"

import React, { useCallback, useEffect, useState } from "react"
import { IBM_Plex_Sans_Arabic } from "next/font/google"
import localFont from "next/font/local"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider, theme } from "antd"
import arEg from "antd/lib/locale/ar_EG"
import DefaultLayout from "./DefaultLayout"

const IBM = IBM_Plex_Sans_Arabic({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["arabic"],
	display: "swap",
	variable: "--ibm-font",
})
export const ThmanyahDisplay = localFont({
	src: [
		{
			path: "../../public/fonts/thmanyah/display/Thmanyahserifdisplay12-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/display/Thmanyahserifdisplay12-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/display/Thmanyahserifdisplay12-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/display/Thmanyahserifdisplay12-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--thmanyah-display",
})

export const ThmanyahSerifText = localFont({
	src: [
		{
			path: "../../public/fonts/thmanyah/serif-text/Thmanyahseriftext12-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/serif-text/Thmanyahseriftext12-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/serif-text/Thmanyahseriftext12-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/serif-text/Thmanyahseriftext12-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/serif-text/Thmanyahseriftext12-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--thmanyah-serif",
})

export const ThmanyahSans = localFont({
	src: [
		{
			path: "../../public/fonts/thmanyah/sans/Thmanyahsans12-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/sans/Thmanyahsans12-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/sans/Thmanyahsans12-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/sans/Thmanyahsans12-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/thmanyah/sans/Thmanyahsans12-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--thmanyah-sans",
})

export default function AntdLayout({ children }: React.PropsWithChildren) {
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			const savedMode = localStorage.getItem("darkMode")
			if (savedMode !== null) {
				return savedMode === "true"
			}
			return window.matchMedia("(prefers-color-scheme: dark)").matches
		}
		return false
	})

	const toggleDarkMode = useCallback(() => {
		setDarkMode((prev) => {
			const newMode = !prev
			localStorage.setItem("darkMode", String(newMode))
			return newMode
		})
	}, [])

	const darkModeChange = useCallback((event: MediaQueryListEvent) => {
		if (localStorage.getItem("darkMode") === null) {
			setDarkMode(event.matches)
		}
	}, [])

	useEffect(() => {
		if (typeof window !== "undefined") {
			const windowQuery = window.matchMedia("(prefers-color-scheme: dark)")
			windowQuery.addEventListener("change", darkModeChange)
			return () => {
				windowQuery.removeEventListener("change", darkModeChange)
			}
		}
	}, [darkModeChange])

	// Hydration-safe: update <html> class for dark mode only on client
	useEffect(() => {
		if (typeof window !== "undefined") {
			const html = document.documentElement
			if (darkMode) {
				html.classList.add("dark")
			} else {
				html.classList.remove("dark")
			}
		}
	}, [darkMode])

	return (
		<html
			lang="ar"
			dir="rtl"
			className={`${IBM.variable} ${ThmanyahDisplay.variable} ${ThmanyahSerifText.variable} ${ThmanyahSans.variable}`}
		>
			<body>
				<AntdRegistry>
					<ConfigProvider
						direction="rtl"
						prefixCls="eight"
						locale={arEg}
						theme={{
							algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
							cssVar: true,
							token: {
								fontFamily: "var(--ibm-font)",
								colorText: darkMode ? "#fff" : "var(--foreground)",
								colorLink: "#fa541c",
								colorPrimary: "#fa541c",
								controlHeight: 40,
								fontSizeHeading1: 36,
								fontSizeHeading2: 24,
								fontSizeHeading3: 20,
								fontSizeHeading4: 16,
							},
						}}
					>
						<DefaultLayout onDarkModeToggle={toggleDarkMode} darkMode={darkMode}>
							{children}
						</DefaultLayout>
					</ConfigProvider>
				</AntdRegistry>
			</body>
		</html>
	)
}
