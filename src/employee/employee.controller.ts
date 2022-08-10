import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/auth/auth-user.decorator'
import { Roles } from 'src/auth/role/role.decorator'
import { RolesGuard } from 'src/auth/role/role.guard'
import { EmployeeEntity } from './employee.entity'
import { EmployeeService } from './employee.service'

@ApiOkResponse({ description: `when eveything's OK` })
@ApiUnauthorizedResponse({ description: `when access token expired` })
@ApiInternalServerErrorResponse({ description: `when thing's goes wrong` })
@ApiBadRequestResponse({
	description: `when the request wrong or not passed validation`,
})
@ApiTags('employee / admin')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'employees/admin', version: '1' })
export class EmployeeController {
	constructor(private readonly employeeServie: EmployeeService) {}

	@ApiOkResponse({ description: `when eveything's OK` })
	@Get('me')
	me(@AuthenticatedUser() authenticatedUser: EmployeeEntity) {
		return {
			message: 'Get authenticated user successfully',
			result: new EmployeeEntity(authenticatedUser),
		}
	}

	@ApiOkResponse({ description: `when eveything's OK` })
	@Get('applicants')
	getAllApplicant() {
		return this.employeeServie.getAll()
	}

	@ApiNotFoundResponse({
		description: `when candidate or process state not found`,
	})
	@ApiUnprocessableEntityResponse({ description: `when admin updated before` })
	@HttpCode(200)
	@Patch('applicants/:id/states/:stateId')
	updateApplicantState(
		@Param('id', ParseIntPipe) idApplicant: number,
		@Param('stateId', ParseIntPipe) idState: number
	) {
		return this.employeeServie.updateState({
			id: idApplicant,
			stateId: idState,
		})
	}
}
