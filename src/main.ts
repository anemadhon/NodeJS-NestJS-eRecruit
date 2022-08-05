import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	app.setGlobalPrefix('api')
	app.enableVersioning({
		type: VersioningType.URI,
	})
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		})
	)

	const config = new DocumentBuilder()
		.setTitle('eRecruit API')
		.setDescription('The eRecruit API documentation')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('api/docs', app, document)

	const port = app.get<ConfigService>(ConfigService).get<number>('APP_PORT')

	await app.listen(port)
}
bootstrap()
