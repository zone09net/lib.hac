import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class Sizer extends Paperless.Drawable
{
	private _angleStart: number;
	private _angleEnd: number;
	private _puzzled: Puzzled;
	//---

	public constructor(point: Paperless.Point, angleStart: number, angleEnd: number, puzzled: Puzzled)
	{
		super(point, {linewidth: 2, fillcolor: puzzled.color.marked, strokecolor: puzzled.color.faked});

		this._angleStart = angleStart;
		this._angleEnd = angleEnd;
		this._puzzled = puzzled;
		this.sticky = puzzled.sticky;
		this.size = new Paperless.Size(9, 9);

		this.generate();
	}

	public generate(): void
	{
		this.clearPath();
		this.path.arc(this._puzzled.spacing, this._puzzled.spacing, 9, (this._angleEnd / 180) * Math.PI, (this._angleStart / 180) * Math.PI, true);
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.fillStyle = this.fillcolor;
		context2D.fill(this.path);

		context2D.restore();
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get angleStart(): number
	{
		return this._angleStart;
	}
	public set angleStart(angleStart: number)
	{
		this._angleStart = angleStart;
	}

	public get angleEnd(): number
	{
		return this._angleEnd;
	}
	public set angleEnd(angleEnd: number)
	{
		this._angleEnd = angleEnd;
	}
}
