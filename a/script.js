const height = 248
const width = 544
const margin = { top: 20, right: 40, bottom: 30, left: 40 }
const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

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
    const xScaleRange = data.length * (barWidth + barSpace);
    const barsRange = [margin.left, xScaleRange + margin.right]

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

    d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])

    d3.select('svg')
        .append('g')
        .attr('class', 'bars')
        .attr('fill', '#33CCFF')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.year)  + (barSpace / 2))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth() - barSpace)
        .attr('height', d => y(0) - y(d.value));

    d3.select('svg').append('g')
        .attr('class', 'x-axis')
        .call(xAxis);

    d3.select('svg').append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    d3.select('svg')
        .call(
            d3
                .zoom()
                .extent(extent)
                .scaleExtent([1, 1])
                //.translateExtent(extent)
                .on('zoom', zoomed)
        )

    function zoomed() {

        x.range(barsRange.map(d => d3.event.transform.applyX(d)));

        d3
            .select('svg')
            .selectAll('.bars rect')
            .attr('x', d => x(d.year) + (barSpace / 2))
            .attr('width', x.bandwidth() - barSpace);

        d3
            .select('svg')
            .selectAll('.x-axis')
            .call(xAxis);
    }

})
