import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/auth/auth-user.decorator'
import {
	ApplyJobDto,
	CompleteExperiencesDto,
	CompleteSkillsDto,
	CompleteSocialDto,
} from './candidate.dto'
import { CandidateEntity } from './entity/candidate.entity'
import { CandidateService } from './candidate.service'

@ApiTags('candidate')
@Controller({ path: 'candidates', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class CandidateController {
	constructor(private readonly candidateService: CandidateService) {}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	me(@AuthenticatedUser() authenticatedUser: CandidateEntity) {
		return {
			message: 'Get authenticated user successfully',
			result: new CandidateEntity(authenticatedUser),
		}
	}

	@Post('jobs/applies')
	applies(@Body() body: ApplyJobDto) {
		return this.candidateService.applies(body)
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Post(':username/completes/skills')
	completeSkill(
		@AuthenticatedUser() authenticatedUser: CandidateEntity,
		@Param('username') username: string,
		@Body() body: CompleteSkillsDto
	) {
		return this.candidateService.completeSkill({
			...authenticatedUser,
			usernameFromParam: username,
			skills: body.skills,
		})
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Post(':username/completes/socials')
	completeSocial(
		@AuthenticatedUser() authenticatedUser: CandidateEntity,
		@Param('username') username: string,
		@Body() body: CompleteSocialDto
	) {
		return this.candidateService.completeSocial({
			...authenticatedUser,
			...body,
			usernameFromParam: username,
		})
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Post(':username/completes/experiences')
	completeExperience(
		@AuthenticatedUser() authenticatedUser: CandidateEntity,
		@Param('username') username: string,
		@Body() body: CompleteExperiencesDto
	) {
		return this.candidateService.completeExperience({
			...authenticatedUser,
			usernameFromParam: username,
			experiences: body.experiences,
		})
	}
}
