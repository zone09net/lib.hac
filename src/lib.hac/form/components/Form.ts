import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {Puzzled} from '../../puzzled/components/Puzzled.js';
import {IComponentFormAttributes} from '../interfaces/IForm.js';
import {IComponentFormEntity} from '../interfaces/IForm.js';
import {IDropzoneFile} from '../interfaces/IUI.js';
import {IFormUITemplate} from '../interfaces/IUI.js';
import {IEditableRestrict} from '../interfaces/IUI.js';
import {IComponentPuzzledEntity} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import * as Drawables from '../drawables/Drawables.js';
import * as Controls from '../controls/Controls.js';



export class Form extends Paperless.Component
{
	private _puzzled: Puzzled;
	private _submit: EntityCoreControl;
	private _last: EntityCoreControl;
	private _entities: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _values: {[key: string]: any} = {};
	private _template: IFormUITemplate;
	//---

	public constructor(attributes: IComponentFormAttributes = {})
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
			puzzled = null,
			layer = null,
			template = {},

			onSubmit = null,
			onNoSubmit = null,
		} = attributes;

		onSubmit ? this.onSubmit = onSubmit : null;
		onNoSubmit ? this.onNoSubmit = onNoSubmit : null;

		context ? context.attach(this, layer) : null;
		puzzled ? this._puzzled = puzzled : null;

		this._template = {
			label: template.label ? template.label : {},
			artwork: template.artwork ? template.artwork : {},
			editable: template.editable ? template.editable : {},
			separator: template.separator ? template.separator : {},
			button: template.button ? template.button : {},
			texmage: template.texmage ? template.texmage : {},
			empty: template.empty ? template.empty : {},
			field: template.field ? template.field : {},
			dropzone: template.dropzone ? template.dropzone : {},
			drawio: template.drawio ? template.drawio : {},
		}
	}

	public onSubmit(self?: Form): Promise<void>
	{
		return new Promise((resolve, reject) => {
			resolve();
		})
	}

	public onNoSubmit(self?: Form): void {}

	private new(entity: IComponentPuzzledEntity): EntityCoreControl
	{
		const {
			attributes = {},
		} = entity;
		entity.attributes = attributes;

		return this._puzzled.new([{
			point: entity.point,
			size: entity.size,
			minimum: entity.minimum,
			control: entity.control,
			drawable: entity.drawable,
			attributes: { ...attributes, ...{sticky: this.sticky} },
			backdoor: entity.backdoor
		}]);
	}

	private string(entity: IComponentFormEntity): EntityCoreControl
	{
		let content: string = undefined;

		if(this._values.hasOwnProperty(entity.name) && typeof this._values[entity.name] == 'string')
			content = this._values[entity.name];

		const control: EntityCoreControl = this.new({
			...entity,
			...{
				attributes: {
					...entity.attributes,
					...{
						content: content || entity.attributes.content
					}
				}
			}
		});

		this._entities.set(entity.name, control);

		return control;
	}

	public void(entities: IComponentPuzzledEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.new({
				...entity,
				...{
					control: entity.control || Controls.Static,
					drawable: entity.drawable || Drawables.Void,
				}
			});
		}

		return this;
	}

	public artwork(entities: IComponentPuzzledEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.new({
				...entity,
				...{
					attributes: this.merge(this._template.artwork, entity.attributes),
					control: entity.control || Controls.Static,
					drawable: entity.drawable || Drawables.Artwork,
				}
			});
		}

		return this;
	}

	public label(entities: IComponentPuzzledEntity[]): Form
	{

		for(let entity of entities)
		{
			this._last = this.new({
				...entity,
				...{
					attributes: this.merge(this._template.label, entity.attributes),
					control: entity.control || Controls.Static,
					drawable: entity.drawable || Drawables.Label,
				}
			});
		}

		return this;
	}

	public button(entities: IComponentPuzzledEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.new({
				...entity,
				...{
					attributes: this.merge(this._template.button, entity.attributes),
					control: entity.control || Controls.Button,
					drawable: entity.drawable || Drawables.Button,
				}
			});
		}

		return this;
	}

	public empty(entities: IComponentPuzzledEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.new({
				...entity,
				...{
					attributes: this.merge(this._template.empty, entity.attributes),
					control: entity.control || Controls.Empty,
					drawable: entity.drawable || Drawables.Empty,
				}
			});
		}

		return this;
	}

	public separator(entities: IComponentPuzzledEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.new({
				...entity,
				...{
					attributes: this.merge(this._template.separator, entity.attributes),
					control: entity.control || Controls.Separator,
					drawable: entity.drawable || Drawables.Separator,
				}
			});
		}

		return this;
	}

	public texmage(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.texmage, entity.attributes),
					control: entity.control || Controls.Texmage,
					drawable: entity.drawable || Drawables.Texmage,
				}
			});
		}

		return this;
	}

	public editable(entities: IComponentFormEntity[]): Form
	{

		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.editable, entity.attributes),
					control: entity.control || Controls.Editable,
					drawable: entity.drawable || Drawables.Editable,
				}
			});
		}

		return this;
	}

	public codemirror(entities: IComponentFormEntity[]): Form
	{

		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.editable, entity.attributes),
					control: entity.control || Controls.Codemirror,
					drawable: entity.drawable || Drawables.Codemirror,
				}
			});
		}

		return this;
	}

	public field(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.field, entity.attributes),
					control: entity.control || Controls.Field,
					drawable: entity.drawable || Drawables.Field,
				}
			});
		}

		return this;
	}
	
	public dropzone(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			const control: EntityCoreControl = this.new({
				...entity,
				...{
					attributes: this.merge(this._template.dropzone, entity.attributes),
					control: entity.control || Controls.Dropzone,
					drawable: entity.drawable || Drawables.Dropzone,
				}
			});

			this._entities.set(entity.name, control);
			this._last = control;
		}

		return this;
	}

	public drawio(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.drawio, entity.attributes),
					control: entity.control || Controls.Drawio,
					drawable: entity.drawable || Drawables.Drawio,
				}
			});
		}

		return this;
	}

	public gantt(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.gantt, entity.attributes),
					control: entity.control || Controls.Gantt,
					drawable: entity.drawable || Drawables.Gantt,
				}
			});
		}

		return this;
	}

	public mindmap(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.mindmap, entity.attributes),
					control: entity.control || Controls.Mindmap,
					drawable: entity.drawable || Drawables.Mindmap,
				}
			});
		}

		return this;
	}

	public whiteboard(entities: IComponentFormEntity[]): Form
	{
		for(let entity of entities)
		{
			this._last = this.string({
				...entity,
				...{
					attributes: this.merge(this._template.whiteboard, entity.attributes),
					control: entity.control || Controls.Whiteboard,
					drawable: entity.drawable || Drawables.Whiteboard,
				}
			});
		}

		return this;
	}

	public submit(entity: IComponentPuzzledEntity): Promise<unknown>
	{
		this._submit = this.new({
			...entity,
			...{
				attributes: this.merge(this._template.button, entity.attributes),
				control: entity.control || Controls.Button,
				drawable: entity.drawable || Drawables.Button,
			}
		});

		return new Promise((resolve, reject) => {
			this._submit.onLeftClick = () => {
				this.onSubmit(this).then(
					(success) => { resolve(success); },
					(error) => { this.onNoSubmit(error); }
				);
			}
		});
	}

	public getSubmit(): EntityCoreControl
	{
		return this._submit;
	}

	public results(): Object 
	{
		const values: Object = {};

		[...this._entities.map].forEach((entity: any) => {
			const variable: string = entity[0];
			const control: EntityCoreControl = entity[1].object;

			if(control.drawable instanceof Drawables.Editable)
			{
				const editable: Drawables.Editable = (<Drawables.Editable>control.drawable);

				Object.defineProperty(values, variable, {value: editable.childs.editable.content});
			}

			else if(control.drawable instanceof Drawables.Texmage)
			{
				const texmage: Drawables.Texmage = (<Drawables.Texmage>control.drawable);

				if(texmage.type == 'label')
					Object.defineProperty(values, variable, {value: texmage.childs.label.content});
				else if(texmage.type == 'artwork')
					Object.defineProperty(values, variable, {value: texmage.childs.artwork.base64});
			}

			else if(control.drawable instanceof Drawables.Dropzone)
			{
				Object.defineProperty(values, variable, {value: control.files});
			}

			else if(control.drawable instanceof Drawables.Drawio)
			{
				const drawio: Drawables.Drawio = (<Drawables.Drawio>control.drawable);

				Object.defineProperty(values, variable, {value: drawio.childs.artwork.base64});
			}

			else if(control.drawable instanceof Drawables.Field)
			{
				const field: Drawables.Field = (<Drawables.Field>control.drawable);

				Object.defineProperty(values, variable, {value: field.childs.editable.content});
			}

			else if(control.drawable instanceof Drawables.Gantt)
			{
				const gantt: Drawables.Gantt = (<Drawables.Gantt>control.drawable);

				Object.defineProperty(values, variable, {value: gantt.chart});
			}

			else if(control.drawable instanceof Drawables.Mindmap)
			{
				const mindmap: Drawables.Mindmap = (<Drawables.Mindmap>control.drawable);

				Object.defineProperty(values, variable, {value: mindmap.map});
			}

			else if(control.drawable instanceof Drawables.Whiteboard)
			{
				const whiteboard: Drawables.Whiteboard = (<Drawables.Whiteboard>control.drawable);

				Object.defineProperty(values, variable, {value: whiteboard.board});
			}
		});

		return values;
	}

	public values(values: Object): Form
	{
		this._values = values;

		return this;
	}

	public value(name: string): any
	{
		return this._values[name];
	}

	private merge(...args: any) 
	{
		let destination: any = {};
		let sources: any;

		args = [].splice.call(args, 0);

		while(args.length > 0) 
		{
			sources = args.splice(0, 1)[0];
	  
			if(toString.call(sources) == '[object Object]') 
			{
				for(let property in sources) 
				{
					if(sources.hasOwnProperty(property)) 
					{
						if(toString.call(sources[property]) == '[object Object]')
							destination[property] = this.merge(destination[property] || {}, sources[property]);
						else
							destination[property] = sources[property];
					}
				}
			}
		}

		return destination;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get puzzled(): Puzzled
	{
		return this._puzzled;
	}
	public set puzzled(puzzled: Puzzled)
	{
		this._puzzled = puzzled;
	}

	public get template(): IFormUITemplate
	{
		return this._template;
	}
	public set template(template: IFormUITemplate)
	{
		this._template = template;
	}

	public get last(): EntityCoreControl
	{
		return this._last;
	}

	public get restrict(): IEditableRestrict
	{
		return {
			numeric: /^[0-9]*$/,
			alphabetic: /^[a-zA-Z]*$/,
			alphanumeric: /^[a-zA-Z0-9]*$/,
			email: /^[a-zA-Z0-9\.\_\+\-\@]*$/,
			phone: /^[0-9\(\)\-\+\#\ ]*$/,
			website: /^[A-Za-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\%\=]*$/,
			password: /^[a-zA-Z0-9\+\_\!\@\$\&\#]*$/,
			string: /^[\p{P}\p{N}\p{L} ]*$/u,
		}
	}
}

