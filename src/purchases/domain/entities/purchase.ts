export interface PurchaseProps {
	_id?: string;
	userId: string;
	quantity: number;

	productId: string;
	name: string;
	description: string;
	price: number;
	sellerId: string;
}

export class Purchase {
	public readonly _id?: string;
	public userId: string;
	public quantity: number;

	public productId: string;
	public name: string;
	public description: string;
	public price: number;
	public sellerId: string;

	constructor(props: PurchaseProps) {
		this._id = props._id;
		this.userId = props.userId;
		this.quantity = props.quantity;

		this.productId = props.productId;
		this.name = props.name;
		this.description = props.description;
		this.price = props.price;
		this.sellerId = props.sellerId;
	}
}