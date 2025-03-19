const width = 1500 - 200,
  height = 1000 - 200;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + 200)
  .attr("height", height + 200);

const bgImage = svg
  .append("image")
  .attr("width", width + 200)
  .attr("height", height + 200)
  .attr("xlink:href", "images/sea.jpg");

let data;
let datanodes;
let datalinks;
let simulation;
let nodes;

const ordinalHexColors = [
  "#00FF2F",
  "#00FFEA",
  "#e63946",
  "#BB0070",
  "#f4a261",
];

d3.csv("data.csv")
  .then((d) => {
    d.map((e) => {
      e.population = +e.population;
    });
    data = d;
  })
  .then(() => {
    prep();
  })
  .then(() => {
    draw();
  });

const prep = () => {
  const nodeSet = new Set();
  data.forEach((d) => {
    nodeSet.add(d.source);
    nodeSet.add(d.target);
  });

  nodes = data.reduce((acc, d) => {
    if (!acc[d.source]) {
      acc[d.source] = {};
    }
    if (!acc[d.target]) {
      acc[d.target] = {};
    }
    acc[d.source] = d;
    acc[d.target] = d;
    return acc;
  }, {});

  datanodes = Array.from(nodeSet).map((id) => ({ id }));

  datalinks = data.map((d) => ({
    source: d.source,
    target: d.target,
    relation: d.relationship,
  }));
};

const draw = () => {
  console.log(data);
  console.log("Nodes:", datanodes);
  console.log("Nodes2:", nodes);
  console.log("Links:", datalinks);

  simulation = d3
    .forceSimulation(datanodes)
    .force(
      "link",
      d3
        .forceLink(datalinks)
        .id((d) => d.id)
        .distance(250)
    )
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const relations = [...new Set(datalinks.map((d) => d.relation))];
  const colorScale = d3
    .scaleOrdinal()
    .domain(relations)
    .range(ordinalHexColors);

  const link = svg
    .append("g")
    .selectAll("line")
    .data(datalinks)
    .join("line")
    .attr("stroke", (d) => colorScale(d.relation))
    .attr("class", "link");

  const node = svg
    .append("g")
    .selectAll("nodes")
    .data(datanodes)
    .join("image")
    .attr("xlink:href", (_, i) => `images/whales/${i}.png`)
    .attr("width", 200)
    .attr("height", 200)
    .attr("style", "cursor: pointer")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("click", (event, d) => showPopup(event, nodes[d.id]));

  const labels = svg
    .append("g")
    .selectAll("text")
    .data(datanodes)
    .join("text")
    .attr("text-anchor", "middle")
    .attr("dy", 120)
    .attr("class", "labels")
    .text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("x", (d) => d.x - 100) // Offset by half width to center image
      .attr("y", (d) => d.y - 100);

    labels
      .attr("x", (d) => d.x) // Center the label on the image
      .attr("y", (d) => d.y - 70);
  });
};

const pop = document.getElementById("popup");

const showPopup = (event, d) => {
  console.log(d);
  pop.innerText = `Population: ${d.population}`;
  pop.style.display = "block";
  pop.style.left = `${event.pageX + 10}px`;
  pop.style.top = `${event.pageY + 10}px`;
};

const dragstarted = (event, d) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragged = (event, d) => {
  d.fx = event.x;
  d.fy = event.y;
};

const dragended = (event, d) => {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
};
