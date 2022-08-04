import {
	ForbiddenException,
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

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private config: ConfigService,
		private utils: UtilService
	) {}

	async validateEmail({ email }: ValidationEmailDto) {
		const user = await this.utils
			.getSingleCandidate({ email })
			.catch(error => tryCatchErrorHandling(error))

		if (!user) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const userHaveNotPassedInitialState =
			user.applicants.find(applicants => applicants.candidateId === user.id)
				.processStateId !== 2

		if (userHaveNotPassedInitialState) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		if (user.emailIsVerified && user.username) {
			return {
				message: 'You have complated validatiion & verification, please login',
				result: new CandidateEntity(user),
			}
		}

		if (user.emailIsVerified && user.passwordResetCode && !user.username) {
			this.sendEmail(user)
		}

		if (user.emailIsVerified && !user.username) {
			this.updateAndSendEmail(
				{ passwordResetCode: this.utils.generateUUID() },
				{ id: user.id }
			)
		}

		this.updateAndSendEmail(
			{ emailVerificationCode: this.utils.generateUUID() },
			{ id: user.id }
		)
	}

	async verifyEmail({ email, emailVerificationCode }: VerificationEmailDto) {
		const user = await this.utils
			.getSingleCandidate({ email })
			.catch(error => tryCatchErrorHandling(error))

		if (!user) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		const emailVerificationCodeNotMatched =
			user.emailVerificationCode !== emailVerificationCode

		if (emailVerificationCodeNotMatched) {
			throw new ForbiddenException('You are not allowed to this action')
		}

		if (user.emailIsVerified) {
			return {
				message: 'You have complated validatiion & verification, please login',
				result: new CandidateEntity(user),
			}
		}

		this.updateAndSendEmail(
			{
				passwordResetCode: this.utils.generateUUID(),
				emailIsVerified: true,
				emailVerificationCode: null,
			},
			{ id: user.id }
		)
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
			throw new ForbiddenException('You are not allowed to this action')
		}

		const accountValidated = await this.utils
			.updateSingleCandidate(
				{
					username,
					password: await argon.hash(password),
					passwordResetCode: null,
				},
				{ id: user.id }
			)
			.catch(error => tryCatchErrorHandling(error))

		const refreshTokenUpdated = await this.generateAndUpdateToken(
			accountValidated
		)

		return {
			message: `You are validated, welcome ${
				'username' in refreshTokenUpdated?.data
					? refreshTokenUpdated.data.username
					: ''
			}`,
			result: new CandidateEntity({
				...user,
				token: refreshTokenUpdated?.token,
			}),
		}
	}

	async login({ username, password }: LoginDto) {
		const user = await this.utils
			.checkUserByUsername(username)
			.catch(error => tryCatchErrorHandling(error))

		if (!user) throw new ForbiddenException('Credentials incorrect')

		if (user.refreshToken) {
			return {
				message: 'You are logged in, please logout to continue',
				result: new CandidateEntity(user),
			}
		}

		const isPasswordMatches = await argon
			.verify(user.password, password)
			.catch(error => tryCatchErrorHandling(error))

		if (!isPasswordMatches) {
			throw new ForbiddenException('Credentials incorrect')
		}

		const refreshTokenUpdated = await this.generateAndUpdateToken(user)

		return {
			message: `You are validated, welcome ${
				'nik' in refreshTokenUpdated?.data
					? refreshTokenUpdated?.data?.name
					: refreshTokenUpdated?.data?.username
			}`,
			result:
				'nik' in refreshTokenUpdated?.data
					? new EmployeeEntity({ ...user, token: refreshTokenUpdated?.token })
					: new CandidateEntity({ ...user, token: refreshTokenUpdated?.token }),
		}
	}

	async logout(user: CandidateEntity | EmployeeEntity) {
		if (!user.refreshToken) {
			throw new UnauthorizedException(
				'UnauthorizedException - Please login to continue'
			)
		}

		if ('nik' in user) {
			await this.utils
				.updateRefreshTokenEmployee({ refreshToken: null }, { id: user.id })
				.catch(error => tryCatchErrorHandling(error))
		}

		if ('username' in user) {
			await this.utils
				.updateSingleCandidate({ refreshToken: null }, { id: user.id })
				.catch(error => tryCatchErrorHandling(error))
		}

		return {
			message: 'Logout Successfully',
			result: null,
		}
	}

	async refresh({ refreshToken }: RefreshTokenDto) {
		const payload = await this.jwt
			.verifyAsync(refreshToken, {
				secret: this.config.get('JWT_REFRESH_SECRET'),
			})
			.catch(error => {
				return this.handleRefreshTokenExipred(error, refreshToken)
			})

		if ('username' in payload) {
			throw new UnprocessableEntityException(
				'UnprocessableEntityException - The servive only available on expired JWT token'
			)
		}

		if ('message' in payload) return payload
	}

	private async updateAndSendEmail<TDataToUpdate>(
		data: TDataToUpdate,
		where: { id: number }
	) {
		const updatedData = await this.utils
			.updateSingleCandidate(data, where)
			.catch(error => tryCatchErrorHandling(error))

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
						.updateRefreshTokenEmployee(
							{ refreshToken: token.refreshToken },
							{ id: user.id }
						)
						.catch(error => tryCatchErrorHandling(error))
				: await this.utils
						.updateSingleCandidate(
							{ refreshToken: token.refreshToken },
							{ id: user.id }
						)
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
				expiresIn: this.config.get('JWT_EXPIRE'),
				secret: this.config.get('JWT_SECRET'),
			},
		})

		const refreshToken = await this.generateJWTToken({
			sub,
			username,
			email,
			options: {
				expiresIn: this.config.get('JWT_REFRESH_EXPIRE'),
				secret: this.config.get('JWT_REFRESH_SECRET'),
			},
		})

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

	private async handleRefreshTokenExipred(
		error: ExceptionInterface,
		refreshToken: string
	) {
		if ('message' in error && error?.message === 'jwt expired') {
			const { username } = JSON.parse(
				Buffer.from(refreshToken.split('.')[1], 'base64').toString()
			)

			const user = await this.utils
				.checkUserByUsername(username)
				.catch(error => tryCatchErrorHandling(error))

			if (user.refreshToken !== refreshToken) {
				if ('username' in user) {
					await this.utils
						.updateSingleCandidate({ refreshToken: null }, { id: user.id })
						.catch(error => tryCatchErrorHandling(error))
				}

				if ('nik' in user) {
					await this.utils
						.updateRefreshTokenEmployee({ refreshToken: null }, { id: user.id })
						.catch(error => tryCatchErrorHandling(error))
				}

				throw new UnauthorizedException(
					'UnauthorizedException - Please login to continue'
				)
			}

			const refreshTokenUpdated = await this.generateAndUpdateToken(user)

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
								token: refreshTokenUpdated?.token,
						  }),
			}
		}

		tryCatchErrorHandling(error)
	}
}
