import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsNumberString,
	IsString,
} from 'class-validator'

export class ApplyJobDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiPropertyOptional()
	@IsString()
	lastName: string | null

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty()
	@IsNumberString()
	@IsNotEmpty()
	phone: string

	@ApiProperty({ description: 'the value must be UNIX (Epoch) time Format' })
	@IsString()
	@IsNotEmpty()
	submittedAt: string

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	jobId: number
}
