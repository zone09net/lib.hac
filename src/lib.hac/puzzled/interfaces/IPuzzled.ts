import * as Paperless from '@zone09.net/paperless';
import {EntityCoreControl} from '../controls/EntityCoreControl.js';
import {EntityCoreDrawable} from '../drawables/EntityCoreDrawable.js';



export interface IComponentPuzzledAttributes extends Paperless.IComponentAttributes {
	hop?: number,
	expandable?: boolean,
	nostroke?: boolean,
	nofill?: boolean,
	linewidth?: number,
	spacing?: number,
	shadow?: number,
	alpha?: number,
	drawable?: typeof EntityCoreDrawable,
	control?: typeof EntityCoreControl,
	color?: {
		fill?: string,
		stroke?: string,
		marked?: string,
		move?: string,
		nomove?: string,
		sizer?: string,
		splitter?: string,
		highlight?: string,
		faked?: string,
	}
}
