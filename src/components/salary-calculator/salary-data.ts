export interface FloatLevelAdjustments {
	4.5: { min: number; max: number }
	5.5: { min: number; max: number }
	6.5: { min: number; max: number }
	7.5: { min: number; max: number }
}

export interface DepartmentData {
	departmentKey: string
	title: string
	description: string
	levelPercentages: {
		[key: number]: number
	}
	floatLevelAdjustments: FloatLevelAdjustments
}

export const baseSalaries2025 = [
	{ level: 1, min: 8000, average: 9000, max: 10000 },
	{ level: 2, min: 10500, average: 12000, max: 13500 },
	{ level: 3, min: 13910, average: 15649, max: 17388 },
	{ level: 4, min: 17600, average: 19525, max: 21450 },
	{ level: 5, min: 24640, average: 26320, max: 28000 },
	{ level: 6, min: 32200, average: 34500, max: 36800 },
	{ level: 7, min: 42000, average: 46200, max: 50400 },
	{ level: 8, min: 60200, average: 65800, max: 71400 },
]
export const saudiExtraPercent = 1.1

export const levels = [
	{
		level: 1,
		titleAr: "مساعد/محلل/منسق",
		titleEn: "Associate/Analyst/Coordinator",
		managerialTitleAr: "مساعد/محلل/منسق",
		managerialTitleEn: "Associate/Analyst/Coordinator",
		techTitleAr: "مبتدئ/مساعد",
		techTitleEn: "Junior/Assistant",
	},
	{
		level: 2,
		titleAr: "مسؤول",
		titleEn: "Officer",
		managerialTitleAr: "مسؤول",
		managerialTitleEn: "Officer",
		techTitleAr: "(المسمى الوظيفي)",
		techTitleEn: "Job Title",
	},
	{
		level: 3,
		titleAr: "أخصائي",
		titleEn: "Specialist",
		managerialTitleAr: "أخصائي",
		managerialTitleEn: "Specialist",
		techTitleAr: "أول",
		techTitleEn: "Senior",
	},
	{
		level: 4,
		titleAr: "كبير",
		titleEn: "Staff",
		managerialTitleAr: "قائد",
		managerialTitleEn: "Lead",
		techTitleAr: "كبير",
		techTitleEn: "Staff",
	},
	{
		level: 4.5,
		titleAr: "كبير أول",
		titleEn: "Senior Staff",
		managerialTitleAr: "قائد أول",
		managerialTitleEn: "Senior Lead",
		techTitleAr: "كبير أول",
		techTitleEn: "Senior Staff",
	},
	{
		level: 5,
		titleAr: "خبير",
		titleEn: "Expert",
		managerialTitleAr: "مدير",
		managerialTitleEn: "Manager",
		techTitleAr: "خبير",
		techTitleEn: "Expert",
	},
	{
		level: 5.5,
		titleAr: "خبير أول",
		titleEn: "Senior Expert",
		managerialTitleAr: "مدير أول",
		managerialTitleEn: "Senior Manager",
		techTitleAr: "مدير أول",
		techTitleEn: "Senior Manager",
	},
	{
		level: 6,
		titleAr: "مدير قسم",
		titleEn: "Director / Head",
		managerialTitleAr: "مدير قسم",
		managerialTitleEn: "Director / Head",
		techTitleAr: "مدير قسم",
		techTitleEn: "Director / Head",
	},
	{
		level: 6.5,
		titleAr: "مدير قسم أول",
		titleEn: "Senior Director / Senior Head",
		managerialTitleAr: "مدير قسم أول",
		managerialTitleEn: "Senior Director / Senior Head",
		techTitleAr: "مدير قسم أول",
		techTitleEn: "Senior Director / Senior Head",
	},
	{
		level: 7,
		titleAr: "خبير استشاري",
		titleEn: "Consultant Expert",
		managerialTitleAr: "نائب رئيس",
		managerialTitleEn: "Vice President",
		techTitleAr: "نائب رئيس",
		techTitleEn: "Vice President",
	},
	{
		level: 7.5,
		titleAr: "نائب أول للرئيس",
		titleEn: "Senior VP",
		managerialTitleAr: "نائب أول للرئيس",
		managerialTitleEn: "Senior VP",
		techTitleAr: "نائب أول للرئيس",
		techTitleEn: "Senior VP",
	},
	{
		level: 8,
		titleAr: "رئيس",
		titleEn: "CXO",
		managerialTitleAr: "رئيس",
		managerialTitleEn: "CXO",
		techTitleAr: "رئيس قسم التقنية",
		techTitleEn: "CTO",
	},
	// {
	//     level: 9,
	//     titleAr: "الرئيس التنفيذي",
	//     titleEn: "CEO",
	// },
]

export const newSalaries: DepartmentData[] = [
	{
		departmentKey: "base-2025",
		title: "المسار الأساسي 2025",
		description: "فريق ثقافة المنظومة، التسويق (ما عدا النمو)، المحاسبة والمالية، العمليات.",
		levelPercentages: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			4.5: 0,
			5: 0,
			5.5: 0,
			6: 0,
			6.5: 0,
			7: 0,
			7.5: 0,
			8: 0,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -500 },
			5.5: { min: 700, max: -1000 },
			6.5: { min: 1000, max: -1750 },
			7.5: { min: 1250, max: -5000 },
		},
	},
	{
		departmentKey: "business",
		title: "مسار الأعمال",
		description: "تشمل: تطوير الأعمال، مبيعات، محلل أعمال.",
		levelPercentages: {
			1: 20,
			2: 15,
			3: 15,
			4: 20,
			4.5: 0,
			5: 22,
			5.5: 0,
			6: 24,
			6.5: 0,
			7: 26,
			7.5: 0,
			8: 22,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -700 },
			5.5: { min: 700, max: -1000 },
			6.5: { min: 1000, max: -1700 },
			7.5: { min: 1250, max: -7500 },
		},
	},
	{
		departmentKey: "growth-and-visual-identity",
		title: "مسار النمو",
		description: "مسار النمو فقط، وليس أي قسم آخر من فريق التسويق.",
		levelPercentages: {
			1: 7,
			2: 8,
			3: 13,
			4: 16,
			4.5: 0,
			5: 20,
			5.5: 0,
			6: 25,
			6.5: 0,
			7: 30,
			7.5: 0,
			8: 23,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -500 },
			5.5: { min: 700, max: -500 },
			6.5: { min: 1000, max: -1000 },
			7.5: { min: 1250, max: -4000 },
		},
	},
	{
		departmentKey: "studios",
		title: "مسار استديوهات ثمانية",
		description: "منتجي ومنتجي محتوى استديوهات ثمانية.",
		levelPercentages: {
			1: 7,
			2: 8,
			3: 13,
			4: 16,
			4.5: 0,
			5: 20,
			5.5: 0,
			6: 25,
			6.5: 0,
			7: 30,
			7.5: 0,
			8: 23,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -700 },
			5.5: { min: 700, max: -1000 },
			6.5: { min: 1000, max: -1700 },
			7.5: { min: 1250, max: -6000 },
		},
	},
	{
		departmentKey: "art-direction",
		title: "مسار الإخراج الفني والهوية البصرية",
		description: "الإخراج الفني في فريق الإنتاج أو التصميم، والهوية البصرية في فريق التصميم.",
		levelPercentages: {
			1: 10,
			2: 11,
			3: 12,
			4: 16,
			4.5: 0,
			5: 20,
			5.5: 0,
			6: 23,
			6.5: 0,
			7: 26,
			7.5: 0,
			8: 25,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -700 },
			5.5: { min: 700, max: -1000 },
			6.5: { min: 1000, max: -1700 },
			7.5: { min: 1250, max: -6000 },
		},
	},
	{
		departmentKey: "tech",
		title: "مسار التقنية",
		description: "التصميم الرقمي، إدارة المنتج، البيانات، هندسة البرمجيات، الذكاء الاصطناعي.",
		levelPercentages: {
			1: 20,
			2: 15,
			3: 20,
			4: 25,
			4.5: 0,
			5: 30,
			5.5: 0,
			6: 33,
			6.5: 0,
			7: 36,
			7.5: 0,
			8: 31,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -500 },
			5.5: { min: 700, max: -1000 },
			6.5: { min: 1000, max: -1700 },
			7.5: { min: 1250, max: -4000 },
		},
	},
	{
		departmentKey: "production",
		title: "مسار الإنتاج",
		description: "جميع أقسام الإنتاج، لكن لا يشمل العمليات والشواغر غير إنتاجية.",
		levelPercentages: {
			1: 15,
			2: 14,
			3: 19,
			4: 24,
			4.5: 0,
			5: 28,
			5.5: 0,
			6: 32,
			6.5: 0,
			7: 35,
			7.5: 0,
			8: 30,
		},
		floatLevelAdjustments: {
			4.5: { min: 500, max: -700 },
			5.5: { min: 700, max: -1000 },
			6.5: { min: 1000, max: -1700 },
			7.5: { min: 1250, max: -4000 },
		},
	},
]

export const regionAdjustments = [
	{ label: "الرياض", value: "riyadh", percent: 0 },
	{ label: "المنطقة الشرقية", value: "east", percent: -13 },
	{ label: "المنطقة الغربية", value: "west", percent: -13 },
	{ label: "البحرين", value: "bahrain", percent: -10 },
	{ label: "الكويت", value: "kuwait", percent: 0 },
	{ label: "قطر", value: "qatar", percent: 0 },
	{ label: "الامارات", value: "uae", percent: 0 },
	{ label: "الاردن", value: "jordan", percent: -28 },
	{ label: "عُمان", value: "oman", percent: -18 },
	{ label: "المغرب", value: "morocco", percent: -40 },
	{
		label: "مصر",
		value: "egypt",
		getPercent: (level: number) => {
			if (level >= 4) return -40 // 60% من راتب الرياض
			if (level <= 1) return -50 // 50% من راتب الرياض
			// تدريجي بين المستوى 1 و 4
			// المستوى 1: -50%، المستوى 4: -40%
			// الفرق 10% على 3 مستويات => كل مستوى +3.33%
			const percent = -50 + (level - 1) * (10 / 3)
			return Math.round(percent * 100) / 100
		},
	},
	{ label: "الفلبين", value: "philippines", percent: -35 },
	{ label: "اسطنبول", value: "istanbul", percent: -25 },
	{ label: "آخر", value: "other", percent: 0 },
]
