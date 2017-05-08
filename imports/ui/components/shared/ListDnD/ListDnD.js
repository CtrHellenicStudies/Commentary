import React from 'react';
import { Meteor } from 'meteor/meteor';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'; // eslint-disable-line import/no-unresolved
import HTML5Backend from 'react-dnd-html5-backend'; // eslint-disable-line import/no-unresolved
import { ListGroup, ListGroupItem } from 'react-bootstrap'; // eslint-disable-line import/no-unresolved
import { findDOMNode } from 'react-dom'; // eslint-disable-line import/no-unresolved

/*
This file exports two elements:

"ListGroupDnD" - react component used the same as ListGroup from react-bootstrap.
Required for DnD functionality to work.

"creatListGroupItemDnD" - function which creates ListGroupItemDnD react compoent.
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
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

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
	index: React.PropTypes.number.isRequired,
	moveListGroupItem: React.PropTypes.func.isRequired,
	connectDragSource: React.PropTypes.func.isRequired,
	connectDropTarget: React.PropTypes.func.isRequired,
	// connectDragPreview: React.PropTypes.func.isRequired,
	isDragging: React.PropTypes.bool.isRequired,
};

class _ListGroupItemDnD extends React.Component {

	static propTypes = {
		...ListGroupItem.propTypes,
		...reactDnDPropTypes,
	};

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
function creatListGroupItemDnD (ItemType) {
	if (ItemType && typeof ItemType === 'string') {
		const dragSource = DragSource(ItemType, listGroupItemSource, collectSource)(_ListGroupItemDnD);
		const ListGroupItemDnD = DropTarget(ItemType, listGroupItemTarget, collectTarget)(dragSource);
		return ListGroupItemDnD;
	}
	throw new Meteor.Error('Incorrect ItemType provided to functoin creatListGroupItemDnD');
}

/*
	ListGroupItemDnD END
*/

export {ListGroupDnD, creatListGroupItemDnD};