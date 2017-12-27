import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Konva from 'Konva';

@Component({
	selector: 'app-canvas-node',
	templateUrl: './canvas-node.component.html',
	styleUrls: ['./canvas-node.component.css']
})
export class CanvasNodeComponent implements OnInit {

	@Input() layer: Konva.Layer;
	@Input() stage: Konva.Stage;
	@Input() deactiveInput: boolean = false;
	@Input() deactiveOutput: boolean = false;
	@Input() offset: number = 1;

	@Output() outputClicked: EventEmitter<{ circle: Konva.Circle, name: String, groupName: String }> = new EventEmitter<{ circle: Konva.Circle, name: String, groupName: String }>();
	@Output() inputClicked: EventEmitter<{ circle: Konva.Circle, name: String, groupName: String }> = new EventEmitter<{ circle: Konva.Circle, name: String, groupName: String }>();
	@Output() nodeMoved: EventEmitter<String> = new EventEmitter<String>();

	private name: string;
	private rectDefaultColor: string = '#0071BC';
	private rectHoverColor: string = '#227EBC';
	private outputDefaultColor: string = '#304269';
	private outputHoverColor: string = '#3E5587';
	private inputDefaultColor: string = '#F26101';
	private inputHoverColor: string = '#F27929';
	private rectWidth: number = 200;

	constructor() { }

	ngOnInit() {
		let initPos = this.getInitPos();
		let exampleText = "a";
		for (let i = 0; i < this.offset; ++i) {
			exampleText += "ba";
		}
		this.name = "NODE_" + Math.floor(Math.random() * 100000000);
		let group = new Konva.Group({
			x: 0,
			y: 150,
			draggable: true
		})
		let rect = new Konva.Rect({
			x: initPos.x,
			y: 150,
			width: this.rectWidth,
			height: 50,
			fill: this.rectDefaultColor,
			name: "main-rect",
			strokeWidth: 0,
			cornerRadius: 5,
			draggable: false
		});
		let output;
		if (!this.deactiveOutput) {
			output = new Konva.Circle({
				x: initPos.x + this.rectWidth,
				y: 175,
				radius: 10,
				fill: this.outputDefaultColor,
				name: this.name + "output",
				draggable: false
			});
			output.on('mousedown', () => {
				let mousePos = this.stage.getPointerPosition();
				let x = mousePos.x - 190;
				let y = mousePos.y - 40;
				this.outputClicked.emit({
					circle: output,
					name: output.name(),
					groupName: this.name
				});
			});
			output.on('mouseover', () => {
				output.fill(this.outputHoverColor);
				this.layer.draw();
			});
			output.on('mouseout', () => {
				output.fill(this.outputDefaultColor);
				this.layer.draw();
			});
		}
		let input;
		if (!this.deactiveInput) {
			input = new Konva.Circle({
				x: initPos.x,
				y: 175,
				radius: 10,
				fill: this.inputDefaultColor,
				name: this.name + "input",
				draggable: false
			});
			input.on('mousedown', () => {
				let mousePos = this.stage.getPointerPosition();
				let x = mousePos.x - 190;
				let y = mousePos.y - 40;
				this.inputClicked.emit({
					circle: input,
					name: input.name(),
					groupName: this.name
				});
			});
			input.on('mouseover', () => {
				input.fill(this.inputHoverColor);
				this.layer.draw();
			});
			input.on('mouseout', () => {
				input.fill(this.inputDefaultColor);
				this.layer.draw();
			});
		}
		let text = new Konva.Text({
			x: initPos.x,
			y: 175 - (14 / 2),
			text: exampleText,
			fontSize: 14,
			align: 'center',
			width: this.rectWidth,
			fontFamily: 'Arial',
			fill: '#fff'
		});
		rect.on('mouseover', () => {
			this.highlightRect(rect);
		});
		rect.on('mouseout', () => {
			this.dehighlightRect(rect);
		});
		text.on('mouseover', () => {
			this.highlightRect(rect);
		});
		text.on('mouseout', () => {
			this.dehighlightRect(rect);
		});
		group.on('dragmove', () => {
			this.nodeMoved.emit(this.name);
		});
		group.on('mouseover', () => {
			document.body.style.cursor = 'pointer';
		});
		group.on('mouseout', () => {
			document.body.style.cursor = 'default';
		});
		group.add(rect);
		group.add(text);
		if (!this.deactiveInput) {
			group.add(input);
		}
		if (!this.deactiveOutput) {
			group.add(output);
		}
		this.layer.add(group);
	}

	private getInitPos(): { x: number, y: number } {
		let initPos = { x: null, y: null };
		//left
		if (this.deactiveInput && !this.deactiveOutput) {
			initPos.x = 100;
			initPos.y = 100;
		}

		//center
		if (!this.deactiveInput && !this.deactiveOutput) {
			initPos.x = this.stage.getWidth() / 2 - (this.rectWidth / 2);
			initPos.y = 100;
		}

		//right
		if (!this.deactiveInput && this.deactiveOutput) {
			initPos.x = this.stage.getWidth() - 100 - this.rectWidth;
			initPos.y = 100;
		}
		return initPos;
	}

	private highlightRect(rect: Konva.Rect) {
		rect.fill(this.rectHoverColor);
		this.layer.draw();
	}

	private dehighlightRect(rect: Konva.Rect) {
		rect.fill(this.rectDefaultColor);
		this.layer.draw();
	}

}
