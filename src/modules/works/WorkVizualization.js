/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';

// TODO: upgrade to d3v4
import * as d3 from 'd3';

const WorkVisualization = createClass({

	propTypes: {
		work: PropTypes.object.isRequired,
		commenterSlug: PropTypes.string,
	},

	getInitialState() {
		return {
			selectedBar: -1,
			svg: undefined,
			cellSize: 30,
			cellPadding: 4,
		};
	},

	close() {
		this.hideHeatMap();
		this.setState({
			selectedBar: -1,
		});
	},

	componentDidMount() {
		const self = this;
		const { work, isTest } = this.props;
		const slug = work.slug;

		if (isTest) {
			return false;
		}

		let orientation = 'vertical';
		let width = window.innerWidth * 0.9;

		// --- BEGIN SVG --- //
		const margin = {
			top: 20,
			right: 100,
			bottom: 80,
			left: 60,
		};

		if (width > 992) {
			width = 992;
		}
		if (width < 700) {
			orientation = 'horizontal';
		}

		width = width - margin.left - margin.right;
		let height = 421 - margin.top - margin.bottom;
		const barGraphMargin = {
			left: 10,
		};

		// Data preporation:
		const dataBarGraph = work.subworks.slice() || [];
		dataBarGraph.sort((a, b) => {
			if (a.n < b.n) {
				return -1;
			} else if (a.n > b.n) {
				return 1;
			}
			return 0;
		});

		// If horizontal bar graph, define height by the number of bars on graph
		if (orientation === 'horizontal') {
			height = dataBarGraph.length * 40;
		}

		const svg = d3.select(`.text-subworks-visualization-${slug}`).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		this.setState({
			svg,
		});
		// --- END SVG --- //

		// --- BEGIN BARGRAPH --- //
		// Create bargraph group:
		const barGraph = svg.append('g')
			.attr('class', `bargraph-${slug}`);
		let barGraphBars;

		// Color scale:
		const color = d3.scale.linear()
			.domain([0, d3.max(dataBarGraph, (d) => {
				return d.nComments;
			})])
			.range(['#fbf8ec', '#b6ae97']);

		/*
		 * Orientation for a vertical bar graph
		 */
		if (orientation === 'vertical') {
			// --- BEGIN X-AXIS --- //
			const x = d3.scale.ordinal()
				.rangeRoundBands([barGraphMargin.left, width], 0.4);

			/*
			const xAxis = d3.svg.axis()
					.scale(x)
					.orient('bottom');
			*/
			x.domain(dataBarGraph.map((d) => {
				return d.n;
			}));
			const barGraphXAxis = barGraph.append('g')
				.attr('class', `bargraph-x-axis-${slug}`);
			barGraphXAxis.append('g')
				.attr('class', `bargraph-x-axis-rect-${slug}`)
				.append('rect')
				.attr('x', barGraphMargin.left)
				.attr('y', 0)
				.attr('width', width - barGraphMargin.left)
				.attr('height', 60)
				.attr('transform', `translate(0, ${height})`)
				.attr('fill', '#efebde');
			barGraphXAxis.append('g')
				.attr('class', `bargraph-x-axis-label-${slug}`)
				.append('text')
				.attr('x', -70)
				.attr('y', height + 35)
				.attr('dx', '1em')
				.style('text-anchor', 'start')
				.text('BOOK');
				// --- END X-AXIS --- //

			// --- BEGIN Y-AXIS --- //
			const y = d3.scale.linear()
				.range([height, 0]);
			const yAxis = d3.svg.axis()
				.scale(y)
				.ticks(10)
				.tickSize(-width)
				.orient('left');
			y.domain([0, d3.max(dataBarGraph, (d) => {
				return d.nComments;
			})]);
			const barGraphYAxis = barGraph.append('g')
				.attr('class', `bargraph-y-axis-${slug}`);
			barGraphYAxis.append('g')
				.attr('class', `axis y-axis bargraph-y-axis-lines-${slug}`)
				.attr('fill', '#999999')
				.call(yAxis);
			barGraphYAxis.append('g')
				.attr('class', `bargraph-y-axis-label-${slug}`)
				.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -height / 2)
				.attr('y', -60)
				.attr('dy', '1em')
				.style('text-anchor', 'middle')
				.text('# OF COMMENTS');
				// --- END Y-AXIS --- //

			// --- BEGIN BARS --- //
			barGraphBars = barGraph.append('g')
				.attr('class', `bargraph-bars-${slug}`)
				.selectAll('g[class^="bargraph-bar-"]')
				.data(dataBarGraph)
				.enter()
				.append('g')
				.attr('class', (d) => {
					return `bargraph-bar-${slug}-${d.n}`;
				});

			barGraphBars
				.append('rect')
				.attr('class', (d) => {
					return `bargraph-bar-column-${slug}-${d.n}`;
				})
				.attr('x', (d) => {
					return x(d.n);
				})
				.attr('x_origin', (d) => {
					return x(d.n);
				})
				.attr('width', x.rangeBand())
				.attr('width_origin', x.rangeBand())
				.attr('y', (d) => {
						return y(d.nComments) || 0;
				})
				.attr('y_origin', (d) => {
					if (
							'nComments' in d
							&& typeof d.nComments !== 'undefined'
							&& d.nComments
							&& !isNaN(d.nComments)
					) {
						return y(d.nComments);
					}
					return y(0);
				})
				.attr('fill', (d) => {
					return color(d.nComments);
				})
				.attr('fill_origin', (d) => {
					return color(d.nComments);
				})
				.attr('height', (d) => {
					return (height - y(d.nComments)) || 0;
				})
				.attr('height_origin', (d) => {
					return height - y(d.nComments);
				});

			const footSize = 4;
			barGraphBars
				.append('rect')
				.attr('class', (d) => {
					return 'bargraph-bar-foot-' + slug + '-' + d.n;
				})
				.attr('x', (d) => {
					return x(d.n) - footSize;
				})
				.attr('y', height - footSize)
				.attr('width', x.rangeBand() + footSize * 2)
				.attr('height', footSize)
				.attr('fill', (d) => {
					return color(d.nComments);
				});

			barGraphBars
				.append('text')
				.attr('class', (d) => {
					return 'bargraph-bar-label-' + slug + '-' + d.n;
				})
				.attr('x', (d) => {
					return x(d.n) + x.rangeBand() / 2;
				})
				.attr('y', height + 35)
				.style('text-anchor', 'middle')
				.text((d) => {
					return d.n;
				});

			barGraphBars
				.append('text')
				.attr('class', (d) => {
					return 'bargraph-bar-top-label-' + slug + '-' + d.n;
				})
				.attr('x', (d) => {
					return x(d.n) + x.rangeBand() / 2;
				})
				.attr('y', (d) => {
						return (y(d.nComments) - x.rangeBand() / 2) || 0;
				})
				.style('text-anchor', 'middle')
				.style('opacity', 0)
				.attr('fill', '#d59518')
				.text((d) => {
					return d.nComments;
				});
		} else {
			/*
			 * Orientation for a horizontal bar graph
			 */
			// --- BEGIN Y-AXIS --- //
			const y = d3.scale.ordinal()
				.rangeRoundBands([0, height], 0.4);
			y.domain(dataBarGraph.map((d) =>
				d.n
			));
			const barGraphYAxis = barGraph.append('g')
				.attr('class', `bargraph-y-axis-${slug}`);

			barGraphYAxis.append('g')
				.attr('class', `bargraph-y-axis-rect-${slug}`)
				.append('rect')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', 0)
				.attr('height', height)
				.attr('fill', '#efebde');
			barGraphYAxis.append('g')
				.attr('class', `bargraph-y-axis-label-${slug}`)
				.append('text')
				.attr('x', (height / -2) - margin.left)
				.attr('y', -30)
				.attr('dy', '1em')
				.style('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.text('BOOK');
			// --- END Y-AXIS --- //

			// --- BEGIN X-AXIS --- //
			const x = d3.scale.linear()
				.range([0, width]);
			const xAxis = d3.svg.axis()
				.scale(x);
			x.domain([0, d3.max(dataBarGraph, (d) => (d.nComments))]);
			const barGraphXAxis = barGraph.append('g')
				.attr('class', `bargraph-x-axis-${slug}`);
			barGraphXAxis.append('g')
				.attr('class', `bargraph-x-axis-label-${slug}`)
				.append('text')
				.attr('x', (width / 2))
				.attr('y', 0)
				.attr('dx', '1em')
				.style('text-anchor', 'middle')
				.text('# OF COMMENTS');
			// --- END X-AXIS --- //

			// --- BEGIN BARS --- //
			barGraphBars = barGraph.append('g')
				.attr('class', `bargraph-bars-${slug}`)
				.selectAll('g[class^="bargraph-bar-"]')
				.data(dataBarGraph)
				.enter()
				.append('g')
				.attr('class', (d) => {
				 return `bargraph-bar-${slug}-${d.n}`;
				});

			barGraphBars
				.append('rect')
				.attr('class', (d) => {
					return `bargraph-bar-column-${slug}-${d.n}`;
				})
				.attr('y', (d) => {
					return y(d.n);
				})
				.attr('y_origin', (d) => {
					return y(d.n);
				})
				.attr('x', 16)
				.attr('height', y.rangeBand())
				.attr('height_origin', y.rangeBand())
				.attr('fill', (d) => {
					return color(d.nComments);
				})
				.attr('fill_origin', (d) => {
					return color(d.nComments);
				})
				.attr('width_origin', (d) => {
					return (x(d.nComments)) || 0;
				})
				.attr('width', (d) => {
					return x(d.nComments);
				});

			const footSize = 4;
			barGraphBars
				.append('rect')
				.attr('class', (d) => {
					return 'bargraph-bar-foot-' + slug + '-' + d.n;
				})
				.attr('y', (d) => {
					return y(d.n) - footSize;
				})
				.attr('x', footSize + 10)
				.attr('height', y.rangeBand() + footSize * 2)
				.attr('width', footSize)
				.attr('fill', (d) => {
					return color(d.nComments);
				});

			barGraphBars
				.append('text')
				.attr('class', (d) => {
					return 'bargraph-bar-label-' + slug + '-' + d.n;
				})
				.attr('y', (d) => {
					return y(d.n) + y.rangeBand() / 2;
				})
				.attr('x', 0)
				.style('text-anchor', 'middle')
				.text((d) => {
					return d.n;
				});

			barGraphBars
				.append('text')
				.attr('class', (d) => {
					return 'bargraph-bar-top-label-' + slug + '-' + d.n;
				})
				.attr('y', (d) => {
					return y(d.n) + y.rangeBand() / 2;
				})
				.attr('x', (d) => {
					return (x(d.nComments) + 40) || 0;
				})
				.style('text-anchor', 'middle')
				.style('opacity', 0)
				.attr('fill', '#d59518')
				.text((d) => {
					return d.nComments;
				});
		}

		barGraphBars
			.on('click', (d) => {
				if (d.nComments) {
					self.setState({
						selectedBar: d.n,
					});

					//	TODO: get the real number of lines per book - not from the works collection
					const foundSubwork = self.props.work.subworks.find((element, index, array) => {
						return element.n === self.state.selectedBar;
					});
					let numberOfLines = Math.floor(d3.max(foundSubwork.commentHeatmap, (d) => {
							return d.n;
						}) / 10);

					// fixes heatmap error if only commented lines are from 1 to 10:
					if (numberOfLines === 0) {
						numberOfLines = 1;
					}
					const cellSize = self.state.cellSize;
					const cellPadding = self.state.cellPadding;
					const heatMapWidth = Math.ceil(numberOfLines / 5) * (cellSize + cellPadding) - cellPadding;
					const heatMapHeight = 5 * (cellSize + cellPadding) - cellPadding;

					// --- BEGIN ANIMATION - EXPAND BAR --- //
					// Hide BarGraph:
					const selectBarGraph = d3.selectAll('.bargraph-x-axis-' + slug + ',.bargraph-y-axis-' + slug + ',[class^="bargraph-bar-' + slug + '-"]');
					selectBarGraph.transition()
						.duration(1000)
						.style('opacity', 0);
					selectBarGraph.transition()
						.delay(3000)
						.style('display', 'none');

					// Expand bar:
					const suffix = slug + '-' + d.n;
					var selectBar = d3.select('.bargraph-bar-' + suffix);
					selectBar.transition()
						.style('opacity', 1);
					d3.select('.bargraph-bar-foot-' + suffix).transition()
						.duration(1000)
						.style('opacity', 0);
					d3.select('.bargraph-bar-label-' + suffix).transition()
						.duration(1000)
						.style('opacity', 0);
					d3.select('.bargraph-bar-top-label-' + suffix).transition()
						.duration(1000)
						.style('opacity', 0);

					d3.select('.bargraph-bar-foot-' + suffix).transition()
						.delay(1000)
						.style('display', 'none');
					d3.select('.bargraph-bar-label-' + suffix).transition()
						.delay(1000)
						.style('display', 'none');
					d3.select('.bargraph-bar-top-label-' + suffix).transition()
						.delay(1000)
						.style('display', 'none');

					var selectBar = d3.select('.bargraph-bar-column-' + suffix);
					selectBar.transition()
						.style('opacity', 1);
					selectBar.transition()
						.delay(1000)
						.duration(1000)
						.attr('fill', '#d59518')
						.attr('x', 0)
						.attr('y', 0)
						.attr('height', heatMapHeight)
						.attr('width', heatMapWidth);
					selectBar.transition()
						.delay(2000)
						.duration(1000)
						.style('opacity', 0);
					selectBar.transition()
						.delay(3000)
						.style('display', 'none');

					// Show button:
					d3.select('.heatmap-button-' + slug).transition()
						.delay(2000)
						.duration(1000)
						.style('opacity', 1)
						.style('display', '');
				// --- END ANIMATION - EXPAND BAR --- //
				}
			})
			.on('mouseover', (d) => {
				const suffix = slug + '-' + d.n;
				d3.select('.bargraph-bar-column-' + suffix)
					.attr('fill', '#d59518')
					.style('cursor', 'pointer');
				d3.select('.bargraph-bar-foot-' + suffix)
					.attr('fill', '#d59518')
					.style('cursor', 'pointer');
				d3.select('.bargraph-bar-label-' + suffix)
					.attr('fill', '#d59518')
					.style('text-decoration', 'underline')
					.style('cursor', 'pointer');
				d3.select('.bargraph-bar-top-label-' + suffix)
					.style('opacity', 1)
					.style('cursor', 'pointer');
			})
			.on('mouseout', (d) => {
				const suffix = slug + '-' + d.n;
				d3.select('.bargraph-bar-column-' + suffix)
					.attr('fill', (d) => {
						return color(d.nComments);
					});
				d3.select('.bargraph-bar-foot-' + suffix)
					.attr('fill', (d) => {
						return color(d.nComments);
					});
				d3.select('.bargraph-bar-label-' + suffix)
					.attr('fill', '#000000')
					.style('text-decoration', 'none');
				d3.select('.bargraph-bar-top-label-' + suffix)
					.style('opacity', 0);
			});
		// --- END BARS --- //
		// --- END BARGRAPH --- //

		// --- BEGIN BUTTON --- //
		// Create button group:
		const button = svg.append('g')
			.attr('class', `heatmap-button-${slug}`)
			.style('opacity', 0)
			.style('display', 'none');

		// Create button rect:
		button
			.append('rect')
			.attr('class', `heatmap-button-rect-${slug}`)
			.attr('x', 0)
			.attr('y', 180)
			.attr('width', 58)
			.attr('height', 30)
			// .attr('fill', '#d59518');
			.style('cursor', 'pointer')
			.attr('fill', '#ffffff');

		// Create button text:
		button
			.append('text')
			.attr('class', `heatmap-button-text-${slug}`)
			.attr('x', 10)
			.attr('y', 200)
			.style('text-anchor', 'left')
			.style('opacity', 0.5)
			.style('cursor', 'pointer')
			.text('BACK');

		// Button animation:
		button
			.on('click', (d) => {
				self.hideHeatMap();
			})
			.on('mouseover', (d) => {
				d3.select('.heatmap-button-rect-' + slug)
					.attr('fill', '#d59518');
				d3.select('.heatmap-button-text-' + slug)
					.style('opacity', 1);
				d3.select(this)
					.style('cursor', 'pointer');
			})
			.on('mouseout', (d) => {
				d3.select('.heatmap-button-rect-' + slug)
					.attr('fill', '#ffffff');
				d3.select('.heatmap-button-text-' + slug)
					.style('opacity', 0.5);
			});
		// --- END BUTTON --- //
	},

	componentDidUpdate(prevProps, prevState) {
		const self = this;

		// --- BEGIN HEATMAP --- //
		if (this.state.selectedBar > -1) {
			const foundSubwork = this.props.work.subworks.find(function(element, index, array) {
				return element.n === self.state.selectedBar;
			});
			const dataHeatMap = JSON.parse(JSON.stringify(foundSubwork.commentHeatmap));
			const subworkN = foundSubwork.n;
			dataHeatMap.sort(function(a, b) {
				if (a.n < b.n)
					return -1;
				if (a.n > b.n)
					return 1;
				return 0;
			});

			// Color scale:
			const color = d3.scale.linear()
				.domain([0, d3.max(dataHeatMap, function(d) {
					return d.nComments;
				})])
				.range(['#fbf8ec', '#b6ae97']);
			const dataN = dataHeatMap.map(function(a) {
				return a.n;
			});

			//	TODO: get the real number of lines per book - not from the works collection:
			const numberOfLines = Math.floor(d3.max(dataHeatMap, function(d) {
					return d.n;
				}) / 10);
			const allLines = Array.apply(null, {
				length: numberOfLines,
			}).map(Number.call, Number);
			allLines.push(numberOfLines);

			// Define the div for the tooltip:
			const tooltip = d3.select('body').append('div')
				.attr('class', 'tooltip')
				.style('opacity', 0);

			const cellSize = this.state.cellSize;
			const cellPadding = this.state.cellPadding;

			const tooltipOffsetLeft = 52;
			const tooltipOffsetLTop = 0;

			let counter = 0;

			const workSlug = self.props.work.slug;

			// Remove old heatmap:
			d3.select('.heatmap-' + this.props.work.slug).remove();

			// Create heatmap group:
			const heatmap = this.state.svg
				.append('g')
				.attr('class', 'heatmap-' + this.props.work.slug)
				.style('display', 'none')
				.style('opacity', 0);

			// --- BEGIN HEATMAP CELLS --- //
			var rect = heatmap
				.append('g')
				.attr('class', 'heatmap-cells-' + this.props.work.slug)
				.selectAll('.heatmap-cell')
				.data(allLines)
				.enter()
				.append('rect')
				.attr('class', 'heatmap-cell')
				.attr('width', cellSize)
				.attr('height', cellSize)
				.attr('x', function(d) {
					return Math.floor(d / 5) * (cellSize + cellPadding);
				})
				.attr('y', function(d) {
					if (counter != 4) {
						var y = counter * cellSize + cellPadding * counter;
						counter++;
						return y;
					} else {
						var y = counter * cellSize + cellPadding * counter;
						counter = 0;
						return y;
					}
				})
				.attr('fill', '#fff')
				.on('mouseover', function(d) {
					d3.select(this)
						.classed('heatmap-cell-selected', true);
					tooltip.transition()
						.duration(200)
						.style('opacity', .9);
					const i = dataN.indexOf(d * 10);
					const elementOffset = $('.text-subworks-visualization-' + self.props.work.slug).offset();
					const cellPositionX = parseInt(d3.select(this).attr('x'));
					const cellPositionY = parseInt(d3.select(this).attr('y'));
					if (i > -1) {
						tooltip.html('Line span: ' + ((d * 10) + 1) + ' - ' + ((d + 1) * 10) + ', Comments: ' + dataHeatMap[i].nComments)
							.style('left', elementOffset.left + cellPositionX + tooltipOffsetLeft + 'px')
							.style('top', elementOffset.top + cellPositionY + tooltipOffsetLTop + 'px');
					} else {
						tooltip.html('Line span: ' + ((d * 10) + 1) + ' - ' + ((d + 1) * 10) + ', Comments: 0')
							.style('left', elementOffset.left + cellPositionX + tooltipOffsetLeft + 'px')
							.style('top', elementOffset.top + cellPositionY + tooltipOffsetLTop + 'px');
					}
				})
				.on('mouseout', function(d) {
					d3.select(this)
						.classed('heatmap-cell-selected', false);
					tooltip.transition()
						.duration(500)
						.style('opacity', 0);
				})
				.on('click', function(d) {
					if (self.props.commenterSlug) {
						window.location = '/commentary/?works=' + workSlug + '&subworks=' + subworkN + '&lineFrom=' + ((d * 10) + 1) + '&lineTo=' + ((d + 1) * 10) + '&commenters=' + self.props.commenterSlug;
					} else {
						window.location = '/commentary/?works=' + workSlug + '&subworks=' + subworkN + '&lineFrom=' + ((d * 10) + 1) + '&lineTo=' + ((d + 1) * 10);
					};
				});

			// Add fill color to commented lines:
			rect.filter(function(d) {
				return dataN.indexOf(d * 10) > -1;
			})
				.attr('fill', function(d) {
					const i = dataN.indexOf(d * 10);
					return color(dataHeatMap[i].nComments);
				});
				// --- END HEATMAP CELLS --- //

			// --- BEGIN HEATMAP Y LABEL --- //
			const arrayData = [1, 2, 3, 4, 5];
			var rect = heatmap
				.append('g')
				.attr('class', 'heatmap-y-labels-' + this.props.work.slug)
				.selectAll('.heatmap-label-y')
				.data(arrayData)
				.enter()
				.append('text')
				.attr('class', 'heatmap-label-y')
				.attr('fill', '#d7d1c0')
				.attr('text-anchor', 'middle')
				.attr('x', -15)
				.attr('y', function(d) {
					return self.state.cellSize / 2 + self.state.cellPadding + (self.state.cellSize + self.state.cellPadding) * (d - 1);
				})
				.text(function(d) {
					return d;
				});
				// --- END HEATMAP Y LABEL --- //

			// --- BEGIN HEATMAP X LABEL --- //
			const numberOfLines5 = Math.ceil(allLines.length / 5);
			const allLines5 = Array.apply(null, {
				length: numberOfLines5,
			}).map(Number.call, Number);
			for (let i = 0; i < allLines5.length; i++) {
				allLines5[i] = allLines5[i] * 50;
			}

			var rect = heatmap
				.append('g')
				.attr('class', 'heatmap-x-labels-' + this.props.work.slug)
				.selectAll('.heatmap-label-x')
				.data(allLines5)
				.enter()
				.append('text')
				.attr('class', 'heatmap-label-x')
				.attr('fill', '#d7d1c0')
				.attr('text-anchor', 'middle')
				.attr('x', function(d) {
					return self.state.cellSize / 2 + (self.state.cellSize + self.state.cellPadding) * d / 50;
				})
				.attr('y', -10)
				.text(function(d) {
					return d;
				});
				// --- END HEATMAP X LABEL --- //

			// --- BEGIN ANIMATION - SHOW HEATMAP --- //
			const selectHeatMap = d3.select('.heatmap-' + this.props.work.slug);
			selectHeatMap.transition()
				.delay(900)
				.style('display', '');
			selectHeatMap.transition()
				.delay(2000)
				.duration(1000)
				.style('opacity', 1);
		// --- END ANIMATION - SHOW HEATMAP --- //
		}
	// --- END HEATMAP --- //
	},

	hideHeatMap() {
		const self = this;

		const slug = self.props.work.slug;

		// --- BEGIN ANIMATION - HIDE HEATMAP --- //
		const selectHeatMap = d3.select('.heatmap-' + this.props.work.slug);
		selectHeatMap.transition()
			.duration(1000)
			.style('opacity', 0);
		selectHeatMap.transition()
			.delay(1000)
			.style('display', 'none');
			// --- END ANIMATION - HIDE HEATMAP --- //

		// --- BEGIN ANIMATION - CONTRACT BAR --- //
		// Contract Bar:
		const suffix = slug + '-' + this.state.selectedBar;
		const selectBar = d3.select('.bargraph-bar-column-' + suffix);
		selectBar.transition()
			.style('display', '');
		selectBar.transition()
			.delay(50)
			.duration(950)
			.style('opacity', 1);
		selectBar.transition()
			.delay(1000)
			.duration(500)
			.attr('width', selectBar.attr('width_origin'))
			.attr('height', selectBar.attr('height_origin'))
			.attr('x', selectBar.attr('x_origin'))
			.attr('y', selectBar.attr('y_origin'))
			.attr('fill', selectBar.attr('fill_origin'));

		d3.select('.bargraph-bar-foot-' + suffix).transition()
			.delay(1500)
			.style('display', '');
		d3.select('.bargraph-bar-label-' + suffix).transition()
			.delay(1500)
			.style('display', '');
		d3.select('.bargraph-bar-top-label-' + suffix).transition()
			.delay(1500)
			.style('display', '');

		d3.select('.bargraph-bar-foot-' + suffix).transition()
			.delay(1550)
			.style('opacity', 1);
		d3.select('.bargraph-bar-label-' + suffix).transition()
			.delay(1550)
			.style('opacity', 1);

		// Show BarGraph:
		const selectBarGraph = d3.selectAll('.bargraph-x-axis-' + slug + ',.bargraph-y-axis-' + slug + ',[class^="bargraph-bar-' + slug + '-"]');
		selectBarGraph.transition()
			.delay(1550)
			.style('display', '');
		selectBarGraph.transition()
			.delay(1600)
			.duration(500)
			.style('opacity', 1);

		// Hide button:
		const selectButton = d3.select('.heatmap-button-' + slug);
		selectButton.transition()
			.duration(1000)
			.style('opacity', 0)
			.style('display', '');
	// --- END ANIMATION - CONTRACT BAR --- //
	},


	render() {
		const { work } = this.props;
		const workUrl = `/commentary/?q=work.${work.slug}`;

		if ('subworks' in work && work.subworks.length) {
			return (
				<div className={`work-teaser work-teaser--${work.slug}`}>
					<div className="commentary-text">
						<Link to={workUrl}><h3 className="text-title">{work.title}</h3></Link>
						{/*<hr className="text-divider" />*/}
						<div className="text-meta" />
						<div className={`text-subworks text-subworks-visualization-${work.slug}`} />
					</div>
				</div>
			);
		}

		return null;
	},
});

export default WorkVisualization;
