import React, { Component } from 'react';
import PropTypes from 'prop-types';


/**
 * Location browser allows a user to browse through a work using arrow keys
 * For each work it should represent the document structure of that work, for
 * example, if a work's document structure (in the XML called RefsDecl) is
 * Book-Chapter, this component should allow a user to browse by Book and Chapter.
 * If a work's document structure is Book-Chapter-Section, it should allow a
 * user to browse by Book, Chapter, and Section.
 */
export default class LocationBrowser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edition: 1,
            chapter: 1
        };

        this.increaseEdition = this.increaseEdition.bind(this);
        this.increaseChapter = this.increaseChapter.bind(this);
        this.decreaseEdition = this.decreaseEdition.bind(this);
        this.decreaseChapter = this.decreaseChapter.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            edition: 1,
            chapter: 1
        });
    }
    increaseEdition() {

        const { edition, chapter } = this.state;
        this.props.updateTextLocation(
            edition + 1,
            chapter
        );
        this.setState({
            edition: edition + 1,
        });
    }
    increaseChapter() {

        const { edition, chapter } = this.state;
        this.props.updateTextLocation(
            edition,
            chapter + 1,
        );
        this.setState({
            chapter: chapter + 1
        });
    }
    decreaseEdition() {

        const { edition, chapter } = this.state;
        this.props.updateTextLocation(
            Math.max(1, edition - 1),
            chapter
        );
        this.setState({
            edition: Math.max(1, edition - 1)
        });
    }
    decreaseChapter() {

        const { edition, chapter } = this.state;
        this.props.updateTextLocation(
            edition,
            Math.max(1, chapter - 1)
        );
        this.setState({
            chapter: Math.max(1, chapter - 1)
        });
    }
    render() {
        let { chapter, edition } = this.state;
        if (!chapter) {
            chapter = 1;
        }
        if (!edition) {
            edition = 1;
        }
        return (
            <div className="book-and-chapter-container">
                <button onClick={this.decreaseEdition} className="book-and-chapter-button">
                    <i className="fas fa-angle-double-left"></i>
                </button>
                <button onClick={this.decreaseChapter} className="book-and-chapter-button">
                    <i className="fas fa-angle-left"></i>
                </button>
                <span className="book-and-chapter-text"> Book { edition }, Chapter { chapter }</span>
                <button onClick={this.increaseChapter} className="book-and-chapter-button">
                    <i className="fas fa-angle-right"></i>
                </button>
                <button onClick={this.increaseEdition} className="book-and-chapter-button">
                    <i className="fas fa-angle-double-right"></i>
                </button>
            </div>

        );
    }
}

LocationBrowser.propTypes = {
    maxChapter: PropTypes.number,
    maxEdition: PropTypes.number,
    updateTextLocation: PropTypes.func,
};
