import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function mainProcessState() {
	await prisma.processState.createMany({
		data: [
			{
				state: 'Initial',
				detail:
					'reviewing applicant by spying on his social medias & call by phone',
				tags: 'phase0,review',
			},
			{
				state: 'HR Interview',
				detail: 'interview hr and collecting resumee',
				tags: 'phase1,interview,resume,hr',
			},
			{
				state: 'Technical Test',
				detail: 'applicant complete the test',
				tags: 'phase1,test,technical',
			},
			{
				state: 'User Interview',
				detail: 'interview with user (mgr IT/spv/senior)',
				tags: 'phase2,interview,resume,hr',
			},
		],
	})
}
