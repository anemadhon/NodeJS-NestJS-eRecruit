import { CandidateEntity } from 'src/candidate/entity/candidate.entity'

export class SendEmailEvent {
	constructor(public readonly user: CandidateEntity) {}
}
