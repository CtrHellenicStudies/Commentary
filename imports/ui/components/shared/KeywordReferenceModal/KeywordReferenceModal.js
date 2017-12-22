import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Draggable from 'react-draggable';
import { compose } from 'react-apollo';

// graphql
import { keywordsQuery } from '/imports/graphql/methods/keywords';

// lib
import muiTheme from '/imports/lib/muiTheme';

class KeywordReferenceModal extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.renderKeywordHTML = this.renderKeywordHTML.bind(this);

		this.props.keywordsQuery.refetch({
			tenantId: sessionStorage.getItem('tenantId')
		});
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			keyword: nextProps.keywordsQuery.loading ? [] : nextProps.keywordsQuery.keywords,
			ready: !nextProps.keywordsQuery.loading,
		});
	}
	renderKeywordHTML() {
		let html = '';
		const keyword = this.data.keyword;

		if ('description' in keyword && keyword.description.length) {
			html = `${Utils.trunc(keyword.description, 120)} <a href="/tags/${keyword.slug}">Read more</a>`;
		}

		return { __html: html };
	}

	render() {
		const self = this;
		const { keyword } = this.state;
		const styles = {
			modal: {
				top: this.props.top,
				left: this.props.left,
			},

		};

		return (
			<Draggable>
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
			</Draggable>
		);
	}

}

KeywordReferenceModal.propTypes = {
	visible: PropTypes.bool,
	top: PropTypes.number,
	left: PropTypes.number,
	close: PropTypes.func,
	keywordsQuery: PropTypes.object
};

export default compose(keywordsQuery)(KeywordReferenceModal);
