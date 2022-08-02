import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsJWT,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from 'class-validator'

export const usernameRegex = /^[a-zA-Z0-9_.-]*$/

export class ValidationEmailDto {
	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string
}

export class ValidationAccountDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	passwordResetCode: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Matches(usernameRegex)
	username: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string
}

export class VerificationEmailDto {
	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	emailVerificationCode: string
}

export class LoginDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string
}

export class RefreshTokenDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsJWT()
	refreshToken: string
}
