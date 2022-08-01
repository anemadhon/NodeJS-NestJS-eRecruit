import { Test } from '@nestjs/testing'
import { utilCandidateStub } from 'src/util/test/util.stub'
import { ValidationEmailDto } from '../auth.dto'
import { AuthService } from '../auth.service'

describe('AuthService Testing', () => {
	const mockAuthService = {
		validateEmail: jest.fn(({ email }: ValidationEmailDto) => {
			return utilCandidateStub()[1].email === email
				? utilCandidateStub()[1]
				: undefined
		}),
	}
	let authService: AuthService

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [AuthService],
		})
			.overrideProvider(AuthService)
			.useValue(mockAuthService)
			.compile()

		authService = moduleRef.get<AuthService>(AuthService)
	})

	describe('when call AuthService', () => {
		it('should be defined', () => {
			expect(authService).toBeDefined()
		})
	})

	describe('when call validateEmail', () => {
		it('should be return undefined when email not found', () => {
			expect(
				authService.validateEmail({ email: 'rere@re.net' })
			).toBeUndefined()
		})

		it('should be return candidate object when email founded', () => {
			expect(
				authService.validateEmail({
					email: utilCandidateStub()[1].email,
				})
			).toEqual(utilCandidateStub()[1])
		})
	})
})
