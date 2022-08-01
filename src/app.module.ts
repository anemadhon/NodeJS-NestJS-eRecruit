import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CandidateModule } from './candidate/candidate.module'
import { ProcessStateModule } from './process_state/process_state.module'
import { EmployeeModule } from './employee/employee.module'
import { CandidateSocialModule } from './candidate_social/candidate_social.module'
import { CandidateExperienceModule } from './candidate_experience/candidate_experience.module'
import { CandidateSkillModule } from './candidate_skill/candidate_skill.module'
import { CandidateOverviewModule } from './candidate_overview/candidate_overview.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { JobModule } from './job/job.module'
import { UtilModule } from './util/util.module'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseErrorExceptionFilter } from './util/util-http-error.filter'
import { ResponseSuccessInterceptor } from './util/util-http-success.interceptor'
import { ApplicantModule } from './applicant/applicant.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		CandidateModule,
		ProcessStateModule,
		EmployeeModule,
		CandidateSocialModule,
		CandidateExperienceModule,
		CandidateSkillModule,
		CandidateOverviewModule,
		PrismaModule,
		JobModule,
		UtilModule,
		ApplicantModule,
	],
	providers: [
		{ provide: APP_FILTER, useClass: ResponseErrorExceptionFilter },
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseSuccessInterceptor,
		},
	],
})
export class AppModule {}
