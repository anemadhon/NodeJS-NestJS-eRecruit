import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ResponseOK<TDataResult> {
	success: true
	status: number
	message: string
	data: TDataResult
	error: null
}

@Injectable()
export class ResponseSuccessInterceptor<TDataResult>
	implements NestInterceptor<TDataResult, ResponseOK<TDataResult>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<ResponseOK<TDataResult>> {
		return next.handle().pipe(
			map(data => ({
				success: true,
				status: context.switchToHttp().getResponse().statusCode,
				message: data.message,
				data: data.result,
				error: null,
			}))
		)
	}
}
