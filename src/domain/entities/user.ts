import { UserId } from '../value-objects/user-id';

export interface UserProps {
	_id?: string;
	name: string;
	lastName: string;
	mail: string;
}

export class User {
	public readonly _id: UserId;
	public name: string;
	public lastName: string;
	public mail: string;

	constructor(props: UserProps) {
		this._id = props._id ? new UserId(props._id) : new UserId();
		this.name = props.name;
		this.lastName = props.lastName;
		this.mail = props.mail;
	}
}
