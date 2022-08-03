import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator'

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

export class CompleteSkillDto {
	@IsString()
	skill: string

	@IsInt()
	@Min(1)
	@Max(5)
	level: number
}

export class CompleteSkillsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompleteSkillDto)
	skills: CompleteSkillDto[]
}
