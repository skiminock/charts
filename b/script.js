document.addEventListener("DOMContentLoaded", function () {
    var data = [
        {
            "State": "2018",
            "Under 5 Years": 2704659,
            "5 to 13 Years": 4499890
        },
        {
            "State": "2019",
            "Under 5 Years": 2027307,
            "5 to 13 Years": 3277946
        },
        {
            "State": "2020",
            "Under 5 Years": 1208495,
            "5 to 13 Years": 2141490,
        },
        {
            "State": "2021",
            "Under 5 Years": 1140516,
            "5 to 13 Years": 1938695,
        },
        {
            "State": "2022",
            "Under 5 Years": 894368,
            "5 to 13 Years": 1558919,
        },
        {
            "State": "2023",
            "Under 5 Years": 737462,
            "5 to 13 Years": 1345341,
        },
        {
            "State": "2024",
            "Under 5 Years": 737462,
            "5 to 13 Years": 1345341
        }
    ]

    var keys = ["Under 5 Years", "5 to 13 Years"];

    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", +svg.attr("height"));

    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#60C78D", "#33CCFF", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", () => { zoomed() });

    x0.domain(data.map(function(d) { return d.State; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
        .style('clip-path', 'url(#clip)')
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "barGroup")
        .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

    var xAxis = d3.axisBottom(x0);

    g.append("g")
        .style('clip-path', 'url(#clip)')
        .append("g")
        .attr("class", "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "axis--y")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Value");

    svg.call(zoom);

    function zoomed() {
        x0.range([0, width].map(d => d3.event.transform.applyX(d)));
        x1.rangeRound([0, x0.bandwidth()]);

        g.selectAll(".barGroup").attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });
        g.selectAll(".bar").attr("x", function(d) { return x1(d.key); }).attr("width", x1.bandwidth());

        g.select(".axis--x").call(xAxis);
    }
})