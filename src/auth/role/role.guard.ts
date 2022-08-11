import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<string[]>('roles', [
			context.getHandler(),
			context.getClass(),
		])

		if (!roles) return true

		const { user } = context.switchToHttp().getRequest()

		return (
			(user && 'title' in user && user.title === roles[0]) ||
			(user && 'username' in user && roles[0] === 'candidate')
		)
	}
}
