import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CandidateModule } from './candidate/candidate.module'
import { ProcessStateModule } from './process_state/process_state.module'
import { EmployeeModule } from './employee/employee.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JobModule } from './job/job.module'
import { UtilModule } from './util/util.module'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseErrorExceptionFilter } from './util/util-http-error.filter'
import { ResponseSuccessInterceptor } from './util/util-http-success.interceptor'
import { ApplicantModule } from './applicant/applicant.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		WinstonModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				level: 'info',
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.ms(),
					winston.format.json()
				),
				transports: [
					new winston.transports.Console({}),
					new winston.transports.DailyRotateFile({
						filename: 'logs/app-activity-%DATE%.log',
						datePattern: config.get<string>('LOG_DATE_FORMAT'),
						zippedArchive: config.get<boolean>('LOG_ZIPPED'),
						maxSize: config.get<string>('LOG_MAX_SIZE'),
						maxFiles: config.get<string>('LOG_MAX_DAY'),
					}),
					new winston.transports.DailyRotateFile({
						level: 'error',
						filename: 'logs/app-error-%DATE%.log',
						datePattern: config.get<string>('LOG_DATE_FORMAT'),
						zippedArchive: config.get<boolean>('LOG_ZIPPED'),
						maxSize: config.get<string>('LOG_MAX_SIZE'),
						maxFiles: config.get<string>('LOG_MAX_DAY'),
					}),
				],
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		CandidateModule,
		ProcessStateModule,
		EmployeeModule,
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
