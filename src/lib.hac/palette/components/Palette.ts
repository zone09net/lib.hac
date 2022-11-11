import * as Paperless from '@zone09.net/paperless';
import {Color} from '../controls/Color.js';
import {IComponentPaletteAttributes} from '../interfaces/IPalette.js';



export class Palette extends Paperless.Component
{
	private _attributes: IComponentPaletteAttributes;
	//private _fillcolor: string;
	//private _strokecolor: string;
	private _selected: string = 'fillcolor';
	private _grouping: Paperless.Group;
	private _drawables: Array<Paperless.Drawable> = [];
	private _controls: Array<Paperless.Control> = [];
	private _callback: (fillcolor: string, strokecolor: string) => void;
	//---

	public constructor(point: Paperless.Point, callback: (fillcolor: string, strokecolor: string) => void = null, attributes: IComponentPaletteAttributes = {})
	{
		super(point, null);

		const {
			fillcolor = '#666666',
			strokecolor = '#666666',
			radius = 60,
			spacing = 10,
			colors = [
				['#ffffff', '#bc78b8', '#64a7de', '#bd3a2e', '#d66f2f', '#deaf2f', '#8c6325', '#629957', '#96a34c', '#000000'],
				['#999999', '#815277', '#3979b0', '#a92317', '#bb4c11', '#ba9018', '#68491a', '#438b35', '#829228', '#151515'],
				['#666666', '#4c2d46', '#21435c', '#8b180e', '#a7380a', '#856815', '#453011', '#2c6221', '#5a6b00', '#333333'],
			],

			sticky = false
		} = attributes;

		this._callback = callback;
		this._attributes = {
			fillcolor: fillcolor,
			strokecolor: strokecolor,
			radius: radius <= 60 ? 60 : radius,
			spacing: spacing * 3 > radius ? (radius - 30) / 3 : spacing,
			colors: colors,
		};

		this.size = new Paperless.Size(radius * 2, radius * 2);
		this.sticky = sticky;
	}

	public onAttach(): void
	{
		let selector: Paperless.Controls.Button;
		let stroke: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x - 5, this.point.y - 5), 15, 10, {sticky: this.sticky, fillcolor:  this._attributes.fillcolor, strokecolor: '#111111', linewidth: 2}));
		let fill: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x + 5, this.point.y + 5), 15, 0,  {sticky: this.sticky, fillcolor:  this._attributes.strokecolor, strokecolor: '#111111', linewidth: 2}));
		//let stroke: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x , this.point.y - 10), 15, 10, {fillcolor: this._fillcolor, strokecolor: '#111111', linewidth: 2}));
		//let fill: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x + 10, this.point.y ), 15, 0,  {fillcolor: this._strokecolor, strokecolor: '#111111', linewidth: 2}));
		//let close: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x - 13, this.point.y + 13), 7, 0,  {fillcolor: this._strokecolor, strokecolor: '#111111', linewidth: 2}));
		//let cancel: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x - 10, this.point.y + 10), 7, 0,  {fillcolor: this._strokecolor, strokecolor: '#111111', linewidth: 2}));
		//let ok: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(new Paperless.Point(this.point.x + 10, this.point.y - 10), 7, 0,  {fillcolor: this._strokecolor, strokecolor: '#111111', linewidth: 2}));

		selector = this.context.attach(new Paperless.Controls.Button(
			() => {
				this._selected = 'strokecolor';
				stroke.toFront();
			},
		));
		selector.attach(stroke);
		this._controls.push(selector);
		this._drawables.push(stroke);
		
		selector = this.context.attach(new Paperless.Controls.Button(
			() => {
				this._selected = 'fillcolor';
				fill.toFront();
			},
		));
		selector.attach(fill);
		this._controls.push(selector);
		this._drawables.push(stroke);

		this._grouping = this.context.attach(new Paperless.Group());
		this._grouping.attach(fill);
		this._grouping.attach(stroke);

		for(let row: number = 0, radius: number = this._attributes.radius; row < this._attributes.colors.length; row++)
		{
			for(let angle: number = 0, column: number = 0; angle < 360; angle += 360 / this._attributes.colors[0].length, column++)
			{
				let drawable: Paperless.Drawables.Circle = this.context.attach(new Paperless.Drawables.Circle(this.point, radius - 1, radius - this._attributes.spacing, {
					angleStart: angle, 
					angleEnd: angle + ((360 / this._attributes.colors[0].length) - 1),
					fillcolor: this._attributes.colors[row][column],
					nostroke: true,
					sticky: this.sticky, 
				}));

				let color: Color = this.context.attach(new Color(
					() => {
						if(this._selected == 'fillcolor')
						{
							fill.fillcolor = this._attributes.colors[row][column];
							this._attributes.fillcolor = this._attributes.colors[row][column];
						}
						else
						{
							stroke.fillcolor = this._attributes.colors[row][column];
							this._attributes.strokecolor = this._attributes.colors[row][column];
						}

						if(this._callback)
							this._callback( this._attributes.fillcolor,  this._attributes.strokecolor);
					},
				));
				color.attach(drawable);

				this._controls.push(color);
				this._drawables.push(drawable);
				this._grouping.attach(drawable);
			}

			radius -= this._attributes.spacing;
		}
	}

	public onDetach(): void
	{
		this.context.detach(this._grouping.guid);

		for(let control of this._controls)
			this.context.detach([control.drawable.guid, control.guid]);
	}

	public getDrawables(): Array<Paperless.Drawable> 
	{
		return this._drawables;
	}

	public getControls(): Array<Paperless.Control> 
	{
		return this._controls;
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get fillcolor(): string
	{
		return  this._attributes.fillcolor;
	}
	public set fillcolor(fillcolor: string)
	{
		this._attributes.fillcolor = fillcolor;
	}

	public get strokecolor(): string
	{
		return  this._attributes.strokecolor;
	}
	public set strokecolor(strokecolor: string)
	{
		this._attributes.strokecolor = strokecolor;
	}
}