import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class CandidateSocialEntity {
	@ApiProperty()
	whatsapp: string

	@ApiProperty()
	instagram: string

	@ApiProperty()
	linkedin: string

	@ApiProperty()
	github: string

	@Exclude()
	id: number

	@Exclude()
	resume: string

	@Exclude()
	candidateId: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<CandidateSocialEntity>) {
		Object.assign(this, data)
	}
}
