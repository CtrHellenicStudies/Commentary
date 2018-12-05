import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import _s from 'underscore.string';

// graphql
import keywordsQuery from '../../graphql/queries/list';


class KeywordReferenceModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.renderKeywordHTML = this.renderKeywordHTML.bind(this);
	}
	componentWillReceiveProps(props) {
		const { keywordSlug } = props;
		const keyword = props.keywordsQuery.loading ? [] : props.keywordsQuery.keywords
			.find(x => x.slug === keywordSlug);
		this.setState({
			keyword: keyword
		});
	}
	renderKeywordHTML() {
		let html = '';
		const { keyword } = this.state;

		if (keyword && 'description' in keyword && keyword.description.length) {
			html = `${_s.truncate(keyword.description, 120)} <a href="/words/${keyword.slug}">Read more</a>`;
		}

		return { __html: html };
	}

	render() {
		const { keyword } = this.state;
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
	}

}
KeywordReferenceModal.propTypes = {
	visible: PropTypes.bool,
	top: PropTypes.number,
	left: PropTypes.number,
	close: PropTypes.func,
	keywordSlug: PropTypes.string,
	keywordsQuery: PropTypes.object
};

export default compose(keywordsQuery)(KeywordReferenceModal);
