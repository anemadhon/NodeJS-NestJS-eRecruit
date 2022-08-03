import { ForbiddenException, Injectable } from '@nestjs/common'
import { ApplicantEntity } from 'src/applicant/applicant.entity'
import { PrismaService } from 'src/prisma/prisma.service'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { UtilService } from 'src/util/util.service'
import {
	CandidateDto,
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
	}: CandidateDto) {
		const candidate = await this.prisma.candidate
			.upsert({
				where: { email },
				update: {},
				create: {
					firstName,
					lastName,
					email,
					phone,
				},
			})
			.catch(error => tryCatchErrorHandling(error))

		const applicant = await this.prisma.applicant
			.create({
				data: {
					submittedAt,
					processStateId,
					jobId,
					candidateId: candidate.id,
				},
			})
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your application is sent',
			result: new ApplicantEntity(applicant),
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
		{ whatsapp, linkedin, instagram, github }: CompleteSocialDto
	) {
		if (authenticatedUser?.username !== username) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const social = await this.prisma.candidateSocial
			.create({
				data: {
					whatsapp,
					linkedin,
					github,
					instagram,
					candidateId: authenticatedUser.id,
				},
			})
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: 'Your social media added successfully',
			result: { social },
		}
	}
}
