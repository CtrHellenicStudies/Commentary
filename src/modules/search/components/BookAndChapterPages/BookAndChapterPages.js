import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BookAndChapterPager extends Component {

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
        
    }
    increaseEdition() {

        const { edition, chapter } = this.state;
        this.props.updateTextInformations(
            edition + 1,
            chapter
        );
        this.setState({
            edition: edition + 1,
        });
    }
    increaseChapter() {

        const { edition, chapter } = this.state;
        this.props.updateTextInformations(
            edition,
            chapter + 1,
        );
        this.setState({
            chapter: chapter + 1
        });
    }
    decreaseEdition() {

        const { edition, chapter } = this.state;
        this.props.updateTextInformations(
            Math.max(1, edition - 1),
            chapter
        );
        this.setState({
            edition: Math.max(1, edition - 1)
        });
    }
    decreaseChapter() {

        const { edition, chapter } = this.state;
        this.props.updateTextInformations(
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
BookAndChapterPager.propTypes = {
    maxChapter: PropTypes.number,
    maxEdition: PropTypes.number,
    updateTextInformations: PropTypes.func.isRequired
};
