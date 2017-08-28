import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// api
import Keywords from '/imports/models/keywords';

// lib
import muiTheme from '/imports/lib/muiTheme';

const KeywordReferenceModal = React.createClass({

	propTypes: {
		visible: React.PropTypes.bool,
		top: React.PropTypes.number,
		left: React.PropTypes.number,
		keyword: React.PropTypes.string,
		close: React.PropTypes.func,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	renderKeywordHTML() {
		let html = '';
		const { keyword } = this.props;

		if (keyword && 'description' in keyword && keyword.description.length) {
			html = `${Utils.trunc(keyword.description, 120)} <a href="/keywords/${keyword.slug}">Read more</a>`;
		}

		return { __html: html };
	},

	render() {
		const self = this;
		const { keyword } = this.props;
		const styles = {
			modal: {
				top: this.props.top,
				left: this.props.left,
			},

		};

		if (!keyword) {
			return null;
		}

		return (
			<div
				className={`reference-modal${(this.props.visible) ?
					' reference-modal-visible' : ''}`}
				style={styles.modal}
			>
				<article className="comment	lemma-comment paper-shadow ">
					<div className="reference-text">
						{keyword ?
							<p
								className="lemma-text"
								dangerouslySetInnerHTML={this.renderKeywordHTML()}
							/>
						: ''}
					</div>

					<i
						className="mdi mdi-close paper-shadow"
						onClick={this.props.close}
					/>
				</article>

			</div>

		);
	},

});

const KeywordReferenceModalContainer = createContainer(({ keywordSlug }) => {
	const query = {
		slug: keywordSlug,
	};
	const handle = Meteor.subscribe('keywords.all', query);
	const keyword = Keywords.findOne(query);

	return {
		keyword,
		ready: handle.ready(),
	};
}, KeywordReferenceModal);

export default KeywordReferenceModalContainer;
