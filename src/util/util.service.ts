import { MailerService } from '@nestjs-modules/mailer'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { v4 as uuid } from 'uuid'
import { Cache } from 'cache-manager'
import { tryCatchErrorHandling } from './util-http-error.filter'
import { CandidateEntity } from 'src/candidate/entity/candidate.entity'
import { EmployeeEntity } from 'src/employee/employee.entity'

@Injectable()
export class UtilService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mailerService: MailerService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
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
			where: { email: username },
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

	async updateRefreshTokenEmployee({
		data,
		where,
	}: {
		data: { refreshToken: string | null }
		where: { id: number }
	}) {
		return await this.prisma.employee.update({ data, where })
	}

	async updateSingleCandidate<TDataToUpdate>({
		data,
		where,
	}: {
		data: TDataToUpdate
		where: { id: number }
	}) {
		return await this.prisma.candidate.update({ data, where })
	}

	generateUUID(): string {
		return uuid()
	}

	async sendAnEmail({
		email,
		code,
		flag,
	}: {
		email: string
		code: string
		flag: string
	}) {
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

	async clearAllToken(user: CandidateEntity | EmployeeEntity): Promise<void> {
		if (user && 'nik' in user) {
			await this.updateRefreshTokenEmployee({
				data: { refreshToken: null },
				where: { id: user.id },
			}).catch(error => tryCatchErrorHandling(error))
		}

		if (user && 'username' in user) {
			await this.updateSingleCandidate({
				data: { refreshToken: null },
				where: { id: user.id },
			}).catch(error => tryCatchErrorHandling(error))
		}

		await this.resetRedis()
	}

	async setDataToRedis({
		key,
		value,
	}: {
		key: string
		value: string
	}): Promise<void> {
		await this.cacheManager
			.set(key, value)
			.catch(error => tryCatchErrorHandling(error))
	}

	async getDataToRedis(key: string): Promise<string> {
		return await this.cacheManager.get(key)
	}

	async resetRedis(): Promise<void> {
		await this.cacheManager.reset().catch(error => tryCatchErrorHandling(error))
	}
}
