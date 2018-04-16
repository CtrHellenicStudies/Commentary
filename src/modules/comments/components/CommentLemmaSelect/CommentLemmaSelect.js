import React from 'react';
import PropTypes from 'prop-types';


import './CommentLemmaSelect.css';



const CommentLemmaSelect = ({ selectedLemmaVersion, selectedLemmaCitation }) => {

	console.log(selectedLemmaCitation)

	if (selectedLemmaVersion.textNodes.length > 1) {
		selectedLemmaVersion.textNodes[0].text = `
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[0].text.slice(0, selectedLemmaCitation.subreferenceIndexFrom)}
			</span>
			<span class="lemmaTextSelected">
				${selectedLemmaVersion.textNodes[0].text.slice(selectedLemmaCitation.subreferenceIndexFrom, selectedLemmaVersion.textNodes[0].text.length)}
			</span>
		`;

		selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text = `
			<span class="lemmaTextSelected">
				${selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text.slice(0, selectedLemmaCitation.subreferenceIndexTo)}
			</span>
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text.slice(selectedLemmaCitation.subreferenceIndexTo, selectedLemmaVersion.textNodes[selectedLemmaVersion.textNodes.length - 1].text.length)}
			</span>
		`;
	} else {
		selectedLemmaVersion.textNodes[0].text = `
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[0].text.slice(0, selectedLemmaCitation.subreferenceIndexFrom)}
			</span>
			<span class="lemmaTextSelected">
				${selectedLemmaVersion.textNodes[0].text.slice(selectedLemmaCitation.subreferenceIndexFrom, selectedLemmaCitation.subreferenceIndexTo)}
			</span>
			<span class="lemmaTextUnselected">
				${selectedLemmaVersion.textNodes[0].text.slice(selectedLemmaCitation.subreferenceIndexTo, selectedLemmaVersion.textNodes[0].text.length)}
			</span>
		`;
	}

	return (
		<div className="comments lemma-panel-visible">
			<div className="comment-outer comment-lemma-comment-outer">
				{selectedLemmaVersion && selectedLemmaVersion.textNodes ?
					<article className="comment lemma-comment paper-shadow">
						{selectedLemmaVersion.textNodes.map((textNode, i) => (
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
