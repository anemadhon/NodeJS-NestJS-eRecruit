import { Injectable } from '@nestjs/common'
import { ApplicantEntity } from 'src/applicant/applicant.entity'
import { PrismaService } from 'src/prisma/prisma.service'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { UtilService } from 'src/util/util.service'
import { CandidateDto } from './candidate.dto'

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
}
