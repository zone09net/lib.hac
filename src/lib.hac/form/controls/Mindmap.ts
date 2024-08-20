import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {IMindmap} from '../interfaces/IUI.js';
import {Mindmap as Drawable} from '../drawables/Mindmap.js';
import {Assets} from '../../puzzled/drawables/Assets.js';
import {Popup} from '../../popup/components/Popup.js';



export class Mindmap extends EntityCoreControl
{
	public constructor(attributes: IEntityCoreControlAttributes)
	{
		const {
			movable = true,
			focusable = false,
			swappable = true,
			splittable = true,
			shrinkable = true,
			expandable = true,
			stackable = false,
		} = attributes;

		super({
			...attributes,
			...{
				movable: movable,
				focusable: focusable,
				swappable: swappable,
				splittable: splittable,
				shrinkable: shrinkable,
				expandable: expandable,
				stackable: stackable,
			}
		});
	}

	/*
	public onSplitted(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onExpanded(): void 
	{
		(<Drawable>this.drawable).update();
	}

	public onShrinked(): void 
	{
		(<Drawable>this.drawable).update();
	}
	*/

	public onIconsRefresh(): void
	{
		const pointBottomLeft: Paperless.Point = new Paperless.Point(this.drawable.x + this.puzzled.spacing + 9, this.drawable.y + this.drawable.height);
		const drawable: Drawable = (<Drawable>this.drawable);

		this.attachIcon(pointBottomLeft, new Paperless.Size(22, 22), Assets.edit, () => {
			Mindmap
				.open({
					map: drawable.map ? drawable.map : undefined,
					popup:
					{
						context: this.context,
					}
				})
				.then((map) => {
					drawable.map = map;

					// svg to canvas to put in puzzled form?
				});
		});
	}

	public static open(attributes: IMindmap): Promise<string>
	{
		let {
			name = '',
			map = undefined,
			palette = {
				black: '#000000',
				grey0: '#151515',
				grey1: '#1a1a1a',
				grey2: '#666666',
				grey3: '#a0a0a0',
				pink: '#815556',
				blue: '#436665',
				orange: '#9a6c27',
				green: '#769050',
				yellow: '#c8af55'
			},
			onSave = undefined,
			popup = {}
		} = attributes;

		let loading: Popup;

		if(popup.context)
		{
			loading = new Popup({
				...{
					dark: {
						fillcolor: palette.grey0,
					},
					title: { 
						content: 'loading...',
						fillcolor: palette.pink,
						font: '20px CPMono-v07-Bold',
					},
					width: 100
				},
				...popup,
				...{
					noclick: true,
					autoopen: true,
				}
			});
		}

		return new Promise((resolve, reject) => {
			let iframe: HTMLElement = document.getElementById("UI_Mindmap_IFrame");

			function postMessage(message: {}, origin: string)
			{
				if(iframe != null)
					(<HTMLIFrameElement>iframe).contentWindow.postMessage(JSON.stringify(message), origin);
			}

			if(!map || map  == undefined || map == '')
				map  = '{"id":"root","formatVersion":3,"title":"root","attr":{},"ideas":{"1":{"id":1,"title":"..."}}}';

			if(iframe)
				document.body.removeChild(iframe);

			iframe = document.createElement('iframe');
			iframe.setAttribute('src', '/thirdparty/mindmap/index.html');
			iframe.id = 'UI_Mindmap_IFrame';
			iframe.style.cssText = `
				z-index: 9999; 
				top: 0px; 
				left: 0px; 
				position: absolute; 
				width: calc(100%); 
				height: calc(100%); 
				border: 0px;
			`;

			document.body.appendChild(iframe);

			window.onmessage = (event) => {
				if(iframe != null && event.source == (<HTMLIFrameElement>iframe).contentWindow && event.data.length > 0)
				{
					try
					{
						let message: any = JSON.parse(event.data);

						if(message != null)
						{
							if(message.action == 'init')
							{
								postMessage({action: 'load', name: name, map: map}, event.origin);

								if(loading)
									loading.close();
							}

							else if(message.action == 'save')
							{
								map = JSON.stringify(message.map);

								if(onSave)
								{
									onSave(map)
									.then(() => { postMessage({action: 'saved'}, event.origin); })
									.catch((error: string) => { postMessage({action: 'unsaved', error: error }, event.origin); });
								}
								else
									postMessage({action: 'saved'}, event.origin);
							}

							if(message.action == 'exit')
							{
								window.onmessage = null;
								window.document.body.removeChild(iframe);
								iframe = null;
								resolve(map);
							}
						}
					}
					catch(error)
					{
						console.error(error);
					}
				}
			}
		});
	}
}

