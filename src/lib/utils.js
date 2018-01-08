import $ from 'jquery';
import Parser from 'simple-text-parser';
import { convertToHTML } from 'draft-convert';
import {
	convertFromRaw, EditorState, ContentState, convertFromHTML 
} from 'draft-js';

/**
 * General application specific utility / helper functions
 */
const Utils = {
	resolveUrn(urn) {
		let ret = urn;
		try {
			if (urn.v2) {
				ret = urn.v2;
			} else {
				ret = urn.v1;
			}

		} catch (error) {
			console.log('Old urn exists in database.');
		}
		return ret;
	},
	timeSince: (date) => {
		let interval;
		const seconds = Math.floor((new Date() - date) / 1000);
		interval = Math.floor(seconds / 31536000);
		if (interval > 1) {
			return `${interval} years ago`;
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return `${interval} months ago`;
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return `${interval} days ago`;
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return `${interval} hours ago`;
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return `${interval} minutes ago`;
		}
		return 'just now';
	},
	trunc: (str, length) => {
		if (!str)			{ return ''; }
		const ending = ' ...';
		let trimLen = length;
		str = str.replace(/<(?:.|\n)*?>/gm, '');

		if (trimLen == null) {
			trimLen = 100;
		}

		if (str.length > length) {
			return str.substring(0, length - ending.length) + ending;
		}

		return str;
	},

	isMobile: () => {
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	},
	capitalize: (str) => {
		const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
		return capitalized;
	},
	defaultCmp: function defaultCmp(a, b) {
		if (a === b) return 0;
		return a < b ? -1 : 1;
	},
	getCmpFunc: (primer, reverse) => {
		const dfc = Utils.defaultCmp;
		let cmp = Utils.defaultCmp;
		if (primer) {
			cmp = (a, b) => { // eslint-disable-line
				return dfc(primer(a), primer(b));
			};
		}
		if (reverse) {
			return (a, b) => { // eslint-disable-line
				return -1 * cmp(a, b);
			};
		}
		return cmp;
	},
	userInRole(user, roles) {
		for(let i = 0; i < user.roles.length; i += 1) {
			for(let j = 0; j < roles.length; j += 1) {
				if(user.roles[i] === roles[j]) {
					return true;
				}
			}
		}
		return false;
	},
	sortBy: function sort() {
		const fields = [];
		const nFields = arguments.length;
		let field;
		let name;
		let cmp;

		// preprocess sorting options
		for (let i = 0; i < nFields; i++) {
			field = arguments[i]; // eslint-disable-line

			if (typeof field === 'string') {
				name = field;
				cmp = Utils.defaultCmp;
			} else {
				name = field.name;
				cmp = Utils.getCmpFunc(field.primer, field.reverse);
			}
			fields.push({
				name,
				cmp,
			});
		}

		// final comparison function
		return (A, B) => {
			let result;

			for (let i = 0; i < nFields; i++) {
				result = 0;
				field = fields[i];
				name = field.name;

				result = field.cmp(A[name], B[name]);
				if (result !== 0) break;
			}
			return result;
		};
	},
	setBaseDocMeta() {
		console.log(process);
		Utils.setMetaTag('name', 'url', 'content', window.location.href);
		Utils.setMetaTag('name', 'twitter:card', 'content', 'summary');
		Utils.setMetaTag('name', 'twitter:url', 'content', window.location.href);
		if (process.env.SERVICE_CONFIGURATIONS) {
			Utils.setMetaTag('property', 'fb:app_id', 'content', process.env.FACEBOOK_APP_ID);
		}
		Utils.setMetaTag('property', 'og:url', 'content', window.location.href);
		Utils.setMetaTag('property', 'og:type', 'content', 'website');
		Utils.setLinkTag('rel', 'canonical', 'href', window.location.href);
	},
	setTitle(title) {
        document.title = `${title}`;
		Utils.setMetaTag('property', 'og:title', 'content', title);
		Utils.setMetaTag('property', 'og:site_name', 'content', title);
		Utils.setMetaTag('property', 'og:local', 'content', 'en_US');
		Utils.setMetaTag('property', 'twitter:title', 'content', title);
		Utils.setMetaTag('itemprop', 'title', 'content', title);
	},
	setDescription(description) {
		Utils.setMetaTag('name', 'description', 'content', description);
		Utils.setMetaTag('property', 'og:description', 'content', description);
		Utils.setMetaTag('property', 'twitter:description', 'content', description);
		Utils.setMetaTag('itemprop', 'description', 'content', description);
	},
	setMetaImage(imageSrc = null) {
		if (imageSrc) {
			Utils.setMetaTag('property', 'og:image', 'content', imageSrc);
			Utils.setMetaTag('property', 'twitter:image', 'content', imageSrc);
			Utils.setMetaTag('itemprop', 'image', 'content', imageSrc);
		} else {
			Utils.setMetaTag('property', 'og:image', 'content', `${window.location.origin}/images/hector.jpg`);
			Utils.setMetaTag('property', 'twitter:image', 'content', `${window.location.origin}/images/hector.jpg`);
			Utils.setMetaTag('itemprop', 'image', 'content', `${window.location.origin}/images/hector.jpg`);
		}
	},
	setMetaTag(attr1, key, attr2, val) {
		const metaInfo = {};
		metaInfo[attr1] = key;
		metaInfo[attr2] = val;
		if ($(`meta[${attr1}="${key}"]`).length) {
			$(`meta[${attr1}="${key}"]`).attr(attr2, val);
		} else {
			//DocHead.addMeta(metaInfo); //TODO
		}
	},
	setLinkTag(attr1, key, attr2, val) {
		const linkInfo = {};
		linkInfo[attr1] = key;
		linkInfo[attr2] = val;
		if ($(`link[${attr1}="${key}"]`).length) {
			$(`link[${attr1}="${key}"]`).attr(attr2, val);
		} else {
			//DocHead.addLink(linkInfo); TODO
		}
	},
	replaceLast(str, find, replace) {
		const index = str.lastIndexOf(find);
		if (index >= 0) {
			return str.substring(0, index) + replace + str.substring(index + find.length);
		}
		return str.toString();
	},
	getEntityData(entity, key) {
		if (key === 'link' && !entity.data.mention) {
			return entity.data.href;
		}
		const foundItem = entity.data.mention._root.entries.find(item => (item[0] === key));
		return foundItem[1];
	},
	getEnvDomain() {
		let domain;

		if (window.location.hostname.match(/\w+.chs.harvard.edu/)) {
			domain = 'chs.harvard.edu';
		} else if (window.location.hostname.match(/\w+.chs.orphe.us/)) {
			domain = 'chs.orphe.us';
		} else if (window.location.hostname.match(/\w+.chs.local/)) {
			domain = 'chs.local';
		}

		return domain;
	},
	textFromTextNodesGroupedByEdition(textNodesCursor, _editions) {
		const editions = [];
		textNodesCursor.forEach((textNode) => {
			textNode.text.forEach((text) => {
				let myEdition = editions.find(e => text.edition === e._id);

				if (!myEdition) {
					const foundEdition = _editions.find(x => x._id === text.edition);
					myEdition = {
						_id: foundEdition._id,
						title: foundEdition.title,
						slug: foundEdition.slug,
						multiLine: foundEdition.multiLine,
						lines: [],
					};
					editions.push(myEdition);
				}

				myEdition.lines.push({
					_id: textNode._id,
					html: text.html,
					n: text.n,
				});
			});
		});

		// sort lines for each edition by line number
		for (let i = 0; i < editions.length; ++i) {
			editions[i].lines.sort((a, b) => {
				if (a.n < b.n) {
					return -1;
				} else if (b.n < a.n) {
					return 1;
				}
				return 0;
			});
		}

		return editions;
	},
	getCommenters(commenterData, commenters) {
		const commentersList = [];

		commenterData.forEach(commenter => {
			const currentCommenter = commenters.find(x => x._id === commenter.value);
			commentersList.push(currentCommenter);
		});

		return commentersList;
	},
	parseMultilineEdition(editions, multiline) {
		const parsedEditions = [];

		editions.forEach((edition, index) => {
			const joinedText = edition.lines.map(line => line.html).join(' ');

			const tag = new RegExp(`<lb id="\\d+" ed="${multiline}" />`, 'ig');

			const textArray = joinedText.split(tag);
			const parser = new Parser();

			const lineArray = [];
			parser.addRule(/id="\d+"/ig, (arg1) => {
				lineArray.push(arg1);
			});
			parser.render(joinedText);

			const numberArray = lineArray.map((line) => parseInt(line.substr(4, line.length - 2), 10));

			if (numberArray.length) {
				numberArray.unshift(numberArray[0] - 1);
			}

			const result = [];

			if (textArray.length === numberArray.length) {
				for (let i = 0; i < textArray.length; i++) {
					const currentLine = {
						html: textArray[i],
						n: numberArray[i]
					};
					result.push(currentLine);
				}
			} else {
				return new Error('Parsing error');
			}
			const currentEdition = edition;
			currentEdition.lines = result;
			parsedEditions.push(currentEdition);
		});
		return parsedEditions;
	},
	getEditorState(content) {
		let _content = content || '';
		if (this.isJson(content)) {
			_content = JSON.parse(_content);
			if (_content.raw) {
				_content = _content.raw;
			}
			const constState = convertFromRaw(_content);
			return EditorState.createWithContent(constState);
		}
		const constState = convertFromHTML(_content);
		const state = ContentState.createFromBlockArray(
			constState.contentBlocks,
			constState.entityMap
			);
		return EditorState.createWithContent(state);
	},
	getHtmlFromContext(context) {
		return convertToHTML({
						// performe necessary html transformations:
			blockToHTML: (block) => {
				const type = block.type;
				if (type === 'atomic') {
					return {start: '<span>', end: '</span>'};
				}
				if (type === 'unstyled') {
					return '<p />';
				}
				return '<span />';
			},
			entityToHTML: (entity, originalText) => {
				let ret = this.decodeHtml(originalText);
				switch (entity.type) {
				case 'LINK':
					ret = `<a href={${entity.data.link}}>{${ret}}</a>`;
					break;
				case 'mention':
					ret = `<a className="keyword-gloss" href={${this.getEntityData(entity, 'link')}}>{${ret}}</a>`;
					break;
				case '#mention':
					ret = `<a className="comment-cross-ref" href={${this.getEntityData(entity, 'link')}}>{${ret}}</a>`;
					break;
				case 'draft-js-video-plugin-video':
					ret = `<iframe width="320" height="200" src={${entity.data.src}} allowFullScreen />`;
					break;
				case 'image':
					ret = `<img src="${entity.data.src}" alt="draft js image error"/>`;
					break;
				default:
					break;
				}
				return ret;
			},
		})(context);
	},
	decodeHtml(html) {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	},
	isJson(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	},
	shouldRefetchQuery(properties, variables) {
		for (const [key] of Object.entries(properties)) {
			if (properties[key] !== variables[key]) {
				return true;
			}
		}
		return false;
	},
	getSuggestionsFromComments(comments) {
		const suggestions = [];

		// if there are comments:
		if (comments.length) {

			// loop through all comments
			// add suggestion for each comment
			comments.forEach((comment) => {

				// get the most recent revision
				const revision = comment.revisions[comment.revisions.length - 1];

				const suggestion = {
					// create suggestio name:
					name: `"${revision.title}" -`,

					// set link for suggestion
					link: `/commentary?_id=${comment._id}`,

					// set id for suggestion
					id: comment._id,
				};

				// loop through commenters and add them to suggestion name
				comment.commenters.forEach((commenter, i) => {
					if (i === 0) suggestion.name += ` ${commenter.name}`;
					else suggestion.name += `, ${commenter.name}`;
				});

				suggestions.push(suggestion);
			});
		}
		return suggestions;
	}
};

/**
 * Return information about a comment for a keyword
 * @param {Object} comment - the input comment
 * @param {number} maxLines - maximum amount of lines to limit the query to
 * @returns {Object} comment information for making keyword query
 */
export function makeKeywordContextQueryFromComment(comment, maxLines) {
	let lineTo = comment.lineFrom;
	if (comment.hasOwnProperty('lineTo')) {
		lineTo = comment.lineFrom + Math.min(
				maxLines,
				comment.lineTo - comment.lineFrom
			);
	} else if (comment.hasOwnProperty('nLines')) {
		lineTo = comment.lineFrom + Math.min(maxLines, comment.nLines);
	}

	return {
		workSlug: comment.work.slug,
		subworkN: comment.subwork.n,
		lineFrom: comment.lineFrom,
		lineTo: lineTo,
	};
}

export default Utils;
