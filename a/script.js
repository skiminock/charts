const height = 500
const width = 954
const margin = { top: 20, right: 0, bottom: 30, left: 40 }
const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

document.addEventListener("DOMContentLoaded", function () {

    const data = [
        { name: '1', value: 1 },
        { name: '2', value: 2 },
        { name: '3', value: 3 },
        { name: '4', value: 4 },
        { name: '5', value: 5 },
        { name: '6', value: 6 },
        { name: '7', value: 7 },
        { name: '8', value: 8 },
        { name: '9', value: 9 },
        { name: '10', value: 10 },

        { name: '11', value: 11 },
        { name: '12', value: 2 },
        { name: '13', value: 3 },
        { name: '14', value: 4 },
        { name: '15', value: 5 },
        { name: '16', value: 6 },
        { name: '17', value: 7 },
        { name: '18', value: 8 },
        { name: '19', value: 9 },
        { name: '20', value: 10 },
    ]

    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())

    d3.create("svg")
        .attr("viewBox", [0, 0, width, height])

    d3.select('svg')
        .append("g")
        .attr("class", "bars")
        .attr("fill", "#33CCFF")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    d3.select('svg').append("g")
        .attr("class", "x-axis")
        .call(xAxis);

    d3.select('svg').append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    d3.select('svg')
        .call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", () => { zoomed() })
        )

    function zoomed() {
        x.range([margin.left, width - margin.right].map(d => d3.event.transform.applyX(d)));
        d3.select('svg').selectAll(".bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
        d3.select('svg').selectAll(".x-axis").call(xAxis);
    }

})
