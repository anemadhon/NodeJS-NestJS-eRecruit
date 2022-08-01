import { Applicant, Candidate, Employee, ProcessState } from '@prisma/client'

export const utilProcessStateStub = (): Partial<ProcessState>[] => {
	return [
		{
			id: 1658908748090,
			state: 'filing',
			tags: 'filing',
			detail: 'filtering cv',
		},
		{
			id: 1658908748091,
			state: 'test',
			tags: 'test',
			detail: 'testing',
		},
	]
}

export const utilEmployeeStub = (): Partial<Employee>[] => {
	return [
		{
			id: 1658908748090,
			nik: '9998',
			password: 'password',
			name: 'employee',
			email: 'employee@admin.net',
			title: 'admin',
			refreshToken: 'jwt-token',
		},
		{
			id: 1658908748091,
			nik: '9999',
			password: 'password',
			name: 'employee',
			email: 'employee@hr.net',
			title: 'hr',
			refreshToken: 'jwt-token',
		},
	]
}

export const utilCandidateStub = (): Partial<Candidate>[] => {
	return [
		{
			id: 1658908748090,
			firstName: 'first',
			lastName: 'last',
			username: '',
			password: '',
			passwordResetCode: '',
			email: 'firstlast@blah.net',
			emailVerificationCode: '',
			emailIsVerified: false,
			phone: '081399999',
			refreshToken: '',
		},
		{
			id: 1658908748091,
			firstName: 'firstName',
			lastName: 'last',
			username: '',
			password: '',
			passwordResetCode: '',
			email: 'firstNamelast@blah.net',
			emailVerificationCode: '',
			emailIsVerified: false,
			phone: '081399999',
			refreshToken: '',
		},
	]
}

export const utilAplicantStub = (): Partial<Applicant>[] => {
	return [
		{
			id: 1658908748090,
			submittedAt: '1657176797349',
			candidateId: utilCandidateStub()[0].id,
			processStateId: utilProcessStateStub()[0].id,
			jobId: 1,
		},
		{
			id: 1658908748091,
			submittedAt: '1657176797349',
			candidateId: utilCandidateStub()[1].id,
			processStateId: utilProcessStateStub()[1].id,
			jobId: 1,
		},
	]
}
