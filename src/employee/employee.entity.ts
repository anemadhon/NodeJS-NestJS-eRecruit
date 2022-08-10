import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class EmployeeEntity {
	@ApiProperty()
	id: number

	@ApiProperty()
	nik: string

	@ApiProperty()
	email: string

	@ApiProperty()
	name: string

	@ApiProperty()
	title: string

	@ApiProperty({ required: false })
	token?: {
		type: string
		accessToken: string
		refreshToken?: string
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
