import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { CandidateController } from './candidate.controller'
import { CandidateService } from './candidate.service'

@Module({
	imports: [
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				dest:
					config.get<string>('ENV') === 'dev'
						? `./src/${config.get<string>('APP_FILE_DEST')}`
						: `./dist/${config.get<string>('APP_FILE_DEST')}`,
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [CandidateController],
	providers: [CandidateService],
})
export class CandidateModule {}
