export interface PurchaseProps {
	_id?: string;
	userId: string;
	productId: string;
	quantity: number;
	name: string;
	description: string;
	price: number;
}

export class Purchase {
	public readonly _id?: string;
	public userId: string;
	public productId: string;
	public quantity: number;
	public name: string;
	public description: string;
	public price: number;

	constructor(props: PurchaseProps) {
		this._id = props._id;
		this.userId = props.userId;
		this.productId = props.productId;
		this.quantity = props.quantity;
		this.name = props.name;
		this.description = props.description;
		this.price = props.price;
	}
}