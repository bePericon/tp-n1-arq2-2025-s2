export interface ProductProps {
	_id?: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	sellerId: string;
}

export class Product {
	public readonly _id?: string;
	public name: string;
	public description: string;
	public price: number;
	public stock: number;
	public sellerId: string;
	

	constructor(props: ProductProps) {
		this._id = props._id;
		this.name = props.name;
		this.description = props.description;
		this.price = props.price;
		this.stock = props.stock;
		this.sellerId = props.sellerId;
	}
}
