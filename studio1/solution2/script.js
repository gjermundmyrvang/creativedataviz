const width = 1500 - 200,
  height = 1000 - 200;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + 200)
  .attr("height", height + 200);

d3.csv("../../data/observations.csv").then((oData) => {
  oData.map((d) => {
    d.angle = +d.angle;
  });
  d3.csv("../../data/analysis.csv").then((aData) => {
    aData.map((d) => {
      d.minangle = +d.minangle;
      d.maxangle = +d.maxangle;
    });

    const colors = ["#87CEEB", "#673AB7", "#FF6F61", "#2ECC71", "#FFC107"];

    const groupedData = oData.reduce((acc, d) => {
      if (!acc[d.object]) {
        acc[d.object] = [];
      }
      acc[d.object].push(d);
      return acc;
    }, {});

    console.log(groupedData);

    const length = Object.keys(groupedData).length;
    Object.entries(groupedData).forEach((d, i) => {
      const x = (i + 1) * (width / length);
      const elements = d[1];
      svg
        .selectAll("dot")
        .append("g")
        .data(d)
        .join("circle")
        .attr("cx", x)
        .attr("cy", height / 2)
        .attr("r", elements.length * 10)
        .style("fill", colors[i]);

      svg
        .append("text")
        .attr("x", x)
        .attr("y", height / 2 - elements.length * 10 - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .text(d[0]);
    });
  });
});
