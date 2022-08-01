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
			secretOrKey: config.get('JWT_SECRET'),
		})
	}

	async validate({ username }: JwtPayload) {
		const authenticatedUser = await this.utils
			.checkUserByUsername(username)
			.catch(error => tryCatchErrorHandling(error))

		if (!authenticatedUser.refreshToken) {
			throw new UnauthorizedException(
				'UnauthorizedException - Please login to continue'
			)
		}

		return authenticatedUser
	}
}
