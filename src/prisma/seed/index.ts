import { PrismaClient } from '@prisma/client'
import { mainEmployee } from './employee.seed'
import { mainJob } from './job.seed'
import { mainProcessState } from './process-state.seed'

const prisma = new PrismaClient()

Promise.all([mainProcessState(), mainJob(), mainEmployee()])
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async error => {
		console.log(error)

		process.exit(1)
	})
