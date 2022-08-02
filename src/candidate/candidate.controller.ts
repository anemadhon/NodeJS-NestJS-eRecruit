import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CandidateDto } from './candidate.dto'
import { CandidateService } from './candidate.service'

@ApiTags('applying job')
@Controller({ path: 'applications', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class CandidateController {
	constructor(private readonly candidateService: CandidateService) {}

	@Post('applies')
	applies(@Body() body: CandidateDto) {
		return this.candidateService.applies(body)
	}
}
