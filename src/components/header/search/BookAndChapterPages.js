import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BookAndChapterPager extends Component {

    constructor(props) {
        super(props);

        this.increaseWork = this.increaseWork.bind(this);
        this.increaseChapter = this.increaseChapter.bind(this);
        this.decreaseWork = this.decreaseWork.bind(this);
        this.decreaseChapter = this.decreaseChapter.bind(this);
    }
    increaseWork() {

        const { work, chapter } = this.props;
        this.props.updateTextInformations(
            chapter,
            work + 1
        );
    }
    increaseChapter() {

        const { work, chapter } = this.props;
        this.props.updateTextInformations(
            chapter + 1,
            work
        );
    }
    decreaseWork() {

        const { work, chapter } = this.props;
        this.props.updateTextInformations(
            chapter,
            work - 1
        );
    }
    decreaseChapter() {

        const { work, chapter } = this.props;
        this.props.updateTextInformations(
            chapter,
            work + 1
        );
    }
    render() {
        const { chapter, work } = this.props;
        return (
            <div className="book-and-chapter-container">
                <button onClick={this.decreaseWork} className="book-and-chapter-button">
                    <i className="fas fa-angle-double-left"></i>
                </button>
                <button onClick={this.decreaseChapter} className="book-and-chapter-button">
                    <i className="fas fa-angle-left"></i>
                </button>
                <span className="book-and-chapter-text"> Chapter { chapter }, Work { work } </span>
                <button onClick={this.increaseChapter} className="book-and-chapter-button">
                    <i className="fas fa-angle-right"></i>
                </button>
                <button onClick={this.increaseWork} className="book-and-chapter-button">
                    <i className="fas fa-angle-double-right"></i>
                </button>
            </div>

        );
    }
}
BookAndChapterPager.propTypes = {
    chapter: PropTypes.number,
    work: PropTypes.work,
    updateTextInformations: PropTypes.func.isRequired
};
