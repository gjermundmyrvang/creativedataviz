const width = 1500,
  height = 1000;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.csv("../../data/observations.csv").then((oData) => {
  oData.map((d) => {
    d.angle = +d.angle;
    d.totaltime = formatTime(d.totaltime);
  });
  console.log(oData);
  d3.csv("../../data/analysis.csv").then((aData) => {
    aData.map((d) => {
      d.minangle = +d.minangle;
      d.maxangle = +d.maxangle;
    });

    console.log(aData[0].minangle);

    const numObjects = oData.reduce((acc, d) => {
      if (!acc[d.object]) {
        acc[d.object] = 0;
      }
      acc[d.object] += 1;
      return acc;
    }, {});

    console.log(numObjects);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(numObjects))])
      .range([0, width]);

    const typesOfObjects = [...new Set(oData.map((d) => d.object))];

    console.log(typesOfObjects);

    const y = d3
      .scaleBand()
      .domain(typesOfObjects)
      .range([height - 50, 50]);

    const ordinalHexColors = [
      "#FFD700",
      "#C0C0C0",
      "#CD7F32",
      "#228B22",
      "#0000FF",
      "#800080",
      "#FF4500",
      "#8B0000",
      "#708090",
      "#2F4F4F",
    ];

    const colorScale = d3
      .scaleOrdinal()
      .domain(typesOfObjects)
      .range(ordinalHexColors);

    svg
      .append("g")
      .selectAll("rect")
      .data(oData)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.object))
      .attr("width", (d) => x(numObjects[d.object]))
      .attr("height", height / typesOfObjects.length)
      .attr("fill", (d) => colorScale(d.object));

    svg
      .selectAll("text")
      .data(oData)
      .join("text")
      .attr("dx", 15)
      .attr("dy", (d) => y(d.object) + 100)
      .text((d) => d.object)
      .attr("font-size", "22px")
      .attr("font-weight", "bold");
  });
});

const formatTime = (t) => {
  const [h, m, s] = t.split(":").map(Number);
  return m;
};
