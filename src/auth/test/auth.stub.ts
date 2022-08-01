import { CandidateEntity } from 'src/candidate/candidate.entity'
import { EmployeeEntity } from 'src/employee/employee.entity'

export const authCandidateStub = (): Partial<CandidateEntity> => {
	return {
		id: Date.now(),
		email: 'firstlast_candidate@bla.net',
		username: 'firstLast',
		firstName: 'First',
		lastName: 'Last',
		phone: '0813000000',
	}
}

export const authEmployeeStub = (): Partial<EmployeeEntity> => {
	return {
		id: Date.now(),
		nik: '9999',
		email: 'employee9999@bla.net',
		name: 'employee',
		title: 'admin',
	}
}

export const responseSuccess = () => {
	return {
		success: true,
		status: 200,
		message: 'oke',
		data: authCandidateStub() || authEmployeeStub(),
		error: null,
	}
}

export const responseError = () => {
	return {
		success: false,
		status: 200,
		message: 'not oke',
		data: null,
		error: {
			timestamp: new Date().toISOString(),
			path: 'path',
			message: 'error' || [],
		},
	}
}
