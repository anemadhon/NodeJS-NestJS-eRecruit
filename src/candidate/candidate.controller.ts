import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Param,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/auth/auth-user.decorator'
import { CandidateDto, CompleteSkillsDto } from './candidate.dto'
import { CandidateEntity } from './candidate.entity'
import { CandidateService } from './candidate.service'

@ApiTags('candidate')
@Controller({ path: 'applications', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class CandidateController {
	constructor(private readonly candidateService: CandidateService) {}

	@Post('applies')
	applies(@Body() body: CandidateDto) {
		return this.candidateService.applies(body)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Post('candidates/:username/completes/skills')
	completeSkill(
		@AuthenticatedUser() authenticatedUser: CandidateEntity,
		@Param('username') username: string,
		@Body() body: CompleteSkillsDto
	) {
		return this.candidateService.completeSkill(
			authenticatedUser,
			username,
			body
		)
	}
}
