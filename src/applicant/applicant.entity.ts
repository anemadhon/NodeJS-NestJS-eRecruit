import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import { CandidateEntity } from 'src/candidate/entity/candidate.entity'
import { JobEntity } from 'src/job/job.entity'
import { ProcessStateEntity } from 'src/process_state/process-state.entity'

export class ApplicantEntity {
	@ApiProperty()
	id: number
	@ApiProperty()
	submittedAt: string

	@ApiPropertyOptional()
	@Type(() => CandidateEntity)
	candidate?: CandidateEntity

	@ApiProperty()
	@Type(() => JobEntity)
	@Transform(({ value }) => value.name)
	job: JobEntity

	@ApiProperty()
	@Type(() => ProcessStateEntity)
	@Transform(({ value }) => value.state)
	processState: ProcessStateEntity

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	@Exclude()
	processStateId: number

	@Exclude()
	candidateId: number

	@Exclude()
	jobId: number

	constructor(data: Partial<ApplicantEntity>) {
		Object.assign(this, data)
	}
}
