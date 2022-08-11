import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsInt,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator'

export class CompleteSkillDto {
	@ApiProperty()
	@IsString()
	skill: string

	@ApiProperty()
	@IsInt()
	@Min(1)
	@Max(5)
	level: number
}

export class CompleteSkillsDto {
	@ApiProperty({ isArray: true, type: CompleteSkillDto })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompleteSkillDto)
	skills: CompleteSkillDto[]
}

export class CompleteSocialDto {
	@ApiPropertyOptional()
	@IsString()
	whatsapp: string

	@ApiPropertyOptional()
	@IsString()
	instagram: string

	@ApiPropertyOptional()
	@IsString()
	linkedin: string

	@ApiPropertyOptional()
	@IsString()
	github: string
}

export class CompleteExperienceDto {
	@ApiProperty()
	@IsString()
	company: string

	@ApiProperty()
	@IsString()
	title: string

	@ApiProperty({ description: 'the value must be UNIX (Epoch) time Format' })
	@IsString()
	joinedAt: string

	@ApiProperty({ description: 'the value must be UNIX (Epoch) time Format' })
	@IsString()
	endedAt: string

	@ApiProperty()
	@IsString()
	description: string
}

export class CompleteExperiencesDto {
	@ApiProperty({ isArray: true, type: CompleteExperienceDto })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CompleteExperienceDto)
	experiences: CompleteExperienceDto[]
}

export class CandidateResumeDto {
	@ApiProperty({ type: 'file' })
	resume: any
}
