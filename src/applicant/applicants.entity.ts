import { Type } from 'class-transformer'
import { ApplicantEntity } from 'src/applicant/applicant.entity'

export class ApplicantsEntity {
	@Type(() => ApplicantEntity)
	applicants: ApplicantEntity[]

	constructor(data: Partial<ApplicantsEntity>) {
		Object.assign(this, data)
	}
}
