import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
} from '@nestjs/swagger'
import { ApplyJobDto } from './applicant.dto'
import { ApplicantService } from './applicant.service'

@ApiTags('application')
@Controller({ path: 'application', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicantController {
	constructor(private readonly applicantService: ApplicantService) {}

	@ApiInternalServerErrorResponse({ description: `when thing's goes wrong` })
	@ApiBadRequestResponse({
		description: `when the request wrong or not passed validation`,
	})
	@ApiCreatedResponse({
		description: `when candidate applying job successfully`,
	})
	@Post('applies')
	applies(@Body() body: ApplyJobDto) {
		return this.applicantService.applies(body)
	}
}
