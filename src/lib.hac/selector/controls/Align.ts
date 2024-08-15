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
			restrict = Paperless.Enums.Restrict.horizontal,
			isolated = 1,
			bypass = false,
			duration = {},
			direction = {},
		} = attributes;

		this._attributes = {
			restrict: restrict,
			isolated: isolated,
			bypass: bypass,
			duration: {...{fade: 300, shift: 500}, ...duration},
			direction: {...{fadeout: Paperless.Enums.Direction.top, fadein: Paperless.Enums.Direction.down, shift: Paperless.Enums.Direction.right}, ...direction},
		};
	}

	public onInitializing(): void
	{
		if(this._attributes.restrict == Paperless.Enums.Restrict.horizontal)
			this.alignHorizontal();
		else if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
			this.alignVertical();
	}

	public onPopping(item: Item): void
	{
		if(this._attributes.isolated > 1)
			return;

		let fadeDistance: number;

		if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
			fadeDistance = this.selector.width;
		else
			fadeDistance = this.selector.height;

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
			effect: this.selector.fx.translate,
			nogroup: true,
			smuggler: { ease: Paperless.Fx.easeOutExpo, angle: this._attributes.direction.fadeout, distance: fadeDistance },
			complete: () => { 
				const index = this.selector.items.indexOf(item);

				this.selector.items.splice(index, 1);
				if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
					item.drawable.y = this.selector.y + (item.drawable.height / 2) + this.selector.padding.top;
				else
					item.drawable.x = this.selector.x + (item.drawable.width / 2) + this.selector.padding.left;

				this.realign().then(() => {
					this.selector.fx.add({
						duration: this.attributes.duration.fade,
						drawable: item.drawable,
						effect: this.selector.fx.fadeIn,
						nogroup: true,
						smuggler: { ease: Paperless.Fx.easeInExpo }
					});
					 
					this.selector.fx.add({ 
						duration: this.attributes.duration.fade,
						drawable: item.drawable,
						effect: this.selector.fx.translate,
						nogroup: true,
						smuggler: { ease: Paperless.Fx.easeInSine, angle: this.attributes.direction.fadein, distance: fadeDistance },
						complete: () => {
							this.selector.items.unshift(item);
							
							item.drawable.context.draw();
							item.enabled = false;
							item.drawable.hoverable = false;
							item.onAfterSelection();
							this.enableItems();
							item.enabled = false;
						}
					});
				});
			}
		});
	}
	
	public realign(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			if(this.selector.items.length > 0)
			{
				let point: number;
				let distance: number;
				let drawable: Paperless.Drawable;
				let count: number = this.selector.items.length;

				if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
					point = this.selector.y + this.selector.height
				else
					point = this.selector.x + this.selector.width;

				for(let i: number = count - 1; i >= 0; i--)
				{
					drawable = this.selector.items[i].drawable;
					point -= (this._attributes.restrict == Paperless.Enums.Restrict.vertical) ? drawable.height : drawable.width;
		
					if(this._attributes.restrict == Paperless.Enums.Restrict.vertical)
						distance = point - drawable.y + (drawable.height / 2) - this.selector.padding.bottom;
					else
						distance = point - drawable.x + (drawable.width / 2) - this.selector.padding.right;

					this.selector.fx.add({
						duration: this._attributes.duration.shift,
						drawable: drawable,
						effect: this.selector.fx.translate,
						nogroup: true,
						smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: this._attributes.direction.shift, distance: distance },
						complete: () => {
							count--;

							if(count <= 0)
								resolve(null);
						}
					});
		
					point -= this.selector.spacing;
				}
			}
		});
	}

	private alignHorizontal(): void
	{
		this.selector.height = this.maxItemHeight();

		if(this.selector.items.length > 0)
		{
			let x: number = this.selector.x + this.selector.width - this.selector.padding.right;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				if(i > this._attributes.isolated - 1)
				{
					// Right menu
					x -= (this.selector.items[i].drawable.width / 2);
					this.selector.items[i].drawable.x = x ;
					x -= (this.selector.items[i].drawable.width / 2) + this.selector.spacing;
				}
				else
				{
					// Left menu
					this.selector.items[i].drawable.x = (i * ((this.selector.items[i].drawable.width) + this.selector.spacing)) + this.selector.x + this.selector.padding.left + (this.selector.items[0].drawable.width / 2);

					if(!this._attributes.bypass)
						this.selector.items[i].enabled = false;
				}

				this.selector.items[i].drawable.y = this.selector.y + (this.selector.height / 2) + this.selector.padding.top - this.selector.padding.bottom;
			}
		}

		this.selector.context.refresh();
	}

	private alignVertical(): void
	{
		this.selector.width = this.maxItemWidth();

		if(this.selector.items.length > 0)
		{
			let y: number = this.selector.y + this.selector.height - this.selector.padding.bottom;

			for(let i: number = this.selector.items.length - 1; i >= 0; i--)
			{
				if(i > this._attributes.isolated - 1)
				{
					// Bottom menu
					y -= (this.selector.items[i].drawable.height / 2);
					this.selector.items[i].drawable.y = y ;
					y -= (this.selector.items[i].drawable.height / 2) + this.selector.spacing;
				}
				else
				{
					// Top menu
					this.selector.items[i].drawable.y = (i * ((this.selector.items[i].drawable.height) + this.selector.spacing)) + this.selector.y + this.selector.padding.top + (this.selector.items[0].drawable.height / 2);
					
					if(!this._attributes.bypass)
						this.selector.items[i].enabled = false;
				}

				this.selector.items[i].drawable.x = this.selector.x + (this.selector.width / 2) + this.selector.padding.left - this.selector.padding.right;
			}
		}

		this.selector.context.refresh();
	}



	// Accessors
	// --------------------------------------------------------------------------
	public get attributes(): IComponentSelectorAlignAttributes
	{
		return this._attributes;
	}
	public set attributes(attributes: IComponentSelectorAlignAttributes)
	{
		this._attributes = attributes;
	}
}
