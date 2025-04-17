import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {IWhiteboard} from '../interfaces/IUI.js';
import {Whiteboard as Drawable} from '../drawables/Whiteboard.js';
import {Assets} from '../../puzzled/drawables/Assets.js';
import {Popup} from '../../popup/components/Popup.js';



export class Whiteboard extends EntityCoreControl
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

	public onIconsRefresh(self?: EntityCoreControl): void
	{
		const pointBottomLeft: Paperless.Point = new Paperless.Point(this.drawable.x + this.puzzled.spacing + 9, this.drawable.y + this.drawable.height);
		const drawable: Drawable = (<Drawable>this.drawable);

		this.attachIcon(pointBottomLeft, new Paperless.Size(22, 22), Assets.edit, () => {
			Whiteboard
				.open({
					board: drawable.board ? drawable.board : undefined,
					nopng: false,
					popup:
					{
						context: this.context,
					}
				})
				.then((data: {board: string, png: string}) => {
					if(data.png)
						drawable.childs.artwork.base64 = data.png;
					
					if(data.board)
						drawable.board = data.board;
				});
		});
	}

	public static open(attributes: IWhiteboard): Promise<{board: string, png: string}>
	{
		let {
			name = '',
			board = undefined,
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
			nopng = true,
			popup = {}
		} = attributes;

		let png: string = undefined;
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
			let iframe: HTMLElement = document.getElementById("UI_Whiteboard_IFrame");

			function postMessage(message: {}, origin: string)
			{
				if(iframe != null)
					(<HTMLIFrameElement>iframe).contentWindow.postMessage(JSON.stringify(message), origin);
			}

			if(!board || board  == undefined || board == '')
				board  = undefined;

			if(iframe)
				document.body.removeChild(iframe);

			iframe = document.createElement('iframe');
			iframe.setAttribute('src', '/thirdparty/whiteboard/index.html');
			iframe.id = 'UI_Whiteboard_IFrame';
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
						const message: any = JSON.parse(event.data);

						if(message != null)
						{
							if(message.action == 'init')
							{
								postMessage({action: 'load', name: name, board: board}, event.origin);

								if(loading)
									loading.close();
							}

							else if(message.action == 'export')
							{
								png = message.board;

								if(onSave)
								{
									onSave({board: board, png: png})
									.then(() => { postMessage({action: 'saved', status: 'saved'}, event.origin); })
									.catch((error: string) => { postMessage({action: 'saved', status: 'unsaved', error: error }, event.origin); });
								}
								else
									postMessage({action: 'saved', status: 'saved'}, event.origin);
							}

							else if(message.action == 'save')
							{
								board = message.board;

								if(nopng)
								{
									if(onSave)
									{
										onSave({board: board, png: png})
										.then(() => { postMessage({action: 'save', status: 'saved'}, event.origin); })
										.catch((error: string) => { postMessage({action: 'save', status: 'unsaved', error: error }, event.origin); });
									}
								}
								else
									postMessage({action: 'export'}, event.origin);
							}

							if(message.action == 'exit')
							{
								window.onmessage = null;
								window.document.body.removeChild(iframe);
								iframe = null;
								resolve({board: board, png: png});
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

