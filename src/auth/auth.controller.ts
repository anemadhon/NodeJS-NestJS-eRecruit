import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CandidateEntity } from 'src/candidate/candidate.entity'
import { EmployeeEntity } from 'src/employee/employee.entity'
import { AuthenticatedUser } from './auth-user.decorator'
import {
	LoginDto,
	RefreshTokenDto,
	ValidationAccountDto,
	ValidationEmailDto,
	VerificationEmailDto,
} from './auth.dto'
import { AuthService } from './auth.service'

@Controller({ path: 'authentication', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('email/validation')
	validateEmail(@Body() email: ValidationEmailDto) {
		return this.authService.validateEmail(email)
	}

	@Get('email/:email/verification/:emailVerificationCode')
	verifyEmail(@Param() params: VerificationEmailDto) {
		return this.authService.verifyEmail(params)
	}

	@HttpCode(200)
	@Post('account/validation')
	validateAccount(@Body() account: ValidationAccountDto) {
		return this.authService.validateAccount(account)
	}

	@HttpCode(200)
	@Post('login')
	signin(@Body() login: LoginDto) {
		return this.authService.login(login)
	}

	@HttpCode(200)
	@Post('refresh')
	refresh(@Body() refreshToken: RefreshTokenDto) {
		return this.authService.refresh(refreshToken)
	}

	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	@Post('logout')
	signout(@AuthenticatedUser() user: CandidateEntity | EmployeeEntity) {
		return this.authService.logout(user)
	}
}
