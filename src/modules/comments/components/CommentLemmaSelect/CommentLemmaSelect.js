import React from 'react';
import PropTypes from 'prop-types';

import addTextNodesHighlighting from '../../lib/addTextNodesHighlighting';


import './CommentLemmaSelect.css';



const CommentLemmaSelect = ({ selectedLemmaVersion, selectedLemmaCitation }) => {

	const _selectedLemmaVersion = addTextNodesHighlighting(selectedLemmaVersion, selectedLemmaCitation);

	return (
		<div className="comments lemma-panel-visible">
			<div className="comment-outer comment-lemma-comment-outer">
				{_selectedLemmaVersion && _selectedLemmaVersion.textNodes ?
					<article className="comment lemma-comment paper-shadow">
						{_selectedLemmaVersion.textNodes.map((textNode, i) => (
							<p
								key={i}
								className="lemma-text"
								dangerouslySetInnerHTML={{ __html: textNode.text }}
							/>
						))}
						<div className="context-tabs tabs" />
					</article>
					:
					<article className="comment lemma-comment paper-shadow">
						<p className="lemma-text no-lines-selected">No line(s) selected</p>
					</article>
				}
			</div>
		</div>
	);
}

CommentLemmaSelect.propTypes = {
	selectedLemmaCitation: PropTypes.object,
	selectedLemmaVersion: PropTypes.object,
	selectedLemmaTranslation: PropTypes.object,
};

export default CommentLemmaSelect;
