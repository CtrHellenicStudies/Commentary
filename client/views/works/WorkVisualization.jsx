WorkVisualization = React.createClass({

	propTypes: {
		work: React.PropTypes.object.isRequired,
		commenterWordpressId: React.PropTypes.number,
	},

	getInitialState() {
		return {
			selectedBar: -1,
			svg: undefined,
			cellSize: 30,
			cellPadding: 4,
		};
	},

	componentDidMount() {
		const self = this;
		const slug = self.props.work.slug;

		// --- BEGIN SVG --- //
		const margin = {
			top: 20,
			right: 100,
			bottom: 80,
			left: 60,
		};
		const width = 970 - margin.left - margin.right;
		const height = 421 - margin.top - margin.bottom;
		const barGraphMargin = {
			left: 10,
		};

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

		// Data preporation:
		const dataBarGraph = this.props.work.subworks;
		dataBarGraph.sort((a, b) => {
			if (a.n < b.n) {
				return -1;
			} else if (a.n > b.n) {
				return 1;
			}
			return 0;
		});

		// Color scale:
		const color = d3.scale.linear()
			.domain([0, d3.max(dataBarGraph, (d) => d.nComments)])
			.range(['#fbf8ec', '#b6ae97']);

		// --- BEGIN X-AXIS --- //
		const x = d3.scale.ordinal()
			.rangeRoundBands([barGraphMargin.left, width], 0.4);

		/*
		 const xAxis = d3.svg.axis()
		 .scale(x)
		 .orient('bottom');
		 */

		x.domain(dataBarGraph.map((d) => d.n));

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

		y.domain([0, d3.max(dataBarGraph, (d) => d.nComments)]);

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
		const barGraphBars = barGraph.append('g')
			.attr('class', `bargraph-bars-${slug}`)
			.selectAll('g[class^="bargraph-bar-"]')
			.data(dataBarGraph)
			.enter()
			.append('g')
			.attr('class', (d) => `bargraph-bar-${slug}-${d.n}`);

		barGraphBars
			.append('rect')
			.attr('class', (d) => `bargraph-bar-column-${slug}-${d.n}`)
			.attr('x', (d) => x(d.n))
			.attr('x_origin', (d) => x(d.n))
			.attr('width', x.rangeBand())
			.attr('width_origin', x.rangeBand())
			.attr('y', (d) => {
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
			.attr('fill', (d) => color(d.nComments))
			.attr('fill_origin', (d) => color(d.nComments))
			.attr('height', (d) => height - y(d.nComments))
			.attr('height_origin', (d) => height - y(d.nComments));

		const footSize = 4;
		barGraphBars
			.append('rect')
			.attr('class', (d) => `bargraph-bar-foot-${slug}-${d.n}`)
			.attr('x', (d) => x(d.n) - footSize)
			.attr('y', height - footSize)
			.attr('width', x.rangeBand() + (footSize * 2))
			.attr('height', footSize)
			.attr('fill', (d) => color(d.nComments));

		barGraphBars
			.append('text')
			.attr('class', (d) => `bargraph-bar-label-${slug}-${d.n}`)
			.attr('x', (d) => x(d.n) + (x.rangeBand() / 2))
			.attr('y', height + 35)
			.style('text-anchor', 'middle')
			.text((d) => d.n);

		barGraphBars
			.append('text')
			.attr('class', (d) => `bargraph-bar-top-label-${slug}-${d.n}`)
			.attr('x', (d) => x(d.n) + (x.rangeBand() / 2))
			.attr('y', (d) => {
				if (
					'nComments' in d
					&& typeof d.nComments !== 'undefined'
					&& d.nComments
					&& !isNaN(d.nComments)
				) {
					return y(d.nComments) - (x.rangeBand() / 2);
				}
				return y(0) - (x.rangeBand() / 2);
			})
			.style('text-anchor', 'middle')
			.style('opacity', 0)
			.attr('fill', '#d59518')
			.text((d) => d.nComments);

		barGraphBars
			.on('click', (d) => {
				if (d.nComments) {
					self.setState({
						selectedBar: d.n,
					});

					//	TODO: get the real number of lines per book - not from the works collection
					const foundSubwork =
						self.props.work.subworks.find((element) => element.n === self.state.selectedBar);
					let numberOfLines = Math.floor(d3.max(foundSubwork.commentHeatmap, (d1) => d1.n) / 10);

					// fixes heatmap error if only commented lines are from 1 to 10:
					if (numberOfLines === 0) {
						numberOfLines = 1;
					}
					const cellSize = self.state.cellSize;
					const cellPadding = self.state.cellPadding;
					const heatMapWidth =
						(Math.ceil(numberOfLines / 5) * (cellSize + cellPadding)) - cellPadding;
					const heatMapHeight = (5 * (cellSize + cellPadding)) - cellPadding;

					// --- BEGIN ANIMATION - EXPAND BAR --- //
					// Hide BarGraph:
					const selectBarGraph = d3.selectAll(`.bargraph-x-axis-${slug},.bargraph-y-axis-${slug
						},[class^="bargraph-bar-${slug}-"]`);
					selectBarGraph.transition()
						.duration(1000)
						.style('opacity', 0);
					selectBarGraph.transition()
						.delay(3000)
						.style('display', 'none');

					// Expand bar:
					const suffix = `${slug}-${d.n}`;
					let selectBar = d3.select(`.bargraph-bar-${suffix}`);
					selectBar.transition()
						.style('opacity', 1);
					d3.select(`.bargraph-bar-foot-${suffix}`).transition()
						.duration(1000)
						.style('opacity', 0);
					d3.select(`.bargraph-bar-label-${suffix}`).transition()
						.duration(1000)
						.style('opacity', 0);
					d3.select(`.bargraph-bar-top-label-${suffix}`).transition()
						.duration(1000)
						.style('opacity', 0);

					d3.select(`.bargraph-bar-foot-${suffix}`).transition()
						.delay(1000)
						.style('display', 'none');
					d3.select(`.bargraph-bar-label-${suffix}`).transition()
						.delay(1000)
						.style('display', 'none');
					d3.select(`.bargraph-bar-top-label-${suffix}`).transition()
						.delay(1000)
						.style('display', 'none');

					selectBar = d3.select(`.bargraph-bar-column-${suffix}`);
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
					d3.select(`.heatmap-button-${slug}`).transition()
						.delay(2000)
						.duration(1000)
						.style('opacity', 1)
						.style('display', '');
					// --- END ANIMATION - EXPAND BAR --- //
				}
			})
			.on('mouseover', (d) => {
				const suffix = `${slug}-${d.n}`;
				d3.select(`.bargraph-bar-column-${suffix}`)
					.attr('fill', '#d59518')
					.style('cursor', 'pointer');
				d3.select(`.bargraph-bar-foot-${suffix}`)
					.attr('fill', '#d59518')
					.style('cursor', 'pointer');
				d3.select(`.bargraph-bar-label-${suffix}`)
					.attr('fill', '#d59518')
					.style('text-decoration', 'underline')
					.style('cursor', 'pointer');
				d3.select(`.bargraph-bar-top-label-${suffix}`)
					.style('opacity', 1)
					.style('cursor', 'pointer');
			})
			.on('mouseout', (d) => {
				const suffix = `${slug}-${d.n}`;
				d3.select(`.bargraph-bar-column-${suffix}`)
					.attr('fill', (d1) => color(d1.nComments));
				d3.select(`.bargraph-bar-foot-${suffix}`)
					.attr('fill', (d1) => color(d1.nComments));
				d3.select(`.bargraph-bar-label-${suffix}`)
					.attr('fill', '#000000')
					.style('text-decoration', 'none');
				d3.select(`.bargraph-bar-top-label-${suffix}`)
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
			.on('click', () => {
				self.hideHeatMap();
			})
			.on('mouseover', () => {
				d3.select(`.heatmap-button-rect-${slug}`)
					.attr('fill', '#d59518');
				d3.select(`.heatmap-button-text-${slug}`)
					.style('opacity', 1);
				d3.select(this)
					.style('cursor', 'pointer');
			})
			.on('mouseout', () => {
				d3.select(`.heatmap-button-rect-${slug}`)
					.attr('fill', '#ffffff');
				d3.select(`.heatmap-button-text-${slug}`)
					.style('opacity', 0.5);
			});
		// --- END BUTTON --- //
	},

	componentDidUpdate() {
		const self = this;

		// --- BEGIN HEATMAP --- //
		if (this.state.selectedBar > -1) {
			const foundSubwork =
				this.props.work.subworks.find((element) => element.n === self.state.selectedBar);
			const dataHeatMap = foundSubwork.commentHeatmap;
			const subworkN = foundSubwork.n;
			dataHeatMap.sort((a, b) => {
				if (a.n < b.n) {
					return -1;
				}
				if (a.n > b.n) {
					return 1;
				}
				return 0;
			});

			// Color scale:
			const color = d3.scale.linear()
				.domain([0, d3.max(dataHeatMap, (d) => d.nComments)])
				.range(['#fbf8ec', '#b6ae97']);
			const dataN = dataHeatMap.map((a) => a.n);

			//	TODO: get the real number of lines per book - not from the works collection:
			const numberOfLines = Math.floor(d3.max(dataHeatMap, (d) => d.n) / 10);
			const allLines = [...Array(numberOfLines).keys()];
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
			d3.select(`.heatmap-${this.props.work.slug}`).remove();

			// Create heatmap group:
			const heatmap = this.state.svg
				.append('g')
				.attr('class', `heatmap-${this.props.work.slug}`)
				.style('display', 'none')
				.style('opacity', 0);

			// --- BEGIN HEATMAP CELLS --- //
			const rect = heatmap
				.append('g')
				.attr('class', `heatmap-cells-${this.props.work.slug}`)
				.selectAll('.heatmap-cell')
				.data(allLines)
				.enter()
				.append('rect')
				.attr('class', 'heatmap-cell')
				.attr('width', cellSize)
				.attr('height', cellSize)
				.attr('x', (d) => Math.floor(d / 5) * (cellSize + cellPadding))
				.attr('y', () => {
					let y = 0;
					if (counter !== 4) {
						y = (counter * cellSize) + (cellPadding * counter);
						counter++;
						return y;
					}
					y = (counter * cellSize) + (cellPadding * counter);
					counter = 0;
					return y;
				})
				.attr('fill', '#fff')
				.on('mouseover', (d) => {
					d3.select(this)
						.classed('heatmap-cell-selected', true);
					tooltip.transition()
						.duration(200)
						.style('opacity', 0.9);
					const i = dataN.indexOf(d * 10);
					const elementOffset = $(`.text-subworks-visualization-${self.props.work.slug}`).offset();
					const cellPositionX = parseInt(d3.select(this).attr('x'), 10);
					const cellPositionY = parseInt(d3.select(this).attr('y'), 10);
					if (i > -1) {
						tooltip.html(`Line span: ${(d * 10) + 1} - ${(d + 1) * 10
							},Comments: ${dataHeatMap[i].nComments}`)
							.style('left', `${elementOffset.left + cellPositionX + tooltipOffsetLeft}px`)
							.style('top', `${elementOffset.top + cellPositionY + tooltipOffsetLTop}px`);
					} else {
						tooltip.html(`Line span: ${(d * 10) + 1} - ${(d + 1) * 10}, Comments: 0`)
							.style('left', `${elementOffset.left + cellPositionX + tooltipOffsetLeft}px`)
							.style('top', `${elementOffset.top + cellPositionY + tooltipOffsetLTop}px`);
					}
				})
				.on('mouseout', () => {
					d3.select(this)
						.classed('heatmap-cell-selected', false);
					tooltip.transition()
						.duration(500)
						.style('opacity', 0);
				})
				.on('click', (d) => {
					if (self.props.commenterWordpressId) {
						window.location = `/commentary/?works=${workSlug}&subworks=${subworkN}&lineFrom=${
						(d * 10) + 1}&lineTo=${(d + 1) * 10}&commenters=${self.props.commenterWordpressId}`;
					} else {
						window.location = `/commentary/?works=${workSlug}&subworks=${subworkN
							}&lineFrom=${(d * 10) + 1}&lineTo=${(d + 1) * 10}`;
					}
				});

			// Add fill color to commented lines:
			rect.filter((d) => dataN.indexOf(d * 10) > -1)
				.attr('fill', (d) => {
					const i = dataN.indexOf(d * 10);
					return color(dataHeatMap[i].nComments);
				});
			// --- END HEATMAP CELLS --- //

			// --- BEGIN HEATMAP Y LABEL --- //
			const arrayData = [1, 2, 3, 4, 5];
			heatmap
				.append('g')
				.attr('class', `heatmap-y-labels-${this.props.work.slug}`)
				.selectAll('.heatmap-label-y')
				.data(arrayData)
				.enter()
				.append('text')
				.attr('class', 'heatmap-label-y')
				.attr('fill', '#d7d1c0')
				.attr('text-anchor', 'middle')
				.attr('x', -15)
				.attr('y', (d) =>
					(self.state.cellSize / 2) + self.state.cellPadding +
					((self.state.cellSize + self.state.cellPadding) * (d - 1))
				)
				.text((d) => d);
			// --- END HEATMAP Y LABEL --- //

			// --- BEGIN HEATMAP X LABEL --- //
			const numberOfLines5 = Math.ceil(allLines.length / 5);
			const allLines5 = [...Array(numberOfLines5).keys()];
			for (let i = 0; i < allLines5.length; i++) {
				allLines5[i] *= 50;
			}

			heatmap
				.append('g')
				.attr('class', `heatmap-x-labels-${this.props.work.slug}`)
				.selectAll('.heatmap-label-x')
				.data(allLines5)
				.enter()
				.append('text')
				.attr('class', 'heatmap-label-x')
				.attr('fill', '#d7d1c0')
				.attr('text-anchor', 'middle')
				.attr('x', (d) =>
					(self.state.cellSize / 2) + (((self.state.cellSize + self.state.cellPadding) * d) / 50)
				)
				.attr('y', -10)
				.text((d) => d);
			// --- END HEATMAP X LABEL --- //

			// --- BEGIN ANIMATION - SHOW HEATMAP --- //
			const selectHeatMap = d3.select(`.heatmap-${this.props.work.slug}`);
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

	close() {
		this.hideHeatMap();
		this.setState({
			selectedBar: -1,
		});
	},

	hideHeatMap() {
		const self = this;

		const slug = self.props.work.slug;

		// --- BEGIN ANIMATION - HIDE HEATMAP --- //
		const selectHeatMap = d3.select(`.heatmap-${this.props.work.slug}`);
		selectHeatMap.transition()
			.duration(1000)
			.style('opacity', 0);
		selectHeatMap.transition()
			.delay(1000)
			.style('display', 'none');
		// --- END ANIMATION - HIDE HEATMAP --- //

		// --- BEGIN ANIMATION - CONTRACT BAR --- //
		// Contract Bar:
		const suffix = `${slug}-${this.state.selectedBar}`;
		const selectBar = d3.select(`.bargraph-bar-column-${suffix}`);
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

		d3.select(`.bargraph-bar-foot-${suffix}`).transition()
			.delay(1500)
			.style('display', '');
		d3.select(`.bargraph-bar-label-${suffix}`).transition()
			.delay(1500)
			.style('display', '');
		d3.select(`.bargraph-bar-top-label-${suffix}`).transition()
			.delay(1500)
			.style('display', '');

		d3.select(`.bargraph-bar-foot-${suffix}`).transition()
			.delay(1550)
			.style('opacity', 1);
		d3.select(`.bargraph-bar-label-${suffix}`).transition()
			.delay(1550)
			.style('opacity', 1);

		// Show BarGraph:
		const selectBarGraph = d3.selectAll(`.bargraph-x-axis-${slug
			},.bargraph-y-axis-${slug},[class^="bargraph-bar-${slug}-"]`);
		selectBarGraph.transition()
			.delay(1550)
			.style('display', '');
		selectBarGraph.transition()
			.delay(1600)
			.duration(500)
			.style('opacity', 1);

		// Hide button:
		const selectButton = d3.select(`.heatmap-button-${slug}`);
		selectButton.transition()
			.duration(1000)
			.style('opacity', 0)
			.style('display', '');
		// --- END ANIMATION - CONTRACT BAR --- //
	},

	render() {
		const work = this.props.work;
		const workUrl = `/commentary/?q=work.${work.slug}`;

		return (
			<div className={`work-teaser work-teaser--${work.slug}`}>
				<div className="commentary-text">
					<a href={workUrl}><h3 className="text-title">{ work.title }</h3></a>
					<hr className="text-divider" />
					<div className="text-meta" />
					<div className={`text-subworks text-subworks-visualization-${work.slug}`} />
				</div>
			</div>
		);
	},
});
