import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilService } from '../util.service'
import {
	utilAplicantStub,
	utilCandidateStub,
	utilEmployeeStub,
	utilProcessStateStub,
} from './util.stub'

describe('UtilService Testing', () => {
	const mockUtilService = {
		checkUserByUsername: jest.fn((username: string) => {
			if (username.includes('@')) {
				return utilEmployeeStub()[0].email === username
					? utilEmployeeStub()[0]
					: undefined
			}

			return utilCandidateStub()[0].username === username
				? utilCandidateStub()[0]
				: undefined
		}),
		getSingleProcessState: jest.fn((id: number) => {
			return utilProcessStateStub()[0].id === id
				? utilProcessStateStub()[0]
				: undefined
		}),
		getSingleApplicant: jest.fn((where: { id: number }) => {
			return utilAplicantStub()[0].id === where.id
				? utilAplicantStub()[0]
				: undefined
		}),
		getSingleEmployee: jest.fn((username: string) => {
			return utilEmployeeStub()[0].email === username
				? utilEmployeeStub()[0]
				: undefined
		}),
		getSingleCandidate: jest.fn((where: { username: string }) => {
			return utilCandidateStub()[0].username === where.username
				? utilCandidateStub()[0]
				: undefined
		}),
		updateRefreshTokenEmployee: jest.fn(
			(data: { refreshToken: string }, where: { id: number }) => {
				return utilEmployeeStub()[0].id === where.id
					? utilEmployeeStub()[0]
					: undefined
			}
		),
		updateSingleCandidate: jest.fn(
			(data: { refreshToken: string }, where: { id: number }) => {
				return utilCandidateStub()[0].id === where.id
					? utilCandidateStub()[0]
					: undefined
			}
		),
		generateUUID: jest.fn(() => 'uuid'),
	}

	let utilService: UtilService

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [UtilService, PrismaService, ConfigService],
		})
			.overrideProvider(UtilService)
			.useValue(mockUtilService)
			.compile()

		moduleRef.get<PrismaService>(PrismaService)

		utilService = moduleRef.get<UtilService>(UtilService)
	})

	describe('when call utilService', () => {
		it('should be defined', () => {
			expect(utilService).toBeDefined()
		})
	})

	describe('when call checkUserByUsername', () => {
		it('should return single employee object if username is email', () => {
			expect(
				utilService.checkUserByUsername(utilEmployeeStub()[0].email)
			).toEqual(utilEmployeeStub()[0])
		})

		it('should return single candidate object if username is username', () => {
			expect(
				utilService.checkUserByUsername(utilCandidateStub()[0].username)
			).toEqual(utilCandidateStub()[0])
		})
	})

	describe('when call getSingleProcessState', () => {
		it('should return undefined when data not found', () => {
			expect(utilService.getSingleProcessState(1)).toBeUndefined()
		})

		it('should return single process state object', () => {
			expect(
				utilService.getSingleProcessState(utilProcessStateStub()[0].id)
			).toEqual(utilProcessStateStub()[0])
		})
	})

	describe('when call getSingleApplicant', () => {
		it('should return undefined when data not found', () => {
			expect(utilService.getSingleApplicant({ id: 1 })).toBeUndefined()
		})

		it('should return single applicant object', () => {
			expect(
				utilService.getSingleApplicant({ id: utilAplicantStub()[0].id })
			).toEqual(utilAplicantStub()[0])
		})
	})

	describe('when call getSingleEmployee', () => {
		it('should return undefined when data not found', () => {
			expect(utilService.getSingleEmployee('ew@we.net')).toBeUndefined()
		})

		it('should return single employee object', () => {
			expect(
				utilService.getSingleEmployee(utilEmployeeStub()[0].email)
			).toEqual(utilEmployeeStub()[0])
		})
	})

	describe('when call getSingleCandidate', () => {
		it('should return undefined when data not found', () => {
			expect(
				utilService.getSingleCandidate({ username: 'usernameeeee' })
			).toBeUndefined()
		})

		it('should return single candidate object', () => {
			expect(
				utilService.getSingleCandidate({
					username: utilCandidateStub()[0].username,
				})
			).toEqual(utilCandidateStub()[0])
		})
	})

	describe('when call updateRefreshTokenEmployee', () => {
		it('should return undefined when data to updated not found', () => {
			expect(
				utilService.updateRefreshTokenEmployee(
					{ refreshToken: 'jwt-token' },
					{ id: 11 }
				)
			).toBeUndefined()
		})

		it('should return single updated employee object', () => {
			expect(
				utilService.updateRefreshTokenEmployee(
					{ refreshToken: 'jwt-token' },
					{ id: utilEmployeeStub()[0].id }
				)
			).toEqual(utilEmployeeStub()[0])
		})
	})

	describe('when call updateSingleCandidate', () => {
		it('should return undefined when data to updated not found', () => {
			expect(
				utilService.updateSingleCandidate(
					{ refreshToken: 'jwt-token' },
					{ id: 1 }
				)
			).toBeUndefined()
		})

		it('should return single updated candidate object', () => {
			expect(
				utilService.updateSingleCandidate(
					{
						passwordResetCode: 'reset-pwd',
						emailIsVerified: true,
					},
					{ id: utilCandidateStub()[0].id }
				)
			).toEqual(utilCandidateStub()[0])
		})
	})

	describe('when call generateUUID', () => {
		it('should return uuid string', () => {
			expect(utilService.generateUUID()).toEqual('uuid')
		})
	})
})
