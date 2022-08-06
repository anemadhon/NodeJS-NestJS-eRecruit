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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/auth/auth-user.decorator'
import { Roles } from 'src/auth/role/role.decorator'
import { RolesGuard } from 'src/auth/role/role.guard'
import { EmployeeEntity } from './employee.entity'
import { EmployeeService } from './employee.service'

@ApiTags('employee / admin')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'employees/admin', version: '1' })
export class EmployeeController {
	constructor(private readonly employeeServie: EmployeeService) {}

	@Get('me')
	me(@AuthenticatedUser() authenticatedUser: EmployeeEntity) {
		return {
			message: 'Get authenticated user successfully',
			result: new EmployeeEntity(authenticatedUser),
		}
	}

	@Get('applicants')
	getAllApplicant() {
		return this.employeeServie.getAll()
	}

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
