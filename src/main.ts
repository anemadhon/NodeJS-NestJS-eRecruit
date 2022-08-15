import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

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

	const prismaService = app.get(PrismaService)

	await prismaService.enableShutdownHooks(app)

	const appPort = app.get<ConfigService>(ConfigService).get<number>('APP_PORT')
	const appName = app.get<ConfigService>(ConfigService).get<string>('APP_NAME')
	const config = new DocumentBuilder()
		.setTitle(appName)
		.setDescription(`${appName} documentation`)
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('api/docs', app, document)

	await app.listen(appPort)
}
bootstrap()
