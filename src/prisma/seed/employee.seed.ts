import { PrismaClient } from '@prisma/client'
import * as argon from 'argon2'

const prisma = new PrismaClient()

export async function mainEmployee() {
	const password = await argon.hash('password')

	await prisma.employee.create({
		data: {
			nik: '78327',
			password,
			name: 'Angel Dhan',
			email: 'angel.dhan@erecruit.net',
			title: 'admin',
		},
	})

	await prisma.employee.create({
		data: {
			nik: '77827',
			password,
			name: 'Mika Yen',
			email: 'mika.yen@erecruit.net',
			title: 'hr',
		},
	})
}
