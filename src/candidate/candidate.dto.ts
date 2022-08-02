import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CandidateDto {
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
	@IsString()
	@IsNotEmpty()
	phone: string

	@ApiProperty({
		description: 'the value must be UNIX (Epoch) time Format',
	})
	@IsString()
	@IsNotEmpty()
	submittedAt: string

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	processStateId: number

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	jobId: number
}
