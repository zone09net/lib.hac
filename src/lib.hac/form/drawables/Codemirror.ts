import * as Paperless from '@zone09.net/paperless';
import {EntityCoreDrawable} from '../../puzzled/drawables/EntityCoreDrawable.js';
import {IDrawableUICodemirrorAttributes} from '../interfaces/IUI.js';
import {Editable} from '../../editable/components/Editable.js';
import {Cursor} from '../../editable/drawables/Cursor.js';
// @ts-ignore
import CodeMirror from '@extlib/codemirror';



export class Codemirror extends EntityCoreDrawable
{
	private _attributes: IDrawableUICodemirrorAttributes;
	private _editable: Editable;
	private _cursor: Cursor;
	private _canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
	private _context2D: OffscreenCanvasRenderingContext2D = this._canvas.getContext('2d', {alpha: false});
	private _fragment: DocumentFragment = document.createDocumentFragment();
	private _textarea: HTMLTextAreaElement = document.createElement('textarea');
	private _codemirror: CodeMirror;
	private _highlights: any = {
      'common': {
         'default': {font: '14px Arial', color: '#818181'},

         'variable': {font: '14px Arial', color: '#aaaaaa'},
         'variable-2': {font: '14px Arial', color: '#bc5f68'},
         'variable-3': {font: '14px Arial', color: '#aaaaaa'},
         'string': {font: '14px Arial', color: '#7b9d68'},
         'string-2': {font: '14px Arial', color: '#6A8759'},
         'keyword': {font: '14px Arial', color: '#9661a9'},
         'operator': {font: '14px Arial', color: '#9661a9'},
         'number': {font: '14px Arial', color: '#957254'},
         'comment': {font: '14px Arial', color: '#8c6325'},
         'def': {font: '14px Arial', color: '#c0a36c'},
         'builtin': {font: '14px Arial', color: '#6699CC'},
         'meta': {font: '14px Arial', color: '#BF4339'},
         'atom': {font: '14px Arial', color: '#957254'},
         'tag': {font: '14px Arial', color: '#387D41'},
         'bracket': {font: '14px Arial', color: '#3870a8'},
         'attribute': {font: '14px Arial', color: '#548f5b'},
         'property': {font: '14px Arial', color: '#aaaaaa'},
         'type': {font: 'bold 14px Arial', color: '#AABBCC'},
         'link': {font: '14px Arial', color: '#CC7832'},
         'error': {font: '14px Arial', color: '#BC3F3C'},
         'qualifier': {font: '14px Arial', color: '#6b4f37'},
         'special': {font: '14px Arial', color: '#FF9E59'},
      },
      'javascript': {
         'javascriptvariable': {font: '14px Arial', color: '#aaaaaa'},
         'javascriptproperty': {font: '14px Arial', color: '#bc5f68'},
         'javascriptmethod': {font: '14px Arial', color: '#6699CC'},
      },
		'typescript': {
         'javascriptvariable': {font: '14px Arial', color: '#aaaaaa'},
         'javascriptproperty': {font: '14px Arial', color: '#bc5f68'},
         'javascriptmethod': {font: '14px Arial', color: '#6699CC'},
      },
		'mssql': {
         'sqlkeyword': {font: '14px Arial', color: '#3870a8'},
         'sqloperator': {font: '14px Arial', color: '#3870a8'},
         'sqlatom': {font: '14px Arial', color: '#818181'},
         'sqlvariable-2': {font: '14px Arial', color: '#818181'},
         'sqlstring': {font: '14px Arial', color: '#994141'},
         'sqlcomment': {font: '14px Arial', color: '#548f5b'},
			'method': {font: '14px Arial', color: '#A851C2'},
      },
		'mysql': {
         'sqlkeyword': {font: '14px Arial', color: '#3870a8'},
         'sqloperator': {font: '14px Arial', color: '#3870a8'},
         'sqlatom': {font: '14px Arial', color: '#818181'},
         'sqlvariable-2': {font: '14px Arial', color: '#818181'},
         'sqlstring': {font: '14px Arial', color: '#994141'},
         'sqlcomment': {font: '14px Arial', color: '#548f5b'},
      },
		'xml': {
         'xmlstring': {font: '14px Arial', color: '#994141'},
			'tag bracket': {font: '14px Arial', color: '#706d34'},
		},
		'css': {
         'cssproperty': {font: '14px Arial', color: '#aaaaaa'},
			'cssatom': {font: '14px Arial', color: '#aaaaaa'},
			'variable-3': {font: '14px Arial', color: '#BE645E'},
		},
		'html': {
			'xmlstring': {font: '14px Arial', color: '#994141'},
			'tag bracket': {font: '14px Arial', color: '#706d34'},
		},
		'php': {
         'phpproperty': {font: '14px Arial', color: '#6699CC'},
		},
		'html css php javascript': {
			'xmlstring': {font: '14px Arial', color: '#994141'},
			'tag bracket': {font: '14px Arial', color: '#706d34'},
			'phpproperty': {font: '14px Arial', color: '#6699CC'},
			'javascriptvariable': {font: '14px Arial', color: '#aaaaaa'},
         'javascriptproperty': {font: '14px Arial', color: '#bc5f68'},
         'javascriptmethod': {font: '14px Arial', color: '#6699CC'},
		},
		'c#': {
		},
		'java': {
		},
   };

	// dummy for the editable
	private _label: any;
	//---

	public constructor(attributes: IDrawableUICodemirrorAttributes = {})
	{
		super(attributes);

		const {
			content = '',
			firstline = 0,
			maxchar = 0,
			maxline = 0,
			tabsize = 4,
			language = 'typescript',
			label = {},
			cursor = {},
		} = attributes;

		this._attributes = {
			content: content,
			firstline: firstline,
			maxchar: maxchar,
			maxline: maxline,
			tabsize: tabsize,
			language: language,
			label: {
				...{
					spacing: 3,
					font: '12px CPMono-v07-Light',
					fillcolor: '#999999',
					fillbackground: '#ffffff'
				},
				...label
			},
			cursor: {
				//...{ width: 2, blink: true, fillcolor: '#ddbb44' }, 
				...cursor, 
				...{ sticky: this.sticky} 
			}
		};
		
      this._fragment.appendChild(this._textarea);
	  
      this._context2D.font = this._attributes.label.font;
      this._context2D.fillStyle = this._attributes.label.fillcolor;
      this._context2D.textAlign = 'left';
      this._context2D.textBaseline = 'top';
      
		// dummy label for editable
		this._label = {
			content: content,
			tabsize: tabsize,
			multiline: true,
			font: this._attributes.label.font,
			padding: { top: 0, right: 0, bottom: 0, left: 0 },
			//padding: { top: this.puzzled.spacing, right: 0, bottom: 0, left: this.puzzled.spacing },
			spacing: this._attributes.label.spacing,
			offset1: this.puzzled.point,
			offset2: { x: 0, y: 0 },
			//offset2: { x: this._attributes.padding, y: this._attributes.padding },
			matrix: this.matrix,
			context: { context2D: this._context2D },
			generate: this.redraw,
			code: this,
			contentAs: {
				splitted: []
			}
		}

      this._codemirror = CodeMirror.fromTextArea(this._textarea, {
         tabSize: tabsize,
         mode: 'text/' + language,
      });

		this._editable = new Editable({
			point: {x: this.x, y: this.y},
			size: {width: this.width - this.puzzled.spacing, height: this.height - this.puzzled.spacing},
			maxchar: this._attributes.maxchar,
			customlabel: this._label,
			customgenerate: false
		});

		this._cursor = new Cursor({
			...this._attributes.cursor,
			...{
				point: {x: this.x, y: this.y},
				size: {width: this._context2D.measureText('O').width, height: this._context2D.measureText('[j').actualBoundingBoxDescent + this._context2D.measureText('[j').actualBoundingBoxAscent + 2}
			}
		});

		this.context.enroll(this._editable);

		//this._editable.attachLabel(this._label);
		this._editable.attachBackground(this);
		this._editable.attachCursor(this._cursor);
		this._editable.initialize();

		this._editable.childs.label.offset1 = this.puzzled.point;
		this._editable.childs.label.offset2.x = this.puzzled.spacing;
		this._editable.childs.label.offset2.y = this.puzzled.spacing;
		this._editable.childs.cursor.offset1 = this.puzzled.point;
		this._editable.childs.cursor.offset2.x = this.puzzled.spacing;
		this._editable.childs.cursor.offset2.y = this.puzzled.spacing;
		this._editable.sticky = this.sticky;
		
		this.update();
	}

	public update(): void
	{
		this._canvas = new OffscreenCanvas(this.width - this.puzzled.spacing, this.height - this.puzzled.spacing);
		this._context2D = this._canvas.getContext('2d', {alpha: false});
		this._context2D.font = this._attributes.label.font;
      this._context2D.fillStyle = this._attributes.label.fillcolor;
      this._context2D.textAlign = 'left';
      this._context2D.textBaseline = 'top';

		this._editable.width = this.width - this.puzzled.spacing;
		this._editable.height = this.height - this.puzzled.spacing;

		this._editable.childs.label.width = this.width - this.puzzled.spacing;
		this._editable.childs.label.height = this.height - this.puzzled.spacing;
		this._editable.childs.label.offset1 = this.puzzled.point;
		this._editable.childs.label.offset2.x = this.puzzled.spacing;
		this._editable.childs.label.offset2.y = this.puzzled.spacing;

		this._editable.update(true);
	}

	public onDetach(): void
	{
		this._textarea.remove();
		this._fragment = null;
		this._editable.onDetach();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.drawImage(
			this._canvas, 0, 0, this._canvas.width, this._canvas.height, 
			this.x + this.offset1.x + this._label.padding.left + this.puzzled.spacing, 
			this.y + this.offset1.y + this._label.padding.top + this.puzzled.spacing, 
			this._canvas.width, this._canvas.height	
		);
	}

	public redraw(): void
   {
      let x: number = 0;
      let y: number = 2;
		let dummy: any = <any>this;
		let _this: any = (<any>this).code;
		let maxline: number = ((_this.height - _this._label.padding.top - _this._label.padding.bottom) / (_this._cursor.height - 2 + dummy.spacing)) - 1;
		//let maxchar: number = (_this.width - (_this._attributes.padding * 2)) / (_this._context2D.measureText('X').actualBoundingBoxDescent + _this._context2D.measureText('X').actualBoundingBoxAscent);

		dummy.contentAs.splitted = [];
		_this._codemirror.setValue(dummy.content);

		_this._context2D.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
      _this._codemirror.eachLine(_this._attributes.firstline, maxline, (line: any) => { 
         let tokens: Array<any> = _this._codemirror.getLineTokens(line.lineNo());

         for(let token of tokens)
         {
				//console.log(token)
				if(_this._highlights[_this._attributes.language])
				{
					if(!_this._highlights[_this._attributes.language][token.type])
					{
						if(!_this._highlights['common'][token.type])
						{
							// context2D.font = _this._highlights['common'].default.font;
							_this._context2D.fillStyle = _this._highlights['common'].default.color;
						}
						else
						{
							// context2D.font = _this._highlights['common'][token.type].font;
							_this._context2D.fillStyle = _this._highlights['common'][token.type].color;
						}
					}
					else
					{
					// context2D.font = _this._highlights['javascript'][token.type].font;
					_this._context2D.fillStyle = _this._highlights[_this._attributes.language][token.type].color;
					}
				}

            _this._context2D.fillText(token.string, x, y);

            x += _this._context2D.measureText(token.string).width;
         }

			dummy.contentAs.splitted[line.lineNo()] = line.text;

         x = 0;
         y += _this._cursor.height - 2 + dummy.spacing;
      });
   }



	// Accessors
	// --------------------------------------------------------------------------

	public get childs(): {editable: Editable} 
	{
		return {editable: this._editable};
	}
}
