import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UtilService } from './util.service'

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get<string>('MAIL_HOST'),
					secure: config.get<boolean>('MAIL_SECURE'),
					port: config.get<number>('MAIL_PORT'),
					auth: {
						user: config.get<string>('MAIL_USER'),
						pass: config.get<string>('MAIL_PASSWORD'),
					},
				},
				defaults: {
					from: `"No Reply" <${config.get<string>('MAIL_FROM')}>`,
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [UtilService],
	exports: [UtilService],
})
export class UtilModule {}
