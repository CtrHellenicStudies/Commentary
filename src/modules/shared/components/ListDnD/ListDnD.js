import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import _ from 'underscore';

/*
This file exports two elements:

"ListGroupDnD" - react component used the same as ListGroup from react-bootstrap.
Required for DnD functionality to work.

"createListGroupItemDnD" - function which creates ListGroupItemDnD react compoent.
Use the same as ListGroupItem from react-bootstrap, but with DnD functionality.
*/


/*
	ListGroupDnD START
*/

const ListGroupDnD = DragDropContext(HTML5Backend)(ListGroup);

/*
	ListGroupDnD END
*/


/*
	ListGroupItemDnD START
*/

const listGroupItemSource = {
	beginDrag(props) {
		return {
			index: props.index,
		};
	}
};

const listGroupItemTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		props.moveListGroupItem(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	},
};

function collectSource(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

function collectTarget(connect) {
	return {
		connectDropTarget: connect.dropTarget(),
	};
}

const reactDnDPropTypes = {
	index: PropTypes.number.isRequired,
	moveListGroupItem: PropTypes.func.isRequired,
	connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	// connectDragPreview: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
};

class _ListGroupItemDnD extends Component {


	render() {
		const { connectDragSource, connectDropTarget, isDragging } = this.props;

		// Filter props from react dnd proptypes and pass them to
		// ListGroupItem component.
		const reactDnDPropTypesKeys = _.keys(reactDnDPropTypes);
		const listGroupItemProps = _.omit(this.props, ...reactDnDPropTypesKeys);

		return connectDragSource(connectDropTarget(
			<div style={{opacity: isDragging ? 0.5 : 1}}>
				<ListGroupItem
					{...listGroupItemProps}
				/>
			</div>
		));
	}
}

// use this function to create ListGroupItemDnD
// with specified
function createListGroupItemDnD (ItemType) {
	if (ItemType && typeof ItemType === 'string') {
		const dragSource = DragSource(ItemType, listGroupItemSource, collectSource)(_ListGroupItemDnD);
		const ListGroupItemDnD = DropTarget(ItemType, listGroupItemTarget, collectTarget)(dragSource);
		return ListGroupItemDnD;
	}
	throw new Error('Incorrect ItemType provided to function createListGroupItemDnD');
}
_ListGroupItemDnD.propTypes = {
	...ListGroupItem.propTypes,
	...reactDnDPropTypes,
};
/*
	ListGroupItemDnD END
*/

export {ListGroupDnD, createListGroupItemDnD};
