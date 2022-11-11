import * as Paperless from '@zone09.net/paperless';
import {IComponentPopopAttributes} from '../interfaces/IPopup.js';



export class Popup extends Paperless.Component
{
	private _attributes: IComponentPopopAttributes;
	private _dark: Paperless.Drawables.Rectangle;
	private _topic: Paperless.Drawables.Label;
	private _subtopic: Paperless.Drawables.Label;
	private _detail: Paperless.Drawables.Label;
	private _control: Paperless.Controls.Button;
	//---

	public constructor(attributes: IComponentPopopAttributes = {})
	{
		super(new Paperless.Point(0, 0), new Paperless.Size(0, 0), attributes);

		const {
			topic = '',
			topicColor = '#b83b3b',
			topicFont = '30px system-ui',
			subtopic = '',
			subtopicColor = '#666666',
			subtopicFont = '30px system-ui',
			detail = '',
			detailColor = '#666666',
			detailFont = '16px system-ui',
			detailWidth = 300,
			noClick = false
		} = attributes;

		this._attributes = {
			topic: topic,
			topicColor: topicColor,
			topicFont: topicFont,
			subtopic: subtopic,
			subtopicColor: subtopicColor,
			subtopicFont: subtopicFont,
			detail: detail,
			detailColor: detailColor,
			detailFont: detailFont,
			detailWidth: detailWidth,
			noClick: noClick
		};
	}

	public onAttach(): void
	{
		this.size = this.context.size;
		this.point = new Paperless.Point(this.size.width / 2, this.size.height / 2);

		this._dark = new Paperless.Drawables.Rectangle(this.point, this.size, {fillcolor: '#000000', nostroke: true, alpha: 0.95});
		this._topic = new Paperless.Drawables.Label(new Paperless.Point(this.point.x, this.point.y), new Paperless.Size(1, 1), {content: this._attributes.topic, font: this._attributes.topicFont, autosize: true, multiline: false, corner: true, fillcolor: this._attributes.topicColor});
		this._subtopic = new Paperless.Drawables.Label(new Paperless.Point(this.point.x, this.point.y), new Paperless.Size(1, 1), {content: this._attributes.subtopic,font: this._attributes.subtopicFont, autosize: true, multiline: false, corner: true, fillcolor: this._attributes.subtopicColor});
		this._detail = new Paperless.Drawables.Label(new Paperless.Point(this.point.x, this.point.y), new Paperless.Size(1, 1), {content: this._attributes.detail,font: this._attributes.detailFont, autosize: true, multiline: true, wrapping: true, corner: true, fillcolor: this._attributes.detailColor});
		this._control = new Paperless.Controls.Button((resolve) => {
			this.context.detach([
				this._topic.guid,
				this._subtopic.guid,
				this._detail.guid,
				this._dark.guid,
				this._control.guid
			]);

			resolve(null);
		}, null, null, null, {movable: false});
	}

	private generate(): number
	{
		let width: number = this._topic.size.width + this._subtopic.size.width;
		let height: number = 0;

		if(!this._attributes.topic && !this._attributes.subtopic)
			width = this._attributes.detailWidth;
		
		this._topic.point.x = this.point.x - (width / 2);
		this._topic.point.y = this.point.y - this._topic.size.height / 2;
		this._subtopic.point.x = this.point.x + ((width / 2) - this._subtopic.size.width);
		this._subtopic.point.y = this.point.y - (this._subtopic.size.height / 2);
		this._detail.point.x = this.point.x - (width / 2);
		this._detail.size.width = width;
		this._detail.generate();
		this._detail.point.y = this.point.y - this._detail.size.height / 2;

		let top = Math.max(this._topic.size.height, this._subtopic.size.height) + 20;

		if((this._attributes.topic || this._attributes.subtopic) && this._attributes.detail)
		{
			height = top + this._detail.size.height;
			this._detail.alpha = 0;
			this._detail.point.y = this.point.y + ((height / 2) - this._detail.size.height);
		}
		else
			height = top;

		return height;
	}

	public show(): Promise<unknown>
	{
		this.context.attach(this._dark);
		this.context.attach(this._topic);
		this.context.attach(this._subtopic);
		this.context.attach(this._detail);
		this.context.attach(this._control);
		this._control.attach(this._dark);
		this._control.enabled = false;

		let height = this.generate();

		return new Promise((resolve, reject) => {
			let fx: Paperless.Fx = new Paperless.Fx();

			this._control.smugglerLeftClick = resolve;
			
			if((this._attributes.topic || this._attributes.subtopic) && this._attributes.detail)
			{
				fx.add({
					duration: 400,
					drawable: this._topic,
					effect: fx.move,
					smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: 270, distance: this._topic.point.y - (this.point.y - (height / 2)) },
					complete: () => {
						fx.add({
							duration: 400,
							drawable: this._detail,
							effect: fx.fadeIn,
							smuggler: { ease: Paperless.Fx.easeInOutExpo },
							complete: () => {
								if(!this._attributes.noClick)
									this._control.enabled = true;
							}
						});
					}
				});
				fx.add({
					duration: 400,
					drawable: this._subtopic,
					effect: fx.move,
					smuggler: { ease: Paperless.Fx.easeInOutExpo, angle: 270, distance: this._subtopic.point.y - (this.point.y - (height / 2)) },
				});
			}
			else
			{
				if(!this._attributes.noClick)
					this._control.enabled = true;
			}
		});
	}

	public update(attributes: IComponentPopopAttributes = {})
	{
		const {
			topic = this._attributes.topic,
			topicColor = this._attributes.topicColor,
			topicFont = this._attributes.topicFont,
			subtopic = this._attributes.subtopic,
			subtopicColor = this._attributes.subtopicColor,
			subtopicFont = this._attributes.subtopicFont,
			detail = this._attributes.detail,
			detailColor = this._attributes.detailColor,
			detailFont = this._attributes.detailFont,
			detailWidth = this._attributes.detailWidth
		} = attributes;

		this._attributes = {
			topic: topic,
			topicColor: topicColor,
			topicFont: topicFont,
			subtopic: subtopic,
			subtopicColor: subtopicColor,
			subtopicFont: subtopicFont,
			detail: detail,
			detailColor: detailColor,
			detailFont: detailFont,
			detailWidth: detailWidth
		};

		this._topic.content = topic;
		this._topic.fillcolor = topicColor;
		this._topic.font = topicFont;
		this._topic.generate();

		this._subtopic.content = subtopic;
		this._subtopic.fillcolor = subtopicColor;
		this._subtopic.font = subtopicFont;
		this._subtopic.generate();

		this._detail.content = detail;
		this._detail.fillcolor = detailColor;
		this._detail.font = detailFont;
		this._detail.size.width = detailWidth;
		this._detail.generate();
	}

	public clear()
	{
		this._control.callbackLeftClick(this._control.smugglerLeftClick);
	}



	// getter|setter
	// --------------------------------------------------------------------------

}