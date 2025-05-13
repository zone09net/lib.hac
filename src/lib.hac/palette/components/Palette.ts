import * as Paperless from '@zone09.net/paperless';
import {IComponentPaletteAttributes} from '../interfaces/IPalette.js';



export class Palette extends Paperless.Component
{
	private _attributes: IComponentPaletteAttributes;
	private _selected: string = 'strokecolor';
	private _callback: (fillcolor: string, strokecolor: string) => void;
	//---

	// @ts-ignore
	public constructor(attributes: IComponentPaletteAttributes = {})
	{
		const context: Paperless.Context = attributes.context;

		super({
			...attributes, 
			...{
				context: null,
				layer: null,
			}
		});

		const {
			fillcolor = '#666666',
			strokecolor = '#666666',
			radius = 120,
			spacing = 25,
			colors = [
				['#ffffff', '#bc78b8', '#64a7de', '#bd3a2e', '#d66f2f', '#deaf2f', '#8c6325', '#629957', '#96a34c', '#000000'],
				['#999999', '#815277', '#3979b0', '#a92317', '#bb4c11', '#ba9018', '#68491a', '#438b35', '#829228', '#151515'],
				['#666666', '#4c2d46', '#21435c', '#8b180e', '#a7380a', '#856815', '#453011', '#2c6221', '#5a6b00', '#333333'],
			],
			movable = false,
			sticky = false,
			layer = null,
			onColor = (fillcolor: string, strokecolor: string) => {}
		} = attributes;

		this._callback = onColor;
		this._attributes = {
			fillcolor: fillcolor,
			strokecolor: strokecolor,
			radius: radius <= 60 ? 60 : radius,
			spacing: spacing * colors.length > radius ? (radius - 30) / colors.length : spacing,
			colors: colors,
			movable: movable
		};

		this.width = radius * 2;
		this.height = radius * 2;
		this.sticky = sticky;

		context ? context.attach(this, layer) : null;
	}

	public onAttach(): void
	{
		const fill: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
			context: this.context,
			point: {x: this.x, y: this.y}, 
			offset1: {x: 8, y: 8}, 
			outerRadius: 20,
			sticky: this.sticky, 
			fillcolor:  this._attributes.fillcolor, 
			strokecolor: '#000000', 
			shadowcolor: '#000000',
			shadow: 5,
			linewidth: 2,
		});

		const stroke: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
			context: this.context,
			offset1: {x: -8, y: -8}, 
			outerRadius: 20,
			innerRadius: 10,
			sticky: this.sticky, 
			fillcolor:  this._attributes.strokecolor, 
			strokecolor: '#000000', 
			shadowcolor: '#000000',
			shadow: 5,
			linewidth: 2,
			matrix: fill.matrix
		});

		this.enroll([
			stroke,
			fill
		]);

		this.enroll(
			new Paperless.Control({
				context: this.context,
				drawable: fill,
				movable: this._attributes.movable,
				onLeftClick: (self: Paperless.Control) => {
					this._selected = 'fillcolor';
					self.drawable.toFront();
				},
			})
		);

		this.enroll(
			new Paperless.Control({
				context: this.context,
				drawable: stroke,
				movable: this._attributes.movable,
				onLeftClick: (self: Paperless.Control) => {
					this._selected = 'strokecolor';
					self.drawable.toFront();
				},
			})
		);

		for(let row: number = 0, radius: number = this._attributes.radius; row < this._attributes.colors.length; row++)
		{
			for(let angle: number = 0, column: number = 0; angle < 360; angle += 360 / this._attributes.colors[0].length, column++)
			{
				let drawable: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
					context: this.context,
					outerRadius: radius - 1,
					innerRadius: radius - this._attributes.spacing,
					angleStart: angle, 
					angleEnd: angle + ((360 / this._attributes.colors[0].length) - 1),
					fillcolor: this._attributes.colors[row][column],
					nostroke: true,
					sticky: this.sticky,
					matrix: stroke.matrix
				});

				this.enroll(drawable);
				this.enroll(
					new Paperless.Control({
						context: this.context,
						drawable: drawable,
						movable: this._attributes.movable,
						onLeftClick: (self: Paperless.Control) => {
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
						onInside: (self: Paperless.Control) => {
							self.drawable.strokecolor = '#000000';
							self.drawable.shadowcolor = '#000000';
							self.drawable.linewidth = 3;
							self.drawable.nostroke = false;
							self.drawable.shadow = 10;
							self.drawable.toFront();
						},
						onOutside: (self: Paperless.Control) => {
							self.drawable.shadow = 0;
							self.drawable.nostroke = true;
						}
					})
				);
			}

			radius -= this._attributes.spacing;
		}
	}

	public onDetach(): void
	{
		this.detachEnrolled();
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