import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {IEntityCoreDrawableAttributes} from '../interfaces/IPuzzled.js';



export class EntityCoreDrawable extends Paperless.Drawable
{
	private _puzzled: Puzzled;
	//---

	public constructor(attributes: IEntityCoreDrawableAttributes = {})
	{
		super({
			...{
				fillcolor: attributes.puzzled.color.fill,
				strokecolor: attributes.puzzled.color.stroke,
				nostroke: attributes.puzzled.nostroke,
				nofill: attributes.puzzled.nofill,
				linewidth: attributes.puzzled.linewidth
			},
			...attributes,
			...{
				generate: false
			}
		});

		this._puzzled = attributes.puzzled;
		this.context = attributes.puzzled.context;

		this.generate(true);
	}

	public generate(expandable?: boolean): void
	{
		const points: Paperless.Point[] = [];
		const point: Paperless.Point = new Paperless.Point(0, 0);

		if((<any>this.points)['origin'])
			(<any>points)['origin'] = (<any>this.points)['origin'];
			
		points[0] = new Paperless.Point(point.x + this._puzzled.spacing, point.y + this._puzzled.spacing);											// top left
		points[1] = new Paperless.Point(point.x + this.width - this._puzzled.spacing, point.y + this.height - this._puzzled.spacing);		// bottom right
		
		if(this._puzzled.getMarker() && expandable)
		{
			const guid: string = this._puzzled.getGuid(new Paperless.Point(this.x, this.y));
			const expandable: {left: boolean, right: boolean, top: boolean, bottom: boolean} = this._puzzled.isExpandable(guid);

			const left: number | boolean = expandable.left ? false : -1;
			const right: number | boolean = expandable.right ? false : -1;
			const top: number | boolean = expandable.top ? false : -1;
			const bottom: number | boolean = expandable.bottom ? false : -1;

			points[2] = new Paperless.Point(points[0].x + ((this.width - this._puzzled.spacing) / 2), points[0].y);																	// middle top
			points[3] = new Paperless.Point(points[1].x + this._puzzled.spacing, points[1].y - ((this.height - this._puzzled.spacing) / 2) + this._puzzled.spacing);	// middle right
			points[4] = new Paperless.Point(points[0].x + ((this.width - this._puzzled.spacing) / 2), points[1].y + this._puzzled.spacing);									// middle bottom
			points[5] = new Paperless.Point(points[0].x, points[1].y - ((this.height - this._puzzled.spacing) / 2) + this._puzzled.spacing);									// middle left
			points[1].x += this._puzzled.spacing;
			points[1].y += this._puzzled.spacing;

			this.path = new Path2D();
			this.path.moveTo(points[0].x + this._puzzled.rounded.topLeft, points[0].y);

			this.path.lineTo(points[2].x - 10, points[2].y);
			if(top == -1)
				this.path.lineTo(points[2].x + 10, points[2].y);
			else
				this.path.arc(points[2].x, points[2].y, 10, Math.PI, 0, <boolean>top);

			this.path.lineTo(points[1].x - this._puzzled.rounded.topRight, points[0].y);
			this.path.quadraticCurveTo(points[1].x, points[0].y, points[1].x, points[0].y + this._puzzled.rounded.topRight);

			this.path.lineTo(points[3].x, points[3].y - 10);
			if(right == -1)
				this.path.lineTo(points[3].x, points[3].y + 10);
			else
				this.path.arc(points[3].x, points[3].y, 10, 1.5 * Math.PI, 0.5 * Math.PI, <boolean>right);

			this.path.lineTo(points[1].x, points[1].y - this._puzzled.rounded.bottomRight);
			this.path.quadraticCurveTo(points[1].x, points[1].y, points[1].x - this._puzzled.rounded.bottomRight, points[1].y);
			
			this.path.lineTo(points[4].x + 10, points[4].y);
			if(bottom == -1)
				this.path.lineTo(points[4].x - 10, points[4].y);
			else
				this.path.arc(points[4].x, points[4].y, 10, 0, Math.PI, <boolean>bottom);

			this.path.lineTo(points[0].x + this._puzzled.rounded.bottomLeft, points[1].y);
			this.path.quadraticCurveTo(points[0].x, points[1].y, points[0].x, points[1].y - this._puzzled.rounded.bottomLeft);

			this.path.lineTo(points[5].x, points[5].y + 10);
			if(left == -1)
				this.path.lineTo(points[5].x, points[5].y - 10);
			else
				this.path.arc(points[5].x, points[5].y, 10, 0.5 * Math.PI, 1.5 * Math.PI, <boolean>left);

			this.path.lineTo(points[0].x, points[0].y + this._puzzled.rounded.topLeft);
			this.path.quadraticCurveTo(points[0].x, points[0].y, points[0].x + this._puzzled.rounded.topLeft, points[0].y);
			
			this.path.closePath();
		}
		else
		{
			points[1].x += this._puzzled.spacing;
			points[1].y += this._puzzled.spacing;

			this.path = new Path2D();
			this.path.moveTo(points[0].x + this._puzzled.rounded.topLeft, points[0].y);
			this.path.lineTo(points[1].x - this._puzzled.rounded.topRight, points[0].y);
			this.path.quadraticCurveTo(points[1].x, points[0].y, points[1].x, points[0].y + this._puzzled.rounded.topRight);
			this.path.lineTo(points[1].x, points[1].y - this._puzzled.rounded.bottomRight);
			this.path.quadraticCurveTo(points[1].x, points[1].y, points[1].x - this._puzzled.rounded.bottomRight, points[1].y);
			this.path.lineTo(points[0].x + this._puzzled.rounded.bottomLeft, points[1].y);
			this.path.quadraticCurveTo(points[0].x, points[1].y, points[0].x, points[1].y - this._puzzled.rounded.bottomLeft);
			this.path.lineTo(points[0].x, points[0].y + this._puzzled.rounded.topLeft);
			this.path.quadraticCurveTo(points[0].x, points[0].y, points[0].x + this._puzzled.rounded.topLeft, points[0].y);
			this.path.closePath();
		}

		this.points = points;
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(
			this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 
			this.matrix.e + this.offset1.x + this.offset2.x, 
			this.matrix.f + this.offset1.y + this.offset2.y
		);

		context2D.strokeStyle = this.strokecolor;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(this._puzzled.getMarker() && !this.context.states.drag)
		{
			const control: Paperless.Control = this._puzzled.extractGuid(this._puzzled.getMarker());

			if(control.drawable.guid == this.guid)
			{
				context2D.shadowBlur = this._puzzled.shadow;
				context2D.shadowColor = this._puzzled.color.marked;
				context2D.strokeStyle = this._puzzled.color.marked;
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

		context2D.restore();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void {}



	// Accessors
	// --------------------------------------------------------------------------

	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}
}
