import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { UtilService } from 'src/util/util.service'
import {
	// ApplyJobDto,
	CompleteExperiencesDto,
	CompleteSkillsDto,
	CompleteSocialDto,
} from './candidate.dto'
import { CandidateEntity } from './entity/candidate.entity'

@Injectable()
export class CandidateService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly utils: UtilService
	) {}

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

	async uploadResume({
		id: candidateId,
		username,
		usernameFromParam,
		fileName,
		originalName,
		path,
	}: CandidateEntity & { usernameFromParam: string } & {
		fileName: string
		originalName: string
		path: string
	}) {
		if (username !== usernameFromParam) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const candidate = await this.utils.getSingleCandidate({ username })
		const resumeToSaved = `${path}//${username}^${fileName}^${originalName}`
		const data = {
			whatsapp: candidate?.candidateSocial?.whatsapp,
			instagram: candidate?.candidateSocial?.instagram,
			linkedin: candidate?.candidateSocial?.linkedin,
			github: candidate?.candidateSocial?.github,
			resume: resumeToSaved,
			candidateId,
		}
		const result = await this.prisma.candidateSocial
			.upsert({ where: { candidateId }, update: data, create: data })
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your resume added successfully',
			result: {
				resume: {
					id: result.id,
					resume: result.resume,
				},
			},
		}
	}
}
