export interface UtilUserResponse {
	id: number
	username: string | null
	email: string
	applicants: {
		processState: number
	}

	password?: string | 'password'
	emailIsVerified?: boolean
	emailVerificationCode?: string | null

	errors?: {
		statusCode: string
		message: string
	}
}
