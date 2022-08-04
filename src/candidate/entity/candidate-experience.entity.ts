import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class CandidateExperienceEntity {
	@ApiProperty()
	company: string

	@ApiProperty()
	title: string

	@ApiProperty()
	joinedAt: string

	@ApiProperty()
	endedAt: string

	@ApiProperty()
	description: string

	@Exclude()
	id: number

	@Exclude()
	candidateId: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<CandidateExperienceEntity>) {
		Object.assign(this, data)
	}
}
