import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function mainJob() {
	await prisma.job.createMany({
		data: [
			{
				addedAt: '1657176797349',
				name: 'PHP Developer',
				slug: 'php-developer',
				slot: 1,
			},
			{
				addedAt: '1657176797349',
				name: 'NodeJS Developer',
				slug: 'nodejs-developer',
				slot: 3,
			},
			{
				addedAt: '1657176797349',
				name: 'Data Engineer',
				slug: 'data-engineer',
				slot: 1,
			},
		],
	})
}
