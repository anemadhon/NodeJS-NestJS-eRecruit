import { Exclude } from 'class-transformer'

export class ProcessStateEntity {
	id: number
	state: string
	tags: string
	detail: string

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<ProcessStateEntity>) {
		Object.assign(this, data)
	}
}
