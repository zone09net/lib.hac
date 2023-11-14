import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';



export class EntityCoreDrawable extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//private _contour: Path2D;
	//private _mocksize: Paperless.Size;
	//---

	public constructor(puzzled: Puzzled, attributes: Paperless.Interfaces.IDrawableAttributes = {})
	{
		super({
			...{
				fillcolor: puzzled.color.fill,
				strokecolor: puzzled.color.stroke,
				nostroke: puzzled.nostroke,
				nofill: puzzled.nofill,
				linewidth: puzzled.linewidth,
			},
			...attributes,
		});

		this._puzzled = puzzled;
		//this._contour = new Path2D();
		this.context = puzzled.context;

		this.generate(true);
	}

	public generate(expandable?: boolean): void
	{
		let points: Array<Paperless.Point> = [];
		let point: Paperless.Point = new Paperless.Point(0, 0);

		if((<any>this.points)['origin'])
			(<any>points)['origin'] = (<any>this.points)['origin'];
			
		points[0] = new Paperless.Point(point.x + this.puzzled.spacing, point.y + this.puzzled.spacing);																	// top left
		points[1] = new Paperless.Point(point.x + this.width - this.puzzled.spacing, point.y + this.height - this.puzzled.spacing);								// bottom right
		
		if(this.puzzled.getMarker() && expandable)
		{
			let guid: string = this.puzzled.getGuid(new Paperless.Point(this.x, this.y));
			let expandable: {left: boolean, right: boolean, top: boolean, bottom: boolean} = this.puzzled.isExpandable(guid);
			//let shrinkable: {width: boolean, height: boolean} = this.puzzled.isShrinkable(guid);

			//let left: number | boolean = expandable.left ? false : shrinkable.width ? true : -1;
			//let right: number | boolean = expandable.right ? false : shrinkable.width ? true : -1;
			//let top: number | boolean = expandable.top ? false : shrinkable.height ? true : -1;
			//let bottom: number | boolean = expandable.bottom ? false : shrinkable.height ? true : -1;

			let left: number | boolean = expandable.left ? false : -1;
			let right: number | boolean = expandable.right ? false : -1;
			let top: number | boolean = expandable.top ? false : -1;
			let bottom: number | boolean = expandable.bottom ? false : -1;

			points[2] = new Paperless.Point(points[0].x + ((this.width - this.puzzled.spacing) / 2), points[0].y);																	// middle top
			points[3] = new Paperless.Point(points[1].x + this.puzzled.spacing, points[1].y - ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing);	// middle right
			points[4] = new Paperless.Point(points[0].x + ((this.width - this.puzzled.spacing) / 2), points[1].y + this.puzzled.spacing);									// middle bottom
			points[5] = new Paperless.Point(points[0].x, points[1].y - ((this.height - this.puzzled.spacing) / 2) + this.puzzled.spacing);									// middle left

			this.path = new Path2D();
			this.path.moveTo(points[5].x, points[2].y);
			this.path.lineTo(points[2].x - 10, points[2].y);
			if(top == -1)
				this.path.lineTo(points[2].x + 10, points[2].y);
			else
				this.path.arc(points[2].x, points[2].y, 10, Math.PI, 0, <boolean>top);
			this.path.lineTo(points[3].x, points[2].y);

			this.path.lineTo(points[3].x, points[3].y - 10);
			if(right == -1)
				this.path.lineTo(points[3].x, points[3].y + 10);
			else
				this.path.arc(points[3].x, points[3].y, 10, 1.5 * Math.PI, 0.5 * Math.PI, <boolean>right);
			this.path.lineTo(points[3].x, points[4].y);
			
			this.path.lineTo(points[4].x + 10, points[4].y);
			if(bottom == -1)
				this.path.lineTo(points[4].x - 10, points[4].y);
			else
				this.path.arc(points[4].x, points[4].y, 10, 0, Math.PI, <boolean>bottom);
			this.path.lineTo(points[5].x, points[4].y);

			this.path.lineTo(points[5].x, points[5].y + 10);
			if(left == -1)
				this.path.lineTo(points[5].x, points[5].y - 10);
			else
				this.path.arc(points[5].x, points[5].y, 10, 0.5 * Math.PI, 1.5 * Math.PI, <boolean>left);
			this.path.lineTo(points[5].x, points[2].y);
			
			this.path.closePath();
		}
		else
		{
			this.path = new Path2D();
			this.path.rect(points[0].x, points[0].y, points[1].x, points[1].y);
		}

		/*
		this._contour = new Path2D();
		this._contour.rect(points[0].x + 1, points[0].y + 1, points[1].x - 2, points[1].y - 2);
		this._contour.closePath();
		*/

		this.points = points;
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		//let ismarked: boolean = false;

		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset1.x, this.matrix.f + this.offset1.y);

		context2D.strokeStyle = this.strokecolor;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(this.puzzled.getMarker() && !this.context.states.drag)
		{
			let control: Paperless.Control = this.puzzled.extractGuid(this.puzzled.getMarker());

			if(control.drawable.guid == this.guid)
			{
				//ismarked = true;
				context2D.shadowBlur = this.puzzled.shadow;
				context2D.shadowColor = this.puzzled.color.marked;
				context2D.strokeStyle = this.puzzled.color.marked;
			}
		}

		context2D.lineWidth = this.linewidth;
		context2D.fillStyle = this.fillcolor;
		context2D.globalAlpha = this.alpha;

		if(!this.nostroke)
			context2D.stroke(this.path);
		if(!this.nofill)
			context2D.fill(this.path);

		context2D.restore();
		context2D.save();
		context2D.shadowBlur = 0;
		
		this.onDraw(context2D);
		
		/*
		if(!this.nostroke && ismarked)
		{
			context2D.translate(this.point.x, this.point.y);
			context2D.rotate((Math.PI / 180) * this.angle);
			context2D.scale(this.scale.x, this.scale.y);
			context2D.strokeStyle = 'this.puzzled.color.faked';
			context2D.stroke(this._contour);
		}
		*/

		context2D.restore();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void {}



	// Accessors
	// --------------------------------------------------------------------------

	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}

	/*
	public get mocksize(): Paperless.Size
	{
		return this._mocksize;
	}
	public set mocksize(mocksize: Paperless.Size)
	{
		this._mocksize = mocksize;
	}
	*/
}
