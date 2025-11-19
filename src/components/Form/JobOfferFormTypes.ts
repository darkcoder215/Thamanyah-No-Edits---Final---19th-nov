export type JobOfferFormData = {
	offerType: "managerial" | "technical" | "general"
	theme: "general" | "league"
	name: string
	email: string
	jobTitle: string
	jobTitleEn: string
	workTypeParent: "employee" | "contract"
	workType?: string
	directManager: string
	directManagerJobTitle: string
	team: string
	department: string
	level: number
	expectations: string[]
	targets: string[]
	isSaudi: boolean
	monthlySalary: number
	basicSalary: number
	housingAllowance: number
	transportAllowance: number
	additionalAllowances: number
	netSalary: number
	managerSignName: string
	leagueCoverImage?: string
	contractDuration?: string
	deductionPercent?: number
	salaryType: "withAllowances" | "netOnly"
	saudiLocation?: "inSaudi" | "outOfSaudi"
	contractType: "employment" | "collaboration"
	contractCountry?: string
	contractCity?: string
}

export type JobOfferFormProps = {
	formData: JobOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<JobOfferFormData>>
	levels: { roleEN: string; level: number; roleAR: string }[]
}

// Temporary Job Types
export type TempJobOfferFormData = {
	name: string
	email: string
	jobTitle: string
	directManager: string
	duration: string
	recruiter: string
	recruiterJobTitle: string
	team: string
	department: string
	expectations: string[]
	netSalary: number
	formType: "full-job" | "freelancer" | "collaboration" | "training" | ""
}

export type TempJobOfferFormDataProps = {
	formData: TempJobOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<TempJobOfferFormData>>
}

// Freelancer Job Types
export type FreelancerOfferFormData = {
	name: string
	email: string
	jobTitle: string
	managerName: string
	managerJobTitle: string
	managerEmail: string
	nationalNumber: string
	phoneNumber: string
	projectName: string
	agreementDate: string
	startDate: string
	workType: "full" | "part"
	dailyHours: number
	contractDuration: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12"
	duties: string[]
	bankName: string
	accountHolderName: string
	iban: string
	salary: number
	gender: "male" | "female"
	managerGender: "male" | "female"
}

export type FreelancerOfferFormProps = {
	formData: FreelancerOfferFormData
	setFormData: React.Dispatch<React.SetStateAction<FreelancerOfferFormData>>
}
