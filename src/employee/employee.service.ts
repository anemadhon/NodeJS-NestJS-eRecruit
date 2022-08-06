import {
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { PrismaService } from 'src/prisma/prisma.service'
import { ApplicantEntity } from 'src/applicant/applicant.entity'
import { ApplicantsEntity } from 'src/applicant/applicants.entity'
import { UtilService } from 'src/util/util.service'

@Injectable()
export class EmployeeService {
	constructor(private prisma: PrismaService, private utils: UtilService) {}

	async getAll() {
		const applicants = await this.prisma.applicant
			.findMany({
				include: {
					processState: true,
					job: true,
					candidate: {
						include: {
							candidateSkills: true,
							candidateExperiences: true,
							candidateSocial: true,
						},
					},
				},
			})
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: applicants
				? 'Applicants list found successfully'
				: 'No data found',
			result: new ApplicantsEntity({ applicants }),
		}
	}

	async updateState({ id, stateId }: { id: number; stateId: number }) {
		const state = await this.utils
			.getSingleProcessState(stateId)
			.catch(error => tryCatchErrorHandling(error))

		if (!state)
			throw new NotFoundException('NotFoundException - Process State not found')

		const applicant = await this.utils
			.getSingleApplicant({ id })
			.catch(error => tryCatchErrorHandling(error))

		if (!applicant)
			throw new NotFoundException('NotFoundException - Candidate not found')

		if (applicant.processState.id === stateId) {
			throw new UnprocessableEntityException(
				'UnprocessableEntityException - You have done this before'
			)
		}

		const applicantStateUpdated = await this.prisma.applicant
			.update({
				where: { id },
				data: { processStateId: stateId },
				include: {
					processState: true,
					job: true,
					candidate: {
						include: {
							candidateSkills: true,
							candidateExperiences: true,
							candidateSocial: true,
						},
					},
				},
			})
			.catch(error => tryCatchErrorHandling(error))

		return {
			message: applicantStateUpdated
				? 'Update process state successfully'
				: 'Update process state failed',
			result: new ApplicantEntity(applicantStateUpdated),
		}
	}
}
