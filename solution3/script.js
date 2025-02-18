const width = 1500 - 200,
  height = 1000 - 200;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + 200)
  .attr("height", height + 200);

d3.csv("../data/observations.csv").then((oData) => {
  oData.map((d) => {
    d.angle = +d.angle;
    d.totaltime = formatTime(d.totaltime);
  });
  console.log(oData);
  d3.csv("../data/analysis.csv").then((aData) => {
    aData.map((d) => {
      d.minangle = +d.minangle;
      d.maxangle = +d.maxangle;
    });

    console.log(aData[0].minangle);

    const x = d3
      .scaleLinear()
      .domain([aData[0].minangle, aData[0].maxangle + 10])
      .range([0, width]);

    const y = d3.scaleLinear().domain([0, oData.length]).range([height, 0]);

    svg
      .append("g")
      .selectAll("dot")
      .data(oData)
      .join("circle")
      .attr("cx", (d) => x(d.angle + 10))
      .attr("cy", (_, i) => y(i))
      .attr("r", (d) => logScaling(d.totaltime));

    svg
      .selectAll("text")
      .data(oData)
      .join("text")
      .attr("dx", (d) => x(d.angle) + 15)
      .attr("dy", (_, i) => y(i) - 15)
      .text((d) => d.object)
      .attr("font-size", "18px")
      .attr("fill", "black");
  });
});

const formatTime = (t) => {
  const [h, m, s] = t.split(":").map(Number);
  return m;
};

const logScaling = (d) => {
  return Math.log(d + 1) * 5;
};
