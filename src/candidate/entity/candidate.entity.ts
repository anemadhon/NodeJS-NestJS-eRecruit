import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'
import { ApplicantEntity } from 'src/applicant/applicant.entity'
import { CandidateExperienceEntity } from './candidate-experience.entity'
import { CandidateSkillEntity } from './candidate-skil.entity'
import { CandidateSocialEntity } from './candidate.social.entity'

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
		refreshToken?: string
	}

	@ApiProperty()
	@Expose({ name: 'skills' })
	@Type(() => CandidateSkillEntity)
	candidateSkills?: CandidateSkillEntity[]

	@ApiProperty()
	@Expose({ name: 'social' })
	@Type(() => CandidateSocialEntity)
	candidateSocial?: CandidateSocialEntity

	@ApiProperty()
	@Expose({ name: 'experiences' })
	@Type(() => CandidateExperienceEntity)
	candidateExperiences?: CandidateExperienceEntity[]

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

	constructor(
		data: Partial<CandidateEntity & ApplicantEntity & CandidateSkillEntity>
	) {
		Object.assign(this, data)
	}
}
