import { Exclude } from 'class-transformer'

export class EmployeeEntity {
	id: number
	nik: string
	email: string
	name: string
	title: string

	token?: {
		type: string
		accessToken: string
		refreshToken: string
	}

	@Exclude()
	password: string

	@Exclude()
	refreshToken: string

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	constructor(data: Partial<EmployeeEntity>) {
		Object.assign(this, data)
	}
}
