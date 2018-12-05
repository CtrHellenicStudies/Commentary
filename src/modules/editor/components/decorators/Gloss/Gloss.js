import React from 'react';
import autoBind from 'react-autobind';
import { CompositeDecorator } from 'draft-js';


class Gloss extends React.Component {

	constructor(props) {
		super(props);

		this.isHover = false;
		this.state = {
			shown: false,
		};

		autoBind(this);
	}

	showPopGlossOver(e) {
		this.setState({
			shown: true,
		});

		if (!this.data.showPopGlossOver) {
			return false;
		}

		return this.data.showPopGlossOver(this.refs.gloss);
	}

	hidePopGlossOver(e) {
		this.setState({
			shown: false,
		});

		if (!this.data.hidePopGlossOver) {
			return false;
		}

		return this.data.hidePopGlossOver();
	}

	render() {
		this.data = this.props.contentState.getEntity(this.props.entityKey).getData();

		return (
			<span
				ref="gloss"
				className={`gloss ${this.state.shown ? '--gloss-shown' : ''}`}
				onMouseOver={ this.showPopGlossOver }
				onMouseOut={ this.hidePopGlossOver }
			>
				<span className="glossText">
					{this.data.glossText}
				</span>
				<abbr>
					{ this.props.children }
				</abbr>
			</span>
		)
	}
}


const findGlossEntities = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();

			return (
				entityKey !== null &&
				contentState.getEntity(entityKey).getType() === 'GLOSS'
			);
		},
		callback,
	);
}

const glossDecorator = new CompositeDecorator([{
	strategy: findGlossEntities,
	component: Gloss,
}]);

export default glossDecorator;
export { Gloss, findGlossEntities };
