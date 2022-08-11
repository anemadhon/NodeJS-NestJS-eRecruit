import { ApiProperty } from '@nestjs/swagger'

export class CandidateResumeEntity {
	@ApiProperty()
	resume: string

	@ApiProperty()
	meta: {
		filename: string
		originalName: string
		extension: 'pdf'
		mimetype: 'application/pdf'
		path: string
	}

	constructor(data: Partial<CandidateResumeEntity>) {
		Object.assign(this, data)
	}
}
