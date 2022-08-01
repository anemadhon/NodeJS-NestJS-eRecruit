import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsString,
} from 'class-validator'

export class CandidateDto {
	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsString()
	lastName: string | null

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	phone: string

    @IsString()
	@IsNotEmpty()
	submittedAt: string

	@IsInt()
	@IsNotEmpty()
	processStateId: number

	@IsInt()
	@IsNotEmpty()
	jobId: number
}
