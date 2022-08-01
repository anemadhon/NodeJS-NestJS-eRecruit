export interface JwtPayload {
	sub: number
	username: string
	email: string
	options: { expiresIn: string; secret: string }
}
