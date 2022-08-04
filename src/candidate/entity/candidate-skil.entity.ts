import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class CandidateSkillEntity {
	@ApiProperty()
	skill: string

	@ApiProperty()
	level: number

	@Exclude()
	id: number

	@Exclude()
	candidateId: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<CandidateSkillEntity>) {
		Object.assign(this, data)
	}
}
