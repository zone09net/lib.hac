import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUIEditableAttributes} from '../interfaces/IUI.js';
import {Editable as Child} from '../../editable/components/Editable.js';
import { EntityCoreControl } from '../../puzzled/controls/EntityCoreControl.js';



export class Editable extends EntityCoreDrawable
{
	private _editable: Child;
	private _index: number;
	//---

	public constructor(attributes: IDrawableUIEditableAttributes = {})
	{
		super({
			...attributes, 
			...{
				//nostroke: false, 
				//nofill: false,
			}
		});

		const {
			content = '',
			maxchar = 0,
			maxline = 0,
			restrict = /./,
			label = {},
			cursor = {},
			password = false
		} = attributes;

		this._editable = new Child({
			...{
				point: {x: this.x, y: this.y},
				size: {width: this.width - this.puzzled.spacing, height: this.height - this.puzzled.spacing},
				sticky: this.sticky,
				maxchar: maxchar,
				maxline: maxline,
				restrict: restrict,
				layer: Paperless.Layer.decode(this.guid),
			},
			label: { 
				...{ 
					wrapping: true, 
					multiline: true 
				},
				...label,
				...{ 
					content: content || label.content,
					matrix: this.matrix,
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
					strokecolor: this.strokecolor,
				}
			},
			cursor: {
				...cursor,
				...{
					offset1: this.puzzled.point,
					offset2: {x: this.puzzled.spacing, y: this.puzzled.spacing},
					matrix: this.matrix,
					sticky: this.sticky,
				}
			},
			password: password,
			onTab: () => {
				let current: number = 0;
				const filtered: EntityCoreControl[] = this.puzzled.getControls().filter((value: EntityCoreControl, index: number) => value.drawable instanceof Editable);

				filtered.forEach((control: EntityCoreControl, index: number) => {
					console.log('index', index);
					if(control.drawable.guid == this.guid)
					{
						//current = Number(index);
						console.log('current', index);
					}
				});

				console.log('***', current); 
				//if(filtered[current + 1])
					filtered[current].toggleMarker();
				/*
				if(current == filtered.length - 1)
					filtered[0].toggleMarker();
				else
					filtered[current + 1].toggleMarker();*/


			}
		});

		this.context.enroll(this._editable);

		this._editable.attachBackground(this);
		this._editable.attachCursor();
		this._editable.initialize();
	}
	
	public update(): void
	{
		this._editable.width = this.width - this.puzzled.spacing;
		this._editable.height = this.height - this.puzzled.spacing;
		this._editable.childs.label.width = this.width - this.puzzled.spacing;
		this._editable.childs.label.height = this.height - this.puzzled.spacing;
		this._editable.update(true);
	}

	public onDetach(): void
	{
		this._editable.onDetach();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._editable.childs.label.draw(context2D);

		if(this._editable.childs.cursor.visible)
			this._editable.childs.cursor.draw(context2D);
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get childs(): {editable: Child}
	{
		return {editable: this._editable};
	}
}

