import {IEntityCoreControlAttributes} from '../../puzzled/interfaces/IPuzzled.js';
import {EntityCoreControl} from '../../puzzled/controls/EntityCoreControl.js';
import {IDropzoneFile} from '../interfaces/IUI.js';
import {Dropzone as Drawable} from '../drawables/Dropzone.js';



export class Dropzone extends EntityCoreControl
{
	private _eventDrop: any = null;
	private _eventDragover: any = null;
	private _dragging: boolean = false;
	private _callback: (name: string, type: string, size: number, blob: any) => void;
	private _inside: boolean = false;
	private _files: IDropzoneFile[] = [];
	//---

	public constructor(attributes: IEntityCoreControlAttributes, callback: (name: string, type: string, size: number, blob: any) => void = null)
	{
		super(attributes);

		this.focusable = false;

		this._callback = callback;
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

	public onAttach(): void
	{
		this._eventDrop = this.handleDrop.bind(null, this);
		this._eventDragover = this.handleDragover.bind(null, this);
		this.context.canvas.addEventListener("drop", this._eventDrop, false);
		this.context.canvas.addEventListener("dragover", this._eventDragover, false);
	}

	public onDetach(): void
	{
		this.context.canvas.removeEventListener("drop", this._eventDrop, {});
		this.context.canvas.removeEventListener("dragover", this._eventDragover, {});
	}

	handleDragover(dropzone: Dropzone, event: HTMLElementEventMap['dragover']): void
	{
		event.preventDefault();

		dropzone._dragging = true;
	}

	handleDrop(dropzone: Dropzone, event: HTMLElementEventMap['drop']): void
	{
		event.preventDefault();
		
		dropzone._dragging = false;
		dropzone.drawable.shadow = 0;
		dropzone.context.refresh();

		if(dropzone._inside && event.dataTransfer.items)
		{
			dropzone._files = [];

			[...event.dataTransfer.items].forEach((item: DataTransferItem) => {
      		if(item.kind === 'file') 
				{
					const file: File = item.getAsFile();
					const reader: FileReader = new FileReader();
  					
					reader.onload = (event) => {
						const dropped: IDropzoneFile = {
							name: file.name,
							type: file.type,
							size: file.size,
							modified: file.lastModified,
							data: new Uint8Array(<ArrayBuffer>reader.result)
						}

						dropzone._files.push(dropped);
						dropzone.onFile(dropped);

						/*
						const uint8 = new Uint8Array(<ArrayBuffer>reader.result);
						const length: number = uint8.length;
						let binary: string = '';

						for (let i = 0; i < length; i++)
							binary += String.fromCharCode(uint8[i]);

						console.log(window.btoa(binary));
						*/
  					};

  					reader.readAsArrayBuffer(file);
				}
    		});
  		}
	}

	public onInside(): void
	{
		this._inside = true;

		if(this._dragging)
			this.drawable.shadow = this.puzzled.shadow;
	}

	public onOutside(): void
	{
		this._inside = false;
		this.drawable.shadow = 0;
		this._dragging = false;
	}

	public onIconsDefault(): void {}
	public onIconsRefresh(): void {}
	public onLeftClick(): void {}
	public onFile(dropped: IDropzoneFile): void {}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get files(): IDropzoneFile[]
	{
		return this._files;
	}
}

