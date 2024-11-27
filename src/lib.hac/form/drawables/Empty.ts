import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIEmptyAttributes} from '../interfaces/IUI.js';



export class Empty extends EntityCoreDrawable
{
	private _rectangle: Paperless.Drawables.Rectangle;
	private _line: Paperless.Drawables.Line;
	private _padding: number;
	//---

	public constructor(attributes: IDrawableUIEmptyAttributes = {})
	{
		super({
			...attributes,
			...{
				removable: true,
				nofill: false,
				nostroke: false
			}
		});

		const {
			line = {},
			padding = 0,
		} = attributes;

		this._padding = padding;
		
		this._rectangle = new Paperless.Drawables.Rectangle({
			point: {x: this.x, y: this.y},
			size: {
				width: this.width - this.puzzled.spacing - (this.padding * 2) - 2, 
				height: this.height - this.puzzled.spacing - (this.padding * 2) - 2
			}, 
			offset1: this.puzzled.point,
			offset2: {
				x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
				y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
			},
			matrix: this.matrix
		});

		this._line = new Paperless.Drawables.Line({
			...line,
			...{
				linewidth: 1,
				strokecolor: this.strokecolor,
				point0: this._rectangle.boundaries.topleft,
				point1: this._rectangle.boundaries.bottomright,
				hoverable: false, 
				offset1: this.puzzled.point,
				offset2: this._rectangle.offset2,
				matrix: this.matrix
			}
		});

		this.context.enroll(this._rectangle);
		this.context.enroll(this._line);
	}

	public update(): void
	{
		this._rectangle.width = this.width - this.puzzled.spacing - (this.padding * 2) - 2;
		this._rectangle.height = this.height - this.puzzled.spacing - (this.padding * 2) - 2;
		this._rectangle.offset2 = {
			x: ((this.width - this.puzzled.spacing) / 2) + this.puzzled.spacing,
			y: ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing
		}
		this._rectangle.generate();

		this._line.point0 = this._rectangle.boundaries.topleft;
		this._line.point1 = this._rectangle.boundaries.bottomright;
		this._line.offset2 = this._rectangle.offset2;
		this._line.generate();		
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void 
	{
		this._line.draw(context2D);
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get padding(): number
	{
		return this._padding;
	}
	public set padding(padding: number)
	{
		this._padding = padding;
	}
}
