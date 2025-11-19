export const getGreetingEmoji = () => {
	const hours = new Date().getHours()
	if (hours >= 6 && hours < 9) return "🌄" // صباحًا
	if (hours >= 9 && hours < 15) return "☀️" // ظهرًا
	if (hours >= 15 && hours < 18) return "🌇" // عصرًا
	if (hours >= 18 && hours < 21) return "🌙" // مساءً
	if (hours >= 21 || hours < 6) return "🌜" // ليلًا
	return "💤" // بعد منتصف الليل
}
export const formatNumbers = (number: number) => {
	return new Intl.NumberFormat("ar").format(number)
}
