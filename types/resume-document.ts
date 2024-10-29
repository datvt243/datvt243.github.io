/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export interface ProfessionalSkill {
	name: string
	exp: number
	group: string
}

export interface ForeignLanguage {
	language: string
	level: string
}

interface BaseDocument {
	_id?: string
	createdAt?: string
	updatedAt?: string
	__v?: number
}

export interface SocialMedia {
	github: string
	linkedin: string
	website: string
}

export interface GeneralInformation extends BaseDocument {
	candidateId: string
	positionDesired: string
	career: string
	levelCurrent: string
	levelDesired: string
	salaryDesired: number
	education: string
	yearsOfExperience: number
	workLocation: string
	workForm: string
	careerGoal: string
	personalSkills: any[]
	professionalSkills?: ProfessionalSkill[]
	foreignLanguages?: ForeignLanguage[]
	professionalSkillsGroup?: string[]
}

export interface Experience extends BaseDocument {
	company: string
	position: string
	startDate: number
	endDate: number
	description: string
	isCurrent: boolean
	createdAt: string
	updatedAt: string
	candidateId: string
	skills: string[]
}

export interface Education extends BaseDocument {
	major: string
	startDate: number
	endDate: number
	description: string
	isCurrent: boolean
	candidateId: string
	school: string
}

export interface Project extends BaseDocument {
	name: string
	description: string
	position: string
	technologyUsed: string[]
	images: any[]
	link: string
	isWorking: boolean
	startDate: number
	endDate: number
	candidateId: string
	technology: string[]
}

export interface Information extends BaseDocument {
	email: string
	position: string
	gender: boolean
	birthday: number
	address: string
	phone: string
	introduction: string
	firstName: string
	lastName: string
	marital: boolean
	socialMedia: SocialMedia
}

export interface Resume extends Information {
	generalInformation: GeneralInformation
	experiences: Experience[]
	educations: Education[]
	projects: Project[]
}

export interface Item {
	title: string
	subTitle: string
	startDate: number
	endDate: number | null
	isCurrent: boolean
	description: string
	skills?: string[]
}
export interface Reference {
	fullName: string
	phone: string
	company: string
	position: string
}

export interface Certificate {
	name: string
	organization: string
	description?: string
	startDate: number
	endDate: number
	isNoExpiration: boolean
	link?: string
	images?: string[]
}

export interface Award {
	name: string
	organization: string
	issueDate: number
	link?: string
	images?: string[]
	description?: string
}
