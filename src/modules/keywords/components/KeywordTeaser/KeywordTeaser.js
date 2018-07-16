import React from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// lib
import muiTheme from '../../../../lib/muiTheme';
import Utils from '../../../../lib/utils';


class KeywordTeaser extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.toggleOpen = this.toggleOpen.bind(this);
	}

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	}

	toggleOpen() {
		this.setState({
			open: !this.state.open,
		});
	}

	render() {
		const { keyword } = this.props;
		const keywordUrl = `/tags/${keyword.slug}`;
		let keywordClass = 'keyword-teaser clearfix wow fadeInUp ';
		if (this.state.open) {
			keywordClass += 'keyword-open';
		}


		return (<div
			className={keywordClass}
			data-wow-duration="0.2s"
			onClick={this.toggleOpen}
		>
			<h4 className="keyword-title">
				{keyword.title}
			</h4>
			<i className="mdi mdi-plus" />
			<i className="mdi mdi-minus" />
			<span className="keyword-comment-count">({keyword.count} Comments)</span>
			<hr />
			<span
				className="keyword-description"
			> { keyword.description ?
					Utils.trunc(keyword.description, 300)
					: 'No description available.'
				} </span>
			<a
				className="keyword-read-more"
				href={keywordUrl}
			>
				Read more
			</a>
		</div>);
	}

}


KeywordTeaser.propTypes = {
	keyword: PropTypes.object.isRequired,
};

KeywordTeaser.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

export default KeywordTeaser;
