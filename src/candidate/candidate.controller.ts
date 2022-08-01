import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
} from '@nestjs/common'
import { CandidateDto } from './candidate.dto'
import { CandidateService } from './candidate.service'

@Controller({ path: 'applications', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class CandidateController {
	constructor(private readonly candidateService: CandidateService) {}

	@Post('applies')
	applies(@Body() body: CandidateDto) {
		return this.candidateService.applies(body)
	}
}
