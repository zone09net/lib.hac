import * as Paperless from '@zone09.net/paperless';
import {Puzzled} from '../components/Puzzled.js';
import {Icon} from './Icon.js';
import {Highlight} from '../drawables/Highlight.js';
import {Assets} from '../drawables/Assets.js';
import {Sizer as CSizer} from './Sizer.js';
import {Sizer as DSizer} from '../drawables/Sizer.js';
import {Splitter as CSplitter} from './Splitter.js';
import {Splitter as DSplitter} from '../drawables/Splitter.js';



export class EntityCoreControl extends Paperless.Control
{
	/** @ignore */
	[key: string]: any;

	private _puzzled: Puzzled;
	private _swappable: boolean = true;
	private _expandable: boolean = true;
	private _shrinkable: boolean = true;
	private _splittable: boolean = true;
	private _highlightMoving: Highlight;
	private _highlightOrigin: Highlight;
	private _isMovable: boolean = false;
	private _isSwappable: boolean = false;
	private _offsets: {x: number, y: number, hopx: number, hopy: number};
	private _origin: Paperless.Point;
	private _pointCurrent: Paperless.Point;
	//---

	public constructor(puzzled: Puzzled)
	{
		super();

		this._puzzled = puzzled;
		this._highlightMoving = new Highlight(new Paperless.Point(0, 0), new Paperless.Size(0, 0), this.puzzled);
		this._highlightOrigin = new Highlight(new Paperless.Point(0, 0), new Paperless.Size(0, 0), this.puzzled);

		this._offsets = {
			x: (this._puzzled.point.x < this._puzzled.hop) ? -this._puzzled.point.x : (Math.ceil(this._puzzled.point.x / this._puzzled.hop) * this._puzzled.hop) - this._puzzled.point.x,
			y: (this._puzzled.point.y < this._puzzled.hop) ? -this._puzzled.point.y : (Math.ceil(this._puzzled.point.y / this._puzzled.hop) * this._puzzled.hop) - this._puzzled.point.y,
			hopx: (this._puzzled.point.x < this._puzzled.hop) ? 0 : (Math.ceil(this._puzzled.point.x / this._puzzled.hop) * this._puzzled.hop),
			hopy: (this._puzzled.point.y < this._puzzled.hop) ? 0 : (Math.ceil(this._puzzled.point.y / this._puzzled.hop) * this._puzzled.hop),
		}
	}

	public onDragBegin(): void
	{
		this.puzzled.detach(this.puzzled.getIcons());
		this.puzzled.removeMarker();

		this._highlightMoving.size = new Paperless.Size(this.drawable.size.width, this.drawable.size.height);
		this._highlightMoving.generate();

		this._highlightOrigin.size = new Paperless.Size(this.drawable.size.width, this.drawable.size.height);
		this._highlightOrigin.generate();

		this._origin = new Paperless.Point(this.drawable.point.x, this.drawable.point.y);
	}

	public onDrag(): void
	{
		let context2D: OffscreenCanvasRenderingContext2D = this.context.context2D;

		this._pointCurrent = this.context.getStates().pointCurrent;
		this._pointCurrent = new Paperless.Point(
			(Math.round((this._pointCurrent.x - this.context.getStates().pointDragMouseOffset.x - this.puzzled.point.x) / this.puzzled.hop) * this.puzzled.hop) + this._offsets.hopx - this._offsets.x,
			(Math.round((this._pointCurrent.y - this.context.getStates().pointDragMouseOffset.y - this.puzzled.point.y) / this.puzzled.hop) * this.puzzled.hop) + this._offsets.hopy - this._offsets.y,
		);

		let guid: string = this.puzzled.getGuid(new Paperless.Point(this._pointCurrent.x, this._pointCurrent.y + this.puzzled.point.y), new Array(this.guid));
		if(this.puzzled.isSwappable(this.guid, guid))
		{
			let control: Paperless.Control = this.puzzled.extractGuid(guid);

			if(this._swappable)
			{
				
				this._isSwappable = true;
				this._highlightOrigin.point = new Paperless.Point(this._origin.x, this._origin.y);
				this._highlightOrigin.draw(context2D);
			}

			this._highlightMoving.point = control.drawable.point;
		}
		else
		{
			this._isSwappable = false;
			this._highlightMoving.point = new Paperless.Point(this._pointCurrent.x, this._pointCurrent.y + this.puzzled.point.y + this._offsets.y);
		}
		
		this._highlightMoving.draw(context2D);

		context2D.shadowBlur = this.puzzled.shadow;
		context2D.shadowColor = this.puzzled.color.move;
		if(!this.puzzled.isMovable(this.guid, this._pointCurrent) && !this._isSwappable)
		{
			this._isMovable = false;
			context2D.shadowColor = this.puzzled.color.nomove;
			context2D.strokeStyle = this.puzzled.color.nomove;
		}
		else
			this._isMovable = true;
	}

	public async onDragEnd(): Promise<void>
	{
		if(!this._isMovable && !this._isSwappable)
		{
			//this.drawable.point = new Paperless.Point(this._origin.x, this._origin.y);
			this.drawable.point.x = this._origin.x;
			this.drawable.point.y = this._origin.y;
			this.onCancel();
		}

		else if(this._isSwappable)
		{
			let promise = this.onSwapping(this.drawable.point);

			promise.then(
				success => {
					let guid: string = this.puzzled.getGuid(this._pointCurrent, new Array(this.guid));
					let control: EntityCoreControl = this.puzzled.extractGuid(guid);
					
					this.drawable.point.x = this._highlightMoving.point.x;
					this.drawable.point.y = this._highlightMoving.point.y;
 
					//control.drawable.point = new Paperless.Point(this._origin.x, this._origin.y);
					control.drawable.point.x = this._origin.x;
					control.drawable.point.y = this._origin.y;

					control.onSwapped(this._highlightMoving.point);
					this.onSwapped(this._origin);
				},
				error => {
					this.drawable.point = new Paperless.Point(this._origin.x, this._origin.y);
				}
			);
		}

		else if(this._isMovable)
		{
			//this.drawable.point = new Paperless.Point(this._highlightMoving.point.x, this._highlightMoving.point.y);
			this.drawable.point.x = this._highlightMoving.point.x;
			this.drawable.point.y = this._highlightMoving.point.y;

			let promise: Promise<unknown> = this.onMoving(this.drawable.point);

			promise.then(
				success => {
					if(this.puzzled.expandable)
						this.puzzled.resize();

					this.onMoved(this._origin);
				},
				error => {
					//this.drawable.point = new Paperless.Point(this._origin.x, this._origin.y);
					this.drawable.point.x = this._origin.x;
					this.drawable.point.y = this._origin.y;
				}
			);
		}
	}

	public onLoading(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onLoaded(): void {}

	public onLeftClick(): void
	{
		this.toggleMarker();
	}

	public onRightClick(): void {}

	public onRemoving(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onRemoved(): void {}

	public onCancel(): void {}

	public onMoving(pointDestination: Paperless.Point): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onMoved(pointSource: Paperless.Point): void {}

	public onSwapping(pointDestination: Paperless.Point): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			resolve(null);
		})
	}

	public onSwapped(pointSource: Paperless.Point): void {}

	public onFocus(): void {}

	public onLostFocus(): void {}

	public onMarked(): void {}

	public onUnmarked(): void {}

	public onSplitted(): void {}

	public onExpanded(): void {}

	public onShrinked(): void {}

	public onIconsDefault(): void
	{
		let pointBottomRight: Paperless.Point = new Paperless.Point(this.drawable.point.x + this.drawable.size.width - 9, this.drawable.point.y + this.drawable.size.height);

		this.attachIcon(pointBottomRight, new Paperless.Size(22, 22), Assets.delete, () => {
			this.toggleMarker();
			this.puzzled.removeGuid(this.guid);
		});
	}

	public onIconsRefresh(): void {}

	public toggleMarker(ignoregroup: boolean = false): void
	{
		if(this.puzzled.getMarker() == this.guid)
		{
			if(this.puzzled.group != undefined && ignoregroup == false)
			{
				let group: Paperless.Group = this.context.get(this.puzzled.group);

				group.map.forEach((value: any, key: number) => {
					if(value[1].object.constructor.name == 'Puzzled')
						value[1].object.detach(value[1].object.getIcons());
				});
			}
			else
				this.puzzled.detach(this.puzzled.getIcons());

			this.puzzled.removeMarker();
		}
		else
		{
			if(this.puzzled.group != undefined && ignoregroup == false)
			{
				let group: Paperless.Group = this.context.get(this.puzzled.group);

				group.map.forEach((value: any, key: number) => {
					if(value[1].object.constructor.name == 'Puzzled')
						value[1].object.detach(value[1].object.getIcons());
				});
			}
			
			this.puzzled.removeMarker();
			this.puzzled.setMarker(this.drawable.point);
			this.refreshIcons();
		}
	}

	public attachIcon(point: Paperless.Point, size: Paperless.Size, object: string | HTMLImageElement | Paperless.Drawable, callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null, newicon?: typeof Icon)
	{
		let drawable: Paperless.Drawable;
		let icon: Icon;

		if(!newicon)
			newicon = Icon

		if(typeof object == 'string' || object instanceof HTMLImageElement)
			drawable = this.context.attach(new Paperless.Drawables.Artwork(point, size, {content: object, hoverable: true}));
		else
			drawable = object;

		if(this.drawable.sticky)
			drawable.sticky = true;
			
		icon = this.context.attach(new newicon(
			this.puzzled,
			() => { callbackLeftClick(smugglerLeftClick); },
			() => { callbackRightClick(smugglerRightClick); }
		));
		icon.attach(drawable);

		this.puzzled.attach(icon);
	}

	public refreshIcons(): void
	{
		let expandable: {left: boolean, right: boolean, top: boolean, bottom: boolean} = this.puzzled.isExpandable(this.guid);
		let shrinkable: {width: boolean, height: boolean} = this.puzzled.isShrinkable(this.guid);
		let pointLeft: Paperless.Point = new Paperless.Point(this.drawable.point.x, this.drawable.point.y + ((this.drawable.size.height - this.puzzled.spacing) / 2));
		let pointRight: Paperless.Point = new Paperless.Point(this.drawable.point.x + this.drawable.size.width - this.puzzled.spacing, this.drawable.point.y + ((this.drawable.size.height - this.puzzled.spacing) / 2));
		let pointTop: Paperless.Point = new Paperless.Point(this.drawable.point.x + ((this.drawable.size.width - this.puzzled.spacing) / 2), this.drawable.point.y);
		let pointBottom: Paperless.Point = new Paperless.Point(this.drawable.point.x + ((this.drawable.size.width - this.puzzled.spacing) / 2), this.drawable.point.y + this.drawable.size.height - this.puzzled.spacing);
		
		this.puzzled.detach(this.puzzled.getIcons());

		if(this._shrinkable)
		{
			if(shrinkable.width)
			{
				this.addSizer(pointLeft, 270, 90, 'shrinkFromLeft', 'shrinkFromLeftMin');
				this.addSizer(pointRight, 90, 270, 'shrinkFromRight', 'shrinkFromRightMin');
			}
			if(shrinkable.height)
			{
				this.addSizer(pointTop, 0, 180, 'shrinkFromTop', 'shrinkFromTopMin');
				this.addSizer(pointBottom, 180, 0, 'shrinkFromBottom', 'shrinkFromBottomMin');
			}
		}

		if(this._expandable)
		{
			if(expandable.left)
				this.addSizer(pointLeft, 90, 270, 'expandFromLeft', 'expandFromLeftMax');
			if(expandable.right)
				this.addSizer(pointRight, 270, 90, 'expandFromRight', 'expandFromRightMax');
			if(expandable.top)
				this.addSizer(pointTop, 180, 0, 'expandFromTop', 'expandFromTopMax');
			if(expandable.bottom)
				this.addSizer(pointBottom, 0, 180, 'expandFromBottom', 'expandFromBottomMax');
		}

		if(this._splittable)
		{
			if(shrinkable.width)
			{
				pointLeft.x += 17;
				pointRight.x -= 17;

				this.addSplitter(pointLeft, 0, 'splitFromLeft', undefined);
				this.addSplitter(pointRight, 0, 'splitFromRight', undefined);
			}
			if(shrinkable.height)
			{
				pointTop.y += 17;
				pointBottom.y -= 17;

				this.addSplitter(pointTop, 90, 'splitFromTop', undefined);
				this.addSplitter(pointBottom, 90, 'splitFromBottom', undefined);
			}
		}

		this.onIconsDefault();
		this.onIconsRefresh();

		this.context.getDrawables().sort();
		this.context.getControls().reverse();
		//this.context.canvas.dispatchEvent(new MouseEvent('mousemove', {clientX: this.context.getStates().pointClicked.x, clientY: this.context.getStates().pointClicked.y}));
	}

	private addSizer(point: Paperless.Point, angle1: number, angle2: number, leftClickCallback: string, rightClickCallback: string): void
	{
		point = new Paperless.Point(point.x, point.y);

		let drawable: Paperless.Drawable = this.context.attach(new DSizer(point, angle1, angle2, this.puzzled));
		let icon: CSizer = this.context.attach(new CSizer(
			this.puzzled,
			this,
			() => { this.puzzled[leftClickCallback](this.guid); this.refreshIcons(); },
			() => { this.puzzled[rightClickCallback](this.guid); this.refreshIcons(); }
		));
		icon.attach(drawable);

		if(leftClickCallback == 'shrinkFromLeft' || leftClickCallback == 'shrinkFromRight' || leftClickCallback == 'expandFromLeft' || leftClickCallback == 'expandFromRight')
			icon.movement = 'horizontal';
		else if(leftClickCallback == 'shrinkFromTop' || leftClickCallback == 'shrinkFromBottom' || leftClickCallback == 'expandFromTop' || leftClickCallback == 'expandFromBottom')
			icon.movement = 'vertical';

		this.puzzled.attach(icon);
	}

	private addSplitter(point: Paperless.Point, angle: number, leftClickCallback: string, rightClickCallback: string): void
	{
		point = new Paperless.Point(point.x, point.y);

		let drawable: Paperless.Drawable = this.context.attach(new DSplitter(point, angle, this.puzzled));
		let icon: CSplitter = this.context.attach(new CSplitter(
			this.puzzled,
			() => { this.puzzled[leftClickCallback](this.guid); this.drawable.generate(); this.refreshIcons(); },
			() => { }
		));
		icon.attach(drawable);
		
		this.puzzled.attach(icon);
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}

	public get swappable(): boolean
	{
		return this._swappable;
	}
	public set swappable(swappable: boolean)
	{
		this._swappable = swappable;
	}

	public get expandable(): boolean
	{
		return this._expandable;
	}
	public set expandable(expandable: boolean)
	{
		this._expandable = expandable;
	}

	public get shrinkable(): boolean
	{
		return this._shrinkable;
	}
	public set shrinkable(shrinkable: boolean)
	{
		this._shrinkable = shrinkable;
	}

	public get splittable(): boolean
	{
		return this._splittable;
	}
	public set splittable(splittable: boolean)
	{
		this._splittable = splittable;
	}
}
