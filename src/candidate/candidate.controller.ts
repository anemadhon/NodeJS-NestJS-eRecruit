import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	ParseFilePipeBuilder,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/auth/auth-user.decorator'
import {
	ApplyJobDto,
	CandidateResumeDto,
	CompleteExperiencesDto,
	CompleteSkillsDto,
	CompleteSocialDto,
} from './candidate.dto'
import { CandidateEntity } from './entity/candidate.entity'
import { CandidateService } from './candidate.service'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiOkResponse({ description: `when eveything's OK` })
@ApiUnauthorizedResponse({ description: `when access token expired` })
@ApiInternalServerErrorResponse({ description: `when thing's goes wrong` })
@ApiTags('candidate')
@Controller({ path: 'candidates', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class CandidateController {
	constructor(private readonly candidateService: CandidateService) {}

	@ApiOkResponse({ description: `when eveything's OK` })
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	me(@AuthenticatedUser() authenticatedUser: CandidateEntity) {
		return {
			message: 'Get authenticated user successfully',
			result: new CandidateEntity(authenticatedUser),
		}
	}

	@ApiCreatedResponse({
		description: `when candidate applying job successfully`,
	})
	@Post('jobs/applies')
	applies(@Body() body: ApplyJobDto) {
		return this.candidateService.applies(body)
	}

	@ApiForbiddenResponse({
		description: `username not matched`,
	})
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

	@ApiForbiddenResponse({
		description: `username not matched`,
	})
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

	@ApiForbiddenResponse({
		description: `username not matched`,
	})
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

	@ApiForbiddenResponse({
		description: `username not matched`,
	})
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@UseGuards(AuthGuard('jwt'))
	@Post(':username/resume')
	@UseInterceptors(FileInterceptor('resume'))
	uploadResume(
		@AuthenticatedUser() authenticatedUser: CandidateEntity,
		@Param('username') username: string,
		@Body() body: CandidateResumeDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: 'pdf',
				})
				.addMaxSizeValidator({
					maxSize: 3000000,
				})
				.build()
		)
		resume: Express.Multer.File
	) {
		const metaResume = {
			fileName: resume.filename,
			originalName: resume.originalname,
			path: resume.path,
		}

		return this.candidateService.uploadResume({
			...authenticatedUser,
			usernameFromParam: username,
			...metaResume,
		})
	}
}
