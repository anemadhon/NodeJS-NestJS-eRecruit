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
import { CandidateEntity } from './entity/candidate.entity'

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

	async completeSkill({
		id: candidateId,
		username,
		usernameFromParam,
		skills,
	}: CandidateEntity & CompleteSkillsDto & { usernameFromParam: string }) {
		if (username !== usernameFromParam) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const data = skills.map(skill => ({
			...skill,
			candidateId,
		}))

		const result = await this.prisma.candidateSkill
			.createMany({ data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your skills added successfully',
			result: { skills: result },
		}
	}

	async completeSocial({
		id: candidateId,
		username,
		usernameFromParam,
		whatsapp,
		instagram,
		linkedin,
		github,
	}: CandidateEntity & CompleteSocialDto & { usernameFromParam: string }) {
		if (username !== usernameFromParam) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const data = { whatsapp, instagram, linkedin, github, candidateId }

		const social = await this.prisma.candidateSocial
			.upsert({ where: { candidateId }, update: data, create: data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your social media added successfully',
			result: { social },
		}
	}

	async completeExperience({
		id: candidateId,
		username,
		usernameFromParam,
		experiences,
	}: CandidateEntity & CompleteExperiencesDto & { usernameFromParam: string }) {
		if (username !== usernameFromParam) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const data = experiences.map(experience => ({
			...experience,
			candidateId,
		}))

		const result = await this.prisma.candidateExperience
			.createMany({ data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your work experiences added successfully',
			result: { workExperiences: result },
		}
	}
}
