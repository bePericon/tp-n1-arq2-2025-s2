export interface SellerProps {
	_id?: string;
	companyName: string;
	mail: string;
	products: string[]
}

export class Seller {
	public readonly _id?: string;
	public companyName: string;
	public mail: string;
	public products: string[];

	constructor(props: SellerProps) {
		this._id = props._id
		this.companyName = props.companyName;
		this.mail = props.mail;
		this.products = props.products;
	}
}
