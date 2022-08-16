import { ExceptionFilter, Catch, ArgumentsHost, Inject } from '@nestjs/common'
import { Response } from 'express'
import { IncomingMessage } from 'http'
import { HttpException, HttpStatus } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

export const getStatusCode = (exception: unknown): number => {
	return exception instanceof HttpException
		? exception.getStatus()
		: HttpStatus.INTERNAL_SERVER_ERROR
}

export type MessageType = string | string[]

export interface ExceptionInterface {
	status: number
	message: string
	name: string
	response: {
		statusCode: number
		message: MessageType
		error?: string
	}
}

export const getErrorMessage = (
	exception: ExceptionInterface
): { type: string; message: MessageType } => {
	const error = exception?.message?.split(' - ')

	return {
		type: error[0],
		message: Array.isArray(exception?.response?.message)
			? exception.response.message
			: error[1] ?? error[0],
	}
}

export const tryCatchErrorHandling = (error: ExceptionInterface) => {
	throw new HttpException(
		{
			status: getStatusCode(error),
			message: `${error?.name} - ${error?.message}`,
		},
		getStatusCode(error)
	)
}

@Catch()
export class ResponseErrorExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
	) {}

	catch(exception: ExceptionInterface, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<IncomingMessage>()
		const code = getStatusCode(exception)
		const message = getErrorMessage(exception)

		if (code >= 500 && code < 600) {
			this.logger.error('log message')
		}

		if (code >= 400 && code < 500) {
			this.logger.warn('log message')
		}

		response.status(code).json({
			success: false,
			status: code,
			data: null,
			error: {
				timestamp: new Date().toISOString(),
				path: request.url,
				message,
			},
		})
	}
}
