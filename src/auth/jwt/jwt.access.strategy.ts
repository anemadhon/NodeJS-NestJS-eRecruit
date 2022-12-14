import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { tryCatchErrorHandling } from 'src/util/util-http-error.filter'
import { UtilService } from 'src/util/util.service'
import { JwtPayload } from './jwt.interface'

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService, private utils: UtilService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get<string>('JWT_SECRET'),
			passReqToCallback: true,
		})
	}

	async validate(
		{ headers }: { headers: unknown },
		{ username, email }: JwtPayload
	) {
		const token = headers['authorization'].split(' ')[1]
		const tokenFromRedis = await this.utils.getDataToRedis(email)
		const authenticatedUser = await this.utils
			.checkUserByUsername(username)
			.catch(error => tryCatchErrorHandling(error))

		if (
			token !== tokenFromRedis &&
			authenticatedUser &&
			'nik' in authenticatedUser
		) {
			this.utils
				.updateRefreshTokenEmployee({
					data: { refreshToken: null },
					where: { id: authenticatedUser.id },
				})
				.catch(error => tryCatchErrorHandling(error))
		}

		if (
			token !== tokenFromRedis &&
			authenticatedUser &&
			'username' in authenticatedUser
		) {
			this.utils
				.updateSingleCandidate({
					data: { refreshToken: null },
					where: { id: authenticatedUser.id },
				})
				.catch(error => tryCatchErrorHandling(error))
		}

		if (token !== tokenFromRedis) {
			this.utils.resetRedis()

			throw new UnauthorizedException(
				'UnauthorizedException - Please login to continue'
			)
		}

		return authenticatedUser
	}
}
