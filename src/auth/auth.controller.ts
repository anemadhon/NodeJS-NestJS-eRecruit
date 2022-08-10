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
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { CandidateEntity } from 'src/candidate/entity/candidate.entity'
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

@ApiOkResponse({ description: `when eveything's OK` })
@ApiInternalServerErrorResponse({ description: `when thing's goes wrong` })
@ApiBadRequestResponse({
	description: `when the request wrong or not passed validation`,
})
@ApiTags('authentication')
@Controller({ path: 'authentication', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiForbiddenResponse({
		description: `when email not found or the email owner not passed the process yet`,
	})
	@HttpCode(200)
	@Post('email/validation')
	validateEmail(@Body() email: ValidationEmailDto) {
		return this.authService.validateEmail(email)
	}

	@ApiForbiddenResponse({
		description: `when email not found or the verification code not matched`,
	})
	@Get('email/:email/verification/:emailVerificationCode')
	verifyEmail(@Param() params: VerificationEmailDto) {
		return this.authService.verifyEmail(params)
	}

	@ApiForbiddenResponse({ description: `when email not found` })
	@HttpCode(200)
	@Post('account/validation')
	validateAccount(@Body() account: ValidationAccountDto) {
		return this.authService.validateAccount(account)
	}

	@ApiForbiddenResponse({ description: `when credentials not matched` })
	@ApiUnprocessableEntityResponse({ description: `when user logged in before` })
	@HttpCode(200)
	@Post('login')
	signin(@Body() login: LoginDto) {
		return this.authService.login(login)
	}

	@ApiUnauthorizedResponse({ description: `when refresh token not matched` })
	@ApiUnprocessableEntityResponse({
		description: `when access token still valid`,
	})
	@HttpCode(200)
	@Post('refresh')
	refresh(@Body() refreshToken: RefreshTokenDto) {
		return this.authService.refresh(refreshToken)
	}

	@ApiUnauthorizedResponse({ description: `when access token expired` })
	@ApiBearerAuth()
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	@Post('logout')
	signout(@AuthenticatedUser() user: CandidateEntity | EmployeeEntity) {
		return this.authService.logout(user)
	}
}
