import { Exclude } from 'class-transformer'

export class JobEntity {
	id: number
	name: string
	slug: string
	slot: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<JobEntity>) {
		Object.assign(this, data)
	}
}
