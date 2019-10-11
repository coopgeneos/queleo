import { Favorite } from './favorite';
export class User {
	id: string;
	email: string;
	favorites: Favorite[];
	tags: string[];

	constructor() {}

	init(obj: any) : void {
		if(obj){
			this.id = obj.id ? obj.id : null;
			this.email = obj.email ? obj.email : null;
			this.favorites = obj.favorites ? obj.favorites : null;
			this.tags = obj.tags ? obj.tags : null;
		}
	}
}
