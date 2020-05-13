const height = 248
const width = 544
const margin = { top: 20, right: 20, bottom: 30, left: 20 }

document.addEventListener('DOMContentLoaded', function () {

    const data = [
        { year: '2019', value: 1 },
        { year: '2020', value: 2 },
        { year: '2021', value: 4 },
        { year: '2022', value: 6 },
        { year: '2023', value: 7 },
        { year: '2024', value: 8 },
        { year: '2025', value: 9 },
        { year: '2026', value: 10 },
        { year: '2027', value: 12 },
        { year: '2028', value: 15 }
    ]

    const barWidth = 24
    const barSpace = 40;
    const barsRange = [margin.left, data.length * (barWidth + barSpace) + margin.right]

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.year))
        .range(barsRange)
        .padding(0)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(
            d3
                .axisBottom(x)
                .tickSizeOuter(0)
        )

    const yAxis = g => g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        //.call(g => g.select('.domain').remove())

    function bar(d) {

        return barInner(
            x(d.year)  + (barSpace / 2),
            y(0),
            x.bandwidth() - barSpace,
            y(0)-y(d.value),
            4
        )

        function barInner(x, y, width, height, radius, f = 1) {
            // x coordinates of top of arcs
            const x0 = x + radius;
            const x1 = x + width - radius;
            // y coordinates of bottom of arcs
            const y0 = y - height + radius;

            return [
                'M', x, y,
                'L', x, y0,
                'A', radius, radius, 0, 0, f, x0, y - height,
                'L', x1, y - height,
                'A', radius, radius, 0, 0, f, x + width, y0,
                'L', x + width, y,
                'Z'
            ].join(' ');
        }
    }

    d3
        .select('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])

    d3
        .select('svg')
        .append('g')
        .attr('class', 'bars')
        .attr('fill', '#33CCFF')
        .selectAll('path')
        .data(data)
        .join('path')
        .attr('opacity', 0)
        .attr('d', bar)
        .transition(d3.easeLinear)
        .duration(300)
        .attr('opacity', 1)

    d3
        .select('svg')
        .append('g')
        .attr('opacity', 0)
        .attr('class', 'x-axis')

    d3.select('.x-axis')
        .call(xAxis)
        .transition(d3.easeLinear)
        .duration(300)
        .attr('opacity', 1)

    d3.select('svg')
        .append('g')
        .attr('opacity', 0)
        .attr('class', 'y-axis')

    d3.select('.y-axis')
        .append('rect')
        .attr('width', margin.left)
        .attr('height', height)
        .attr('x', -margin.left)
        .attr('y', 0)
        .attr('fill', '#ffffff')
        .attr('stroke-width', 1)
        .attr('stroke', '#ffffff')

    d3
        .select('.y-axis')
        .call(yAxis)
        .transition(d3.easeLinear)
        .duration(300)
        .attr('opacity', 1)

    const zoom =
        d3
            .zoom()
            .scaleExtent([1, 1])
            .on('start', onZoomStart)
            .on('zoom', onZoom)
            .on('end', onZoomEnd)

    d3.select('svg')
        .call(zoom)

    function onZoom() {
        x.range(barsRange.map(d => d3.event.transform.applyX(d)));

        d3
            .select('svg')
            .selectAll('.bars path')
            .attr('d', bar)

        d3
            .select('svg')
            .selectAll('.x-axis')
            .call(xAxis);
    }
    
    function onZoomStart() {
        console.log('on zoom start')
    }
    
    function onZoomEnd() {
        console.log('on zoom end')
    }

})
