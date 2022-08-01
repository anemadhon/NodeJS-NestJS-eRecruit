import { Exclude, Type } from 'class-transformer'
import { ApplicantEntity } from 'src/applicant/applicant.entity'

export class CandidateEntity {
	id: number
	email: string
	username: string | null
	firstName: string
	lastName: string | null
	phone: string

	token?: {
		type: string
		accessToken: string
		refreshToken: string
	}

	@Type(() => ApplicantEntity)
	applicants?: ApplicantEntity[]

	@Exclude()
	emailIsVerified: boolean

	@Exclude()
	emailVerificationCode: string

	@Exclude()
	password: string

	@Exclude()
	passwordResetCode: string

	@Exclude()
	refreshToken: string

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<CandidateEntity & ApplicantEntity>) {
		Object.assign(this, data)
	}
}
