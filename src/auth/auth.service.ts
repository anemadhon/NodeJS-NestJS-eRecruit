import {
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
	LoginDto,
	RefreshTokenDto,
	ValidationAccountDto,
	ValidationEmailDto,
	VerificationEmailDto,
} from './auth.dto'
import * as argon from 'argon2'
import { UtilService } from 'src/util/util.service'
import { JwtPayload } from './jwt/jwt.interface'
import { CandidateEntity } from 'src/candidate/entity/candidate.entity'
import {
	ExceptionInterface,
	tryCatchErrorHandling,
} from 'src/util/util-http-error.filter'
import { EmployeeEntity } from 'src/employee/employee.entity'
import { CandidateResumeEntity } from 'src/candidate/entity/candidate-resume.entity'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		private readonly config: ConfigService,
		private readonly utils: UtilService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
	) {}

	async validateEmail({ email }: ValidationEmailDto) {
		const user = await this.utils
			.getSingleCandidate({ email })
			.catch(error => tryCatchErrorHandling(error))

		if (!user) {
			throw new ForbiddenException(
				'ForbiddenException - You are not allowed to this action'
			)
		}

		const userHaveNotPassedInitialState =
			user.applicants.find(applicants => applicants.candidateId === user.id)
				.processStateId !== 2

		if (userHaveNotPassedInitialState) {
			throw new ForbiddenException(
				'ForbiddenException - You are not allowed to this action'
			)
		}

		const cv: CandidateResumeEntity = {
			resume: user?.candidateSocial?.resume,
			meta: {
				filename: user?.candidateSocial?.resume.split('^')[2],
				originalName: user?.candidateSocial?.resume.split('^')[1],
				extension: 'pdf',
				mimetype: 'application/pdf',
				path: user?.candidateSocial?.resume.split('//')[0],
			},
		}

		if (user.emailIsVerified && user.username) {
			this.logger.info(
				`${
					user.username
				} try to access validateEmail at ${Date.now()}, but he did it`
			)

			return {
				message: 'You have complated validatiion & verification, please login',
				result: new CandidateEntity({ ...user, cv }),
			}
		}

		if (user.emailIsVerified && user.passwordResetCode && !user.username) {
			this.sendEmail({ ...user, cv })
		}

		if (user.emailIsVerified && !user.username) {
			this.updateAndSendEmail({
				data: { passwordResetCode: this.utils.generateUUID() },
				where: { id: user.id },
			})
		}

		this.updateAndSendEmail({
			data: { emailVerificationCode: this.utils.generateUUID() },
			where: { id: user.id },
		})
	}

	async verifyEmail({ email, emailVerificationCode }: VerificationEmailDto) {
		const user = await this.utils
			.getSingleCandidate({ email })
			.catch(error => tryCatchErrorHandling(error))

		if (!user) {
			throw new ForbiddenException(
				'ForbiddenException - You are not allowed to this action'
			)
		}

		const emailVerificationCodeNotMatched =
			user.emailVerificationCode !== emailVerificationCode

		if (emailVerificationCodeNotMatched) {
			throw new ForbiddenException(
				'ForbiddenException - You are not allowed to this action'
			)
		}

		const cv: CandidateResumeEntity = {
			resume: user?.candidateSocial?.resume,
			meta: {
				filename: user?.candidateSocial?.resume.split('^')[2],
				originalName: user?.candidateSocial?.resume.split('^')[1],
				extension: 'pdf',
				mimetype: 'application/pdf',
				path: user?.candidateSocial?.resume.split('//')[0],
			},
		}

		if (user.emailIsVerified) {
			this.logger.info(
				`${
					user.username
				} try to access verifyEmail at ${Date.now()}, but he did it`
			)

			return {
				message: 'You have complated validatiion & verification, please login',
				result: new CandidateEntity({ ...user, cv }),
			}
		}

		this.updateAndSendEmail({
			data: {
				passwordResetCode: this.utils.generateUUID(),
				emailIsVerified: true,
				emailVerificationCode: null,
			},
			where: { id: user.id },
		})
	}

	async validateAccount({
		username,
		password,
		passwordResetCode,
	}: ValidationAccountDto) {
		const user = await this.utils
			.getSingleCandidate({
				passwordResetCode,
			})
			.catch(error => tryCatchErrorHandling(error))

		if (!user) {
			throw new ForbiddenException(
				'ForbiddenException - You are not allowed to this action'
			)
		}

		const accountValidated = await this.utils
			.updateSingleCandidate({
				data: {
					username,
					password: await argon.hash(password),
					passwordResetCode: null,
				},
				where: { id: user.id },
			})
			.catch(error => tryCatchErrorHandling(error))
		const refreshTokenUpdated = await this.generateAndUpdateToken(
			accountValidated
		)
		const cv: CandidateResumeEntity = {
			resume: user?.candidateSocial?.resume,
			meta: {
				filename: user?.candidateSocial?.resume.split('^')[2],
				originalName: user?.candidateSocial?.resume.split('^')[1],
				extension: 'pdf',
				mimetype: 'application/pdf',
				path: user?.candidateSocial?.resume.split('//')[0],
			},
		}

		this.logger.info(
			`${
				refreshTokenUpdated.data.email
			} successfully create an account at ${Date.now()}${
				'username' in refreshTokenUpdated?.data
					? ', his username is ' + refreshTokenUpdated?.data?.username
					: ''
			}`
		)

		return {
			message: `You are validated, welcome ${
				'username' in refreshTokenUpdated?.data
					? refreshTokenUpdated.data.username
					: ''
			}`,
			result: new CandidateEntity({
				...user,
				cv,
				token: refreshTokenUpdated?.token,
			}),
		}
	}

	async login({ username, password }: LoginDto) {
		const user = await this.utils
			.checkUserByUsername(username)
			.catch(error => tryCatchErrorHandling(error))

		if (!user)
			throw new ForbiddenException('ForbiddenException - Credentials incorrect')

		if (user.refreshToken) {
			throw new UnprocessableEntityException(
				'UnprocessableEntityException - You are logged in, please logout to continue'
			)
		}

		const isPasswordMatches = await argon
			.verify(user.password, password)
			.catch(error => tryCatchErrorHandling(error))

		if (!isPasswordMatches) {
			throw new ForbiddenException('ForbiddenException - Credentials incorrect')
		}

		const refreshTokenUpdated = await this.generateAndUpdateToken(user)
		const cv: CandidateResumeEntity =
			'username' in user
				? {
						resume: user?.candidateSocial?.resume,
						meta: {
							filename: user?.candidateSocial?.resume.split('^')[2],
							originalName: user?.candidateSocial?.resume.split('^')[1],
							extension: 'pdf',
							mimetype: 'application/pdf',
							path: user?.candidateSocial?.resume.split('//')[0],
						},
				  }
				: null

		this.logger.info(
			`${refreshTokenUpdated.data.email} successfully login at ${Date.now()}`
		)

		return {
			message: `You are validated, welcome ${
				'nik' in refreshTokenUpdated?.data
					? refreshTokenUpdated?.data?.name
					: refreshTokenUpdated?.data?.username
			}`,
			result:
				'nik' in refreshTokenUpdated?.data
					? new EmployeeEntity({ ...user, token: refreshTokenUpdated?.token })
					: new CandidateEntity({
							...user,
							cv,
							token: refreshTokenUpdated?.token,
					  }),
		}
	}

	logout(user: CandidateEntity | EmployeeEntity) {
		this.utils.clearAllToken(user)

		this.logger.info(`${user.email} successfully logout at ${Date.now()}`)

		return {
			message: 'Logout Successfully',
			result: null,
		}
	}

	async refresh({ refreshToken }: RefreshTokenDto) {
		const payload = await this.jwt
			.verifyAsync(refreshToken, {
				secret: this.config.get<string>('JWT_REFRESH_SECRET'),
			})
			.catch(error => this.handleRefreshTokenExipred({ error, refreshToken }))

		if ('username' in payload) {
			const tokenFromRedis = await this.utils.getDataToRedis(payload.email)

			if (tokenFromRedis) {
				throw new UnprocessableEntityException(
					'UnprocessableEntityException - This action only for expired JWT token'
				)
			}

			const user = await this.utils
				.checkUserByUsername(payload.username)
				.catch(error => tryCatchErrorHandling(error))

			if (user.refreshToken !== refreshToken) {
				this.utils.clearAllToken(user)

				throw new UnauthorizedException(
					'UnauthorizedException - Please login to continue'
				)
			}

			const accessToken = await this.generateJWTToken({
				sub: user.id,
				username: 'username' in user ? user.username : user.nik,
				email: user.email,
				options: {
					expiresIn: this.config.get<string>('JWT_EXPIRE'),
					secret: this.config.get<string>('JWT_SECRET'),
				},
			})
			const cv: CandidateResumeEntity =
				'username' in user
					? {
							resume: user?.candidateSocial?.resume,
							meta: {
								filename: user?.candidateSocial?.resume.split('^')[2],
								originalName: user?.candidateSocial?.resume.split('^')[1],
								extension: 'pdf',
								mimetype: 'application/pdf',
								path: user?.candidateSocial?.resume.split('//')[0],
							},
					  }
					: null

			this.utils.setDataToRedis({ key: user.email, value: accessToken })

			this.logger.info(
				`${user.email} successfully refresh his access token at ${Date.now()}`
			)

			return {
				message: `You are validated, welcome ${
					'nik' in user ? user.name : user.username
				}`,
				result:
					'nik' in user
						? new EmployeeEntity({
								...user,
								token: { type: 'Bearer', accessToken },
						  })
						: new CandidateEntity({
								...user,
								cv,
								token: { type: 'Bearer', accessToken },
						  }),
			}
		}
	}

	private async updateAndSendEmail<TDataToUpdate>({
		data,
		where,
	}: {
		data: TDataToUpdate
		where: { id: number }
	}) {
		const updatedData = await this.utils
			.updateSingleCandidate({ data, where })
			.catch(error => tryCatchErrorHandling(error))

		let reason = updatedData.emailIsVerified ? 'reset password' : 'verify email'

		reason = updatedData.username ? 'resend en email' : reason

		this.logger.info(
			`sistem send an email to ${
				updatedData.email
			} at ${Date.now()}. Reason: ${reason}`
		)

		this.sendEmail(updatedData)
	}

	private sendEmail(user: CandidateEntity) {
		this.utils
			.sendAnEmail({
				email: user.email,
				code: user.emailIsVerified
					? user.passwordResetCode
					: user.emailVerificationCode,
				flag: user.emailIsVerified ? 'reset' : 'verify',
			})
			.catch(error => tryCatchErrorHandling(error))

		let reason = user.emailIsVerified ? 'reset password' : 'verify email'

		reason = user.username ? 'resend en email' : reason

		this.logger.info(
			`sistem send an email to ${
				user.email
			} at ${Date.now()}. Reason: ${reason}`
		)

		return {
			message: 'Please check your email to continue',
			result: new CandidateEntity(user),
		}
	}

	private async generateAndUpdateToken(user: CandidateEntity | EmployeeEntity) {
		const token = await this.setJWTTokenSchema({
			id: user.id,
			email: user.email,
			username: 'nik' in user ? user.email : user.username,
		}).catch(error => tryCatchErrorHandling(error))
		const refreshTokenUpdated =
			'nik' in user
				? await this.utils
						.updateRefreshTokenEmployee({
							data: { refreshToken: token.refreshToken },
							where: { id: user.id },
						})
						.catch(error => tryCatchErrorHandling(error))
				: await this.utils
						.updateSingleCandidate({
							data: { refreshToken: token.refreshToken },
							where: { id: user.id },
						})
						.catch(error => tryCatchErrorHandling(error))

		return { token, data: refreshTokenUpdated }
	}

	private async setJWTTokenSchema({
		id: sub,
		username,
		email,
	}: {
		id: number
		username: string
		email: string
	}) {
		const accessToken = await this.generateJWTToken({
			sub,
			username,
			email,
			options: {
				expiresIn: this.config.get<string>('JWT_EXPIRE'),
				secret: this.config.get<string>('JWT_SECRET'),
			},
		})

		const refreshToken = await this.generateJWTToken({
			sub,
			username,
			email,
			options: {
				expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRE'),
				secret: this.config.get<string>('JWT_REFRESH_SECRET'),
			},
		})

		this.utils.setDataToRedis({ key: email, value: accessToken })

		return {
			type: 'Bearer',
			accessToken,
			refreshToken,
		}
	}

	private generateJWTToken({
		sub,
		username,
		email,
		options,
	}: JwtPayload): Promise<string> {
		const payload = { sub, username, email }

		return this.jwt.signAsync(payload, options)
	}

	private async handleRefreshTokenExipred({
		error,
		refreshToken,
	}: {
		error: ExceptionInterface
		refreshToken: string
	}) {
		if ('message' in error && error?.message === 'jwt expired') {
			const { username } = JSON.parse(
				Buffer.from(refreshToken.split('.')[1], 'base64').toString()
			)
			const user = await this.utils
				.checkUserByUsername(username)
				.catch(error => tryCatchErrorHandling(error))

			this.utils.clearAllToken(user)

			throw new UnauthorizedException(
				'UnauthorizedException - Please login to continue'
			)
		}

		tryCatchErrorHandling(error)
	}
}
