import { Injectable } from '@nestjs/common'
import { CandidateEntity } from 'src/candidate/entity/candidate.entity'
import { PrismaService } from 'src/prisma/prisma.service'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { ApplyJobDto } from './applicant.dto'

@Injectable()
export class ApplicantService {
	constructor(private readonly prisma: PrismaService) {}

	async applies({
		firstName,
		lastName,
		email,
		phone,
		submittedAt,
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
							processStateId: 1,
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
}
