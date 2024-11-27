import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUISeparatorAttributes} from '../interfaces/IUI.js';



export class Separator extends EntityCoreDrawable
{
	private _line: Paperless.Drawables.Line;
	private _padding: number;
	//---

	public constructor(attributes: IDrawableUISeparatorAttributes = {})
	{
		super({
			...{
				nofill: true,
				nostroke: true
			},
			...attributes
		});
		const {
			padding = 0,
		} = attributes;

		this._padding = padding;
		this._line = new Paperless.Drawables.Line({
			...{
				linewidth: 4
			}, 
			...attributes.line, 
			...{
				strokecolor: this.strokecolor,
				point0: {x: this.x, y: this.y},
				point1: {x: this.x, y: this.y},
				hoverable: false, 
				sticky: this.sticky, 
				generate: false,
				matrix: this.matrix,
				offset1: this.puzzled.point
			},

		});

		this.context.enroll(this._line); 
		this.update();
	}

	public update(): void
	{
		this._line.offset2 = {
			x: this.puzzled.spacing + (this.width / 2), 
			y: this.puzzled.spacing + (this.height / 2)
		};

		if(this.width >= this.height)
		{
			this._line.point0 = new Paperless.Point(this.x - (this.width / 2) + this._padding, this.y - (this.puzzled.spacing / 2));
			this._line.point1 = new Paperless.Point(this.x + (this.width / 2) - this._padding - this.puzzled.spacing, this.y - (this.puzzled.spacing / 2));
		}
		else
		{
			this._line.point0 = new Paperless.Point(this.x - (this.puzzled.spacing / 2), this.y - (this.height / 2) + this._padding);
			this._line.point1 = new Paperless.Point(this.x - (this.puzzled.spacing / 2), this.y + (this.height / 2) - this._padding - this.puzzled.spacing);
		}

		this._line.generate();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void 
	{
		this._line.draw(context2D);
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get childs(): {line: Paperless.Drawables.Line}
	{
		return {line: this._line};
	}

	public get padding(): number
	{
		return this._padding;
	}
	public set padding(padding: number)
	{
		this._padding = padding;
	}
}
