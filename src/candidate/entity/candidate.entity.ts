import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { ApplicantEntity } from 'src/applicant/applicant.entity'

export class CandidateEntity {
	@ApiProperty()
	id: number
	@ApiProperty()
	email: string
	@ApiProperty()
	username: string | null
	@ApiProperty()
	firstName: string
	@ApiProperty()
	lastName: string | null
	@ApiProperty()
	phone: string

	@ApiPropertyOptional()
	token?: {
		type: string
		accessToken: string
		refreshToken: string
	}

	@ApiPropertyOptional()
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
