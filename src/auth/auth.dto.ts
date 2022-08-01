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
	@IsEmail()
	@IsNotEmpty()
	email: string
}

export class ValidationAccountDto {
	@IsString()
	@IsNotEmpty()
	passwordResetCode: string

	@IsString()
	@IsNotEmpty()
	@Matches(usernameRegex)
	username: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string
}

export class VerificationEmailDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	emailVerificationCode: string
}

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	username: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string
}

export class RefreshTokenDto {
	@IsNotEmpty()
	@IsJWT()
	refreshToken: string
}
