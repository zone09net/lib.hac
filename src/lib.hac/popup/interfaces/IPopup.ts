import * as Paperless from '@zone09.net/paperless';



export interface IComponentPopopAttributes extends Paperless.IComponentAttributes
{
	topic?: string,
	topicColor?: string,
	topicFont?: string,
	subtopic?: string,
	subtopicColor?: string,
	subtopicFont?: string,
	detail?: string,
	detailColor?: string,
	detailFont?: string,
	detailWidth?: number,
	noClick?: boolean
}
