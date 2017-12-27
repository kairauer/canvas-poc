import * as Konva from 'Konva';

export class OutputInputConnection {
	public input: { circle: Konva.Circle, name: String, groupName: String };
	public output: { circle: Konva.Circle, name: String, groupName: String };
	public name: String;
	constructor(_name: String) {
		this.name = _name;
	}
}