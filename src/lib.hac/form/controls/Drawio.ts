import * as Paperless from '@zone09.net/paperless';
import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {IDrawio} from '../interfaces/IUI.js';
import {Drawio as Drawable} from '../drawables/Drawio.js';
import {Assets} from '../../puzzled/drawables/Assets.js';
import {Popup} from '../../popup/components/Popup.js';



export class Drawio extends EntityCoreControl
{
	public constructor(attributes: IEntityCoreControlAttributes)
	{
		super(attributes);
	}

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
	
	public onIconsRefresh(): void
	{
		const pointBottomLeft: Paperless.Point = new Paperless.Point(this.drawable.x + this.puzzled.spacing + 9, this.drawable.y + this.drawable.height);
		const drawable: Drawable = (<Drawable>this.drawable);

		this.attachIcon(pointBottomLeft, new Paperless.Size(22, 22), Assets.edit, () => {
			Drawio
				.open({
					diagram: drawable.childs.artwork.base64,
					nopng: false,
					popup:
					{
						context: this.context,
					}
				})
				.then((base64) => {
					drawable.childs.artwork.base64 = base64;
				});
		});
	}

	public static open(attributes: IDrawio): Promise<string>
	{
		let {
			diagram = undefined,
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
			let iframe: HTMLElement = document.getElementById("UI_Drawio_IFrame");

			function postMessage(message: {}, origin: string)
			{
				if(iframe != null)
					(<HTMLIFrameElement>iframe).contentWindow.postMessage(JSON.stringify(message), origin);
			}

			if(!diagram || diagram == undefined || diagram == '')
				diagram = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAC0XRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMmVtYmVkLmRpYWdyYW1zLm5ldCUyMiUyMG1vZGlmaWVkJTNEJTIyMjAyMS0wMy0wNlQwMyUzQTMyJTNBMjkuNTM4WiUyMiUyMGFnZW50JTNEJTIyNS4wJTIwKFdpbmRvd3MlMjBOVCUyMDEwLjAlM0IlMjBXaW42NCUzQiUyMHg2NCklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkY4MS4wLjQwNDQuMTM4JTIwU2FmYXJpJTJGNTM3LjM2JTIyJTIwZXRhZyUzRCUyMjBzeUFEb3FLd096VTRfZl84Z1pwJTIyJTIwdmVyc2lvbiUzRCUyMjE0LjQuNCUyMiUyMHR5cGUlM0QlMjJlbWJlZCUyMiUzRSUzQ2RpYWdyYW0lMjBpZCUzRCUyMmVtWVJTRERSa0RQMllkM0VaeTNyJTIyJTIwbmFtZSUzRCUyMlBhZ2UtMSUyMiUzRWRkSEJFb0lnRUFEUXIlMkJHdU1GTjVOcXRMSnclMkJkU1RabFF0WkJITFd2VHdjWVk2b0xBMjkzMkYwZ0xHJTJCbnMlMkJGZGMwVUJpdEJFVElRZENhWFpQbG5XRldZSGg1UTZxSTBVanBJTlN2a0NoMm5RUVFyb3ZUbXlpTXJLTHNZS3RZYktSc2FOd1RGT2U2Q0txM2E4aGloamhiTGk2bHR2VXRqR1QwRjNtMTlBMWsyb25PNHlGN256NmxrYkhMU3ZwMUdEaTdROFhPTjc2QnN1Y1B3Z1ZoQ1dHMFRyZHUyVWcxcGZOWDZ4MDUlMkJvYjdtM2N4Z2k5R3BBMng4M0xKdXQySEtJJTJGcElWYnclM0QlM0QlM0MlMkZkaWFncmFtJTNFJTNDJTJGbXhmaWxlJTNFCTg1HwAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

			if(iframe)
				document.body.removeChild(iframe);

			iframe = document.createElement('iframe');
			//iframe.setAttribute('src', 'https://embed.diagrams.net/?embed=1&splash=0&proto=json&spin=0&ui=min&libraries=1&configure=1&dark=1');
			iframe.setAttribute('src', '/thirdparty/draw.io/index.html?embed=1&splash=0&proto=json&spin=0&ui=min&libraries=1&configure=1&dark=1');
			iframe.id = 'UI_Drawio_IFrame';
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
							if(message.event == 'configure')
							{
								postMessage({action: 'configure', config:
									{
										// style for shapes
										'defaultVertexStyle': {'fontColor': palette.grey3, 'fontFamily': 'Lucida Console', 'fontSize': '12', 'fillColor': palette.grey0, 'strokeColor': palette.yellow, 'strokeWidth': '1'},
										// style for connector
										'defaultEdgeStyle': {'fontFamily': 'Lucida Console', 'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '0', 'jettySize': 'auto', 'orthogonalLoop': '0', 'fillColor': palette.black, 'strokeColor': palette.yellow, 'strokeWidth': '1'},
										'customColorSchemes': [
											[
												{'fill': palette.pink, 'stroke': palette.black}, 
												{'fill': palette.blue, 'stroke': palette.black}, 
												{'fill': palette.orange, 'stroke': palette.black},
												{'fill': palette.green, 'stroke': palette.black},
												{'fill': palette.yellow, 'stroke': palette.black},
											],
											[
												{'fill': palette.grey0, 'stroke': palette.pink}, 
												{'fill': palette.grey0, 'stroke': palette.blue}, 
												{'fill': palette.grey0, 'stroke': palette.orange},
												{'fill': palette.grey0, 'stroke': palette.green},
												{'fill': palette.grey0, 'stroke': palette.yellow},
											],
											[
												{'fill': palette.black, 'stroke': palette.pink}, 
												{'fill': palette.black, 'stroke': palette.blue}, 
												{'fill': palette.black, 'stroke': palette.orange},
												{'fill': palette.black, 'stroke': palette.green},
												{'fill': palette.black, 'stroke': palette.yellow},
											]
										],
										'customPresetColors': [palette.black.slice(1), palette.grey0.slice(1), palette.grey1.slice(1), palette.grey2.slice(1), palette.grey3.slice(1), palette.pink.slice(1), palette.blue.slice(1), palette.orange.slice(1), palette.green.slice(1), palette.yellow.slice(1), 'null', 'null'],
										'css': ' \
											.geBackgroundPage { background-color: ' + palette.black + ' !important; } \
											.geEditor { background-color: transparent !important; } \
											.geSidebarContainer { background-color: ' + palette.grey0 + ' !important; } \
											.geToolbarContainer { background-color: ' + palette.grey1 + ' !important; } \
											.geLabel { border:1px solid ' + palette.grey1 + ' !important;} \
											.geDialogTitle { background-color: ' + palette.pink + ' !important; } \
											.geHint { background-color: ' + palette.black + ' !important; } \
											.geTab { background-color: ' + palette.grey1 + ' !important; } \
											.geTabItem { background-color: ' + palette.grey1 + ' !important; } \
											.geTabContainer { background-color: ' + palette.grey0 + ' !important; } \
											.geSidebar { background-color: ' + palette.grey0 + ' !important; } \
											.geTitle { background-color: ' + palette.grey1 + ' !important; } \
											.mxWindowTitle { background-color: ' + palette.pink + ' !important; } \
											.geEditor ::-webkit-scrollbar-thumb { background-color: ' + palette.blue + ' !important; border-radius: 0px !important} \
											.geDiagramContainer { background-color: ' + palette.grey0 + ' !important; } \
											.geDiagramBackdrop { background-color: ' + palette.grey0 + ' !important; } \
											.mxWindow { border:none background-color: ' + palette.black + ' !important; border-radius: 0px !important; box-shadow: none !important; } \
											.mxWindowTitle { color: ' + palette.grey0 + ' !important; } \
											.geMenubarContainer { background-color: ' + palette.grey0 + ' !important; } \
											.mxPopupMenu { color: ' + palette.grey2 + ' !important; } \
											.geDialog { background-color: ' + palette.grey0 + ' !important; border:1px solid ' + palette.pink + ' !important; } \
											.mxPopupMenu { background-color: ' + palette.grey0 + ' !important; border:1px solid ' + palette.pink + ' !important; border-radius: 0px !important } \
											.geMenubarMenu { background-color: ' + palette.grey0 + ' !important; border:none } \
											table.mxPopupMenu { border:none !important; } \
											input[type=text] { background: ' + palette.black + ' !important; border:1px solid ' + palette.grey1 + ' !important; } \
											input[type=checkbox]:checked { background: ' + palette.grey2 + ' !important; } \
											input[type=radio]:checked { background: ' + palette.grey2 + ' !important; } \
											div.mxWindow { border:1px solid ' + palette.pink + ' !important; } \
											div td.mxWindowTitle { border-top: solid 1px ' + palette.grey0 + ' !important; border-left: solid 1px ' + palette.grey0 + ' !important; border-right: solid 1px ' + palette.grey0 + ' !important; border-bottom: none !important; height: 20px; !important } \
											html body .mxWindow input[type="checkbox"] { border-radius: 0px !important; border: solid 1px ' + palette.grey2 + ' !important; -webkit-appearance: none !important; width: 12px !important; height: 12px !important; margin: 3px 6px 0px 0px !important; vertical-align: top !important; } \
											html body .mxWindow input[type="radio"] { border-radius: 50% !important; border: solid 1px ' + palette.grey2 + ' !important; -webkit-appearance: none !important; width: 12px !important; height: 12px !important; margin: 0px 6px 3px 0px !important; vertical-align: middle !important; } \
											body { -webkit-tap-highlight-color: transparent !important; } \
											tr.gePropHeader { color: ' + palette.grey2 + ' !important; } \
											td.gePropRowCell { color: ' + palette.grey2 + ' !important; } \
											.geSprite {filter: invert(60%) !important; } \
											.mxPopupMenuItem { color: ' + palette.grey3 + ' !important; } \
										',
									}
								}, event.origin);
							}

							else if(message.event == 'init')
							{
								postMessage({action: 'load', autosave: '0', noSaveBtn: '0', noExitBtn: '0', saveAndExit: '0', modified: 'unsavedChanges', xml: diagram, title: ''}, event.origin);
								
								if(loading)
									loading.close();
							}

							//else if(message.event == 'autosave')
							//	this.postMessage({action: 'export', format: 'xmlpng', xml: message.xml, spinKey: 'export'}, event.origin);

							else if(message.event == 'export')
							{
								diagram = message.data;

								if(onSave)
								{
									onSave(message.data)
									.then(() => { postMessage({action: 'status', messageKey: 'allChangesSaved', modified: false}, event.origin); })
									.catch((error: string) => { postMessage({action: 'status', modified: 'unsavedChanges'}, event.origin) });
								}
								else
									postMessage({action: 'status', messageKey: 'allChangesSaved', modified: false}, event.origin);

								// for exit button, remove this and noExitBtn
								// message.event = 'exit';
							}

							else if(message.event == 'save')
							{
								if(nopng)
								{
									if(onSave)
									{
										onSave(message.xml)
										.then(() => { postMessage({action: 'status', /*messageKey: 'allChangesSaved',*/ modified: false}, event.origin); })
										.catch((error: string) => { postMessage({action: 'status', messageKey: 'unsavedChanges', modified: true}, event.origin); });
									};
								}
								else
									postMessage({action: 'export', format: 'xmlpng', xml: message.xml, spinKey: 'export'}, event.origin);
							}

							if(message.event == 'exit')
							{
								window.onmessage = null;
								window.document.body.removeChild(iframe);
								iframe = null;	
								resolve(diagram);
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

