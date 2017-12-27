import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OutputInputConnection } from './../connection/output-input-connection.model';
import * as Konva from 'Konva';
import * as _ from "lodash";

@Component({
	selector: 'app-canvas-main',
	templateUrl: './canvas-main.component.html',
	styleUrls: ['./canvas-main.component.css']
})

export class CanvasMainComponent implements OnInit {

	public layer: Konva.Layer;
	public bezierLayer: Konva.Layer;
	public stage: Konva.Stage;
	public startElements: Array<number> = [1, 2, 3, 4];
	public connectionElements: Array<number> = [1, 2, 3];
	private currentConnection: OutputInputConnection;
	private connections: Array<OutputInputConnection> = new Array();

	constructor(private changeDetectorRef: ChangeDetectorRef) { }

	public outputClicked($event) {
		if (this.connections[this.connections.length - 1] && typeof this.connections[this.connections.length - 1].output === 'undefined') {
			this.connections[this.connections.length - 1].output = $event;
			this.drawBezier(this.connections[this.connections.length - 1]);
		} else {
			this.connections.push(new OutputInputConnection("test"));
			this.connections[this.connections.length - 1].output = $event;
		}
	}

	public inputClicked($event) {
		if (this.connections[this.connections.length - 1] && typeof this.connections[this.connections.length - 1].input === 'undefined') {
			this.connections[this.connections.length - 1].input = $event;
			this.drawBezier(this.connections[this.connections.length - 1]);
		} else {
			this.connections.push(new OutputInputConnection("test"));
			this.connections[this.connections.length - 1].input = $event;
		}
	}

	private calcBezierPoints(connection: OutputInputConnection): Array<number> {
		let bezierPoints = new Array();
		let p1 = {
			x: connection.output.circle.getAbsolutePosition().x,
			y: connection.output.circle.getAbsolutePosition().y
		};
		let p5 = {
			x: connection.input.circle.getAbsolutePosition().x,
			y: connection.input.circle.getAbsolutePosition().y
		}
		let p2 = {
			x: p5.x - Math.abs((p5.x - p1.x)) / 2,
			y: p1.y
		}
		let p3 = {
			x: p5.x - Math.abs((p5.x - p1.x)) / 2,
			y: (p1.y > p5.y ? p1.y : p5.y) - Math.abs((p5.y - p1.y)) / 2
		}
		let p4 = {
			x: p5.x - Math.abs((p5.x - p1.x)) / 2,
			y: p5.y
		}
		bezierPoints.push(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, p5.x, p5.y);
		return bezierPoints;
	}

	private drawBezier(connection: OutputInputConnection) {
		var context = this.bezierLayer.getContext();
		let bezierPoints = this.calcBezierPoints(connection);
		context.beginPath();
		context.moveTo(bezierPoints[0], bezierPoints[1]);
		context.bezierCurveTo(bezierPoints[2], bezierPoints[3], bezierPoints[6], bezierPoints[7], bezierPoints[8], bezierPoints[9]);
		context.setAttr('strokeStyle', '#91BED4');
		context.setAttr('lineWidth', 4);
		context.stroke();
	}

	public nodeMoved($event) {
		let context = this.bezierLayer.getContext();
		context.clear();
		for (let connection of this.connections) {
			this.drawBezier(connection);
		}
	}

	ngAfterViewInit() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		this.stage = new Konva.Stage({
			container: 'canvasContainer',
			width: width,
			height: height
		});
		this.layer = new Konva.Layer();
		this.bezierLayer = new Konva.Layer();
		this.changeDetectorRef.detectChanges();
		this.stage.add(this.layer);
		this.stage.add(this.bezierLayer);
	}

	ngOnInit() { }
}