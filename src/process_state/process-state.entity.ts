import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class ProcessStateEntity {
	@ApiProperty()
	id: number

	@ApiProperty()
	state: string

	@ApiProperty()
	tags: string

	@ApiProperty()
	detail: string

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<ProcessStateEntity>) {
		Object.assign(this, data)
	}
}
