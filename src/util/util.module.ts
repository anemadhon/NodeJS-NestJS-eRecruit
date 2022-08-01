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
					host: config.get('MAIL_HOST'),
					secure: !(config.get('MAIL_SECURE') === 'false'),
					port: parseInt(config.get('MAIL_PORT')),
					auth: {
						user: config.get('MAIL_USER'),
						pass: config.get('MAIL_PASSWORD'),
					},
				},
				defaults: {
					from: `"No Reply" <${config.get('MAIL_FROM')}>`,
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [UtilService],
	exports: [UtilService],
})
export class UtilModule {}
