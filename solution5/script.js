const width = 1500,
  height = 1000;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.csv("../data/observations.csv").then((oData) => {
  oData.map((d) => {
    d.angle = +d.angle;
    d.timestamp = d3.timeParse("%H:%M:%S")(d.timestamp);
    d.totaltime = formatTime(d.totaltime);
  });
  console.log(oData);
  d3.csv("../data/analysis.csv").then((aData) => {
    aData.map((d) => {
      d.minangle = +d.minangle;
      d.maxangle = +d.maxangle;
      d.mintime = formatTime(d.mintime);
      d.maxtime = formatTime(d.maxtime);
    });

    console.log(aData[0].minangle);

    const x = d3
      .scaleTime()
      .domain([
        d3.min(oData, (d) => d.timestamp),
        d3.max(oData, (d) => d.timestamp),
      ])
      .range([100, width - 20]);

    const objectTypes = [...new Set(oData.map((d) => d.object))];
    const y = d3
      .scaleBand()
      .domain(objectTypes)
      .range([50, height - 50]);

    const aInfo = aData[0];

    const sizeScale = d3
      .scaleLinear()
      .domain([aInfo.mintime, aInfo.maxtime])
      .range([10, 30]);

    const colors = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A8",
      "#FFD700",
      "#FF8C00",
      "#8A2BE2",
      "#00CED1",
      "#DC143C",
      "#32CD32",
      "#FF4500",
      "#1E90FF",
      "#9400D3",
      "#00FA9A",
      "#FF1493",
      "#2E8B57",
    ];

    const colorScale = d3.scaleOrdinal().domain(objectTypes).range(colors);

    svg
      .selectAll("dots")
      .data(oData)
      .join("circle")
      .attr("cx", (d) => x(d.timestamp))
      .attr("cy", (d) => y(d.object))
      .attr("r", (d) => sizeScale(d.totaltime))
      .attr("fill", (d) => colorScale(d.object));

    svg
      .selectAll("text")
      .data(oData)
      .join("text")
      .attr("dx", 0)
      .attr("dy", (d) => y(d.object))
      .text((d) => d.object)
      .attr("font-size", "24px");
  });
});

const formatTime = (t) => {
  const [h, m, s] = t.split(":").map(Number);
  return m;
};
