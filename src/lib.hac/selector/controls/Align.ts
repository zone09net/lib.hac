import * as Paperless from '@zone09.net/paperless';
import {Manipulator} from './Manipulator.js';
import {Item} from './Item.js';
import {IComponentSelectorAlignAttributes} from '../interfaces/ISelector.js';



export class Align extends Manipulator
{
	private _attributes: IComponentSelectorAlignAttributes;
	//---

	public constructor(attributes: IComponentSelectorAlignAttributes = {})
	{
		super();

		const {
			align = Paperless.Enums.Align.Horizontal,
			isolated = 1,
			bypass = false,
			duration = {},
			direction = {},
		} = attributes;

		this._attributes = {
			align: align,
			isolated: isolated,
			bypass: bypass,
			duration: {...{fade: 300, shift: 500}, ...duration},
			direction: {...{fadeout: Paperless.Enums.Direction.Top, fadein: Paperless.Enums.Direction.Down, shift: Paperless.Enums.Direction.Right}, ...direction},
		};
	}

	public onInitializing(): void
	{
		if(this._attributes.align == Paperless.Enums.Align.Horizontal)
			this.alignHorizontal();
		else if(this._attributes.align == Paperless.Enums.Align.Vertical)
			this.alignVertical();
	}

	public onPopping(item: Item): void
	{
		if(this._attributes.isolated > 1)
			return;

		let fadeDistance: number;

		if(this._attributes.align == Paperless.Enums.Align.Vertical)
			fadeDistance = this.selector.size.width;
		else
			fadeDistance = this.selector.size.height;

		this.disableItems();

		item.onBeforeSelection();

		this.selector.fx.add({
			duration: this._attributes.duration.fade,
			drawable: item.drawable,
			effect: this.selector.fx.fadeOut,
			nogroup: true,
			smuggler: { ease: Paperless.Fx.easeOutSine },
		});

		this.selector.fx.add({
			duration: this._attributes.duration.fade,
			drawable: item.drawable,
			effect: this.selector.fx.move,
			nogroup: true,
			smuggler: { ease: Paperless.Fx.easeOutExpo, angle: this._attributes.direction.fadeout, distance: fadeDistance },
			complete: () => { 
				let index = this.selector.items.indexOf(item);

				this.selector.items.splice(index, 1);
				if(this._attributes.align == Paperless.Enums.Align.Vertical)
					item.drawable.point.y = this.selector.point.y + (item.drawable.size.height / 2) + this.selector.padding.top;
				else
					item.drawable.point.x = this.selector.point.x + (item.drawable.size.width / 2) + this.selector.padding.left;

				this.realign();
	
				this.selector.fx.add({
					duration: this._attributes.duration.fade,
					drawable: item.drawable,
					effect: this.selector.fx.fadeIn,
					nogroup: true,
					smuggler: { ease: Paperless.Fx.easeInExpo }
				});
				
				this.selector.fx.add({
					duration: this._attributes.duration.fade,
					drawable: item.drawable,
					effect: this.selector.fx.move,
					nogroup: true,
					smuggler: { ease: Paperless.Fx.easeInExpo, angle: this._attributes.direction.fadein, distance: fadeDistance },
					complete: () => {
						this.selector.items.unshift(item);
						
						window.requestAnimationFrame(() => {
							this.enableItems();
							item.enabled = false;
							item.onAfterSelection();
						});
					}
				});
			}
		});
	}
	
	private realign(): void
	{
		if(this.selector.items.length > 0)
		{
			let point: number;
			let distance: number;
			let drawable: Paperless.Drawable;

			if(this._attributes.align == Paperless.Enums.Align.Vertical)
				point = this.selector.point.y + this.selector.size.height
			else
				point = this.selector.point.x + this.selector.size.width;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				drawable = this.selector.items[i].drawable;
				point -= (this._attributes.align == Paperless.Enums.Align.Vertical) ? drawable.size.height : drawable.size.width;
	
				if(this._attributes.align == Paperless.Enums.Align.Vertical)
					distance = point - drawable.point.y + (drawable.size.height / 2) - this.selector.padding.bottom;
				else
					distance = point - drawable.point.x + (drawable.size.width / 2) - this.selector.padding.right;

				this.selector.fx.add({
					duration: this._attributes.duration.shift,
					drawable: drawable,
					effect: this.selector.fx.move,
					nogroup: true,
					smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: this._attributes.direction.shift, distance: distance },
				});
	
				point -= this.selector.spacing;
			}
		}
	}

	private alignHorizontal(): void
	{
		this.selector.size.height = this.maxItemHeight();

		if(this.selector.items.length > 0)
		{
			let x: number = this.selector.point.x + this.selector.size.width - this.selector.padding.right;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				if(i > this._attributes.isolated - 1)
				{
					// Right menu
					x -= (this.selector.items[i].drawable.size.width / 2);
					this.selector.items[i].drawable.point.x = x ;
					x -= (this.selector.items[i].drawable.size.width / 2) + this.selector.spacing;
				}
				else
				{
					// Left menu
					this.selector.items[i].drawable.point.x = (i * ((this.selector.items[i].drawable.size.width) + this.selector.spacing)) + this.selector.point.x + this.selector.padding.left + (this.selector.items[0].drawable.size.width / 2);

					if(!this._attributes.bypass)
						this.selector.items[i].enabled = false;
				}

				this.selector.items[i].drawable.point.y = this.selector.point.y + (this.selector.size.height / 2) + this.selector.padding.top - this.selector.padding.bottom;
			}
		}

		this.selector.context.refresh();
	}

	private alignVertical(): void
	{
		this.selector.size.width = this.maxItemWidth();

		if(this.selector.items.length > 0)
		{
			let y: number = this.selector.point.y + this.selector.size.height - this.selector.padding.bottom;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				if(i > this._attributes.isolated - 1)
				{
					// Bottom menu
					y -= (this.selector.items[i].drawable.size.height / 2);
					this.selector.items[i].drawable.point.y = y ;
					y -= (this.selector.items[i].drawable.size.height / 2) + this.selector.spacing;
				}
				else
				{
					// Top menu
					this.selector.items[i].drawable.point.y = (i * ((this.selector.items[i].drawable.size.height) + this.selector.spacing)) + this.selector.point.y + this.selector.padding.top + (this.selector.items[0].drawable.size.height / 2);
					
					if(!this._attributes.bypass)
						this.selector.items[i].enabled = false;
				}

				this.selector.items[i].drawable.point.x = this.selector.point.x + (this.selector.size.width / 2) + this.selector.padding.left - this.selector.padding.right;
			}
		}

		this.selector.context.refresh();
	}
}
