
import * as Paperless from '@zone09.net/paperless';
import * as HaC from './lib.hac.js';
// @ts-ignore
import CodeMirror from '../../extlib/codemirror';



const colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({autosize: true});

context.attach(document.body);


