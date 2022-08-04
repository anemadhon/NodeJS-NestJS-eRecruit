import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { UtilService } from 'src/util/util.service'
import {
	ApplyJobDto,
	CompleteExperiencesDto,
	CompleteSkillsDto,
	CompleteSocialDto,
} from './candidate.dto'
import { CandidateEntity } from './candidate.entity'

@Injectable()
export class CandidateService {
	constructor(private prisma: PrismaService, private utils: UtilService) {}

	async applies({
		firstName,
		lastName,
		email,
		phone,
		submittedAt,
		processStateId,
		jobId,
	}: ApplyJobDto) {
		const candidate = await this.prisma.candidate
			.upsert({
				where: { email },
				update: {},
				create: {
					firstName,
					lastName,
					email,
					phone,
					applicants: {
						create: {
							submittedAt,
							processStateId,
							jobId,
						},
					},
				},
				include: {
					applicants: {
						include: {
							job: true,
							processState: true,
						},
					},
				},
			})
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your application is sent',
			result: new CandidateEntity(candidate),
		}
	}

	async completeSkill(
		authenticatedUser: CandidateEntity,
		username: string,
		body: CompleteSkillsDto
	) {
		if (authenticatedUser?.username !== username) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const data = body.skills.map(skill => ({
			...skill,
			candidateId: authenticatedUser.id,
		}))

		const skills = await this.prisma.candidateSkill
			.createMany({ data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your skills added successfully',
			result: { skills },
		}
	}

	async completeSocial(
		authenticatedUser: CandidateEntity,
		username: string,
		body: CompleteSocialDto
	) {
		if (authenticatedUser?.username !== username) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const data = { ...body, candidateId: authenticatedUser.id }

		const social = await this.prisma.candidateSocial
			.create({ data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your social media added successfully',
			result: { social },
		}
	}

	async completeExperience(
		authenticatedUser: CandidateEntity,
		username: string,
		body: CompleteExperiencesDto
	) {
		if (authenticatedUser?.username !== username) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const data = body.experiences.map(experience => ({
			...experience,
			candidateId: authenticatedUser.id,
		}))

		const experiences = await this.prisma.candidateExperience
			.createMany({ data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your work experiences added successfully',
			result: { workExperiences: experiences },
		}
	}
}
