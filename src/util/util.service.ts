import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { v4 as uuid } from 'uuid'

@Injectable()
export class UtilService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mailerService: MailerService
	) {}

	async checkUserByUsername(username: string) {
		if (username.includes('@')) {
			return await this.getSingleEmployee(username)
		}

		return await this.getSingleCandidate({ username })
	}

	async getSingleProcessState(id: number) {
		return await this.prisma.processState.findFirst({
			where: { id },
		})
	}

	async getSingleEmployee(username: string) {
		return await this.prisma.employee.findFirst({
			where: {
				email: username,
			},
		})
	}

	async getSingleApplicant<TWhereCondition>(where: TWhereCondition) {
		return await this.prisma.applicant.findFirst({
			where,
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
	}

	async getSingleCandidate<TWhereCondition>(where: TWhereCondition) {
		return await this.prisma.candidate.findFirst({
			where,
			include: {
				applicants: {
					include: {
						processState: true,
						job: true,
					},
				},
				candidateSkills: true,
				candidateExperiences: true,
				candidateSocial: true,
			},
		})
	}

	async updateRefreshTokenEmployee(
		data: { refreshToken: string },
		where: { id: number }
	) {
		return await this.prisma.employee.update({ data, where })
	}

	async updateSingleCandidate<TDataToUpdate>(
		data: TDataToUpdate,
		where: { id: number }
	) {
		return await this.prisma.candidate.update({ data, where })
	}

	generateUUID(): string {
		return uuid()
	}

	async sendAnEmail({ email, code, flag }) {
		const url =
			flag === 'verify'
				? `http://localhost:3000/v1/authentication/email/${email}/verification/${code}`
				: `http://localhost:3000/pages/aaccount/register/${code}`

		const subject =
			flag === 'verify'
				? 'Welcome to eRecruit App! Verify your Email'
				: 'Welcome to eRecruit App! Validate your Account'

		await this.mailerService.sendMail({
			to: email,
			subject,
			text: `please click this link ${url}`,
		})
	}
}
