let filename = 'downtown_calgary_crime_stats.csv';
let crimeData;
let communities = [];
const SAMPLE_DATA = [
    { "month" : "January", "point" : [5, 20], "r" : 10 },
    { "month" : "February", "point" : [480, 90], "r" : 1 },
    { "month" : "March", "point" : [250, 50], "r" : 3 },
    { "month" : "April", "point" : [100, 33], "r" : 3 },
    { "month" : "May", "point" : [330, 95], "r" : 4 },
    { "month" : "June", "point" : [300, 40], "r" : 8 },
    { "month" : "July", "point" : [410, 35], "r" : 6 },
    { "month" : "August", "point" : [475, 44], "r" : 4 },
    { "month" : "September", "point" : [25, 67], "r" : 1 },
    { "month" : "October", "point" : [85, 21], "r" : 5 },
    { "month" : "November", "point" : [220, 88], "r" : 10 },
    { "month" : "December", "point" : [400, 4], "r" : 7 },
];
const WIDTH = 1000;
const HEIGHT = 300;
const PAD = 10;
const MARGIN = 50;

window.onload = () => {
  loadData(filename);
}

function loadData(filename) {
  d3.csv(filename)
    .then(data => {

      let xScale =
        d3.scaleLinear()
          .domain([0, d3.max(SAMPLE_DATA, (d) => { return d.point[0] })])
          .range([MARGIN, WIDTH-MARGIN]);

      let yScale =
        d3.scaleLinear()
          .domain([0, d3.max(SAMPLE_DATA, (d) => { return d.point[0] })])
          .range([MARGIN, WIDTH-MARGIN]);

      let sizeScale =
        d3.scalePow()
          .exponent(2)
          .domain([0, d3.max(SAMPLE_DATA, (d) => { return d.r })])
          .range([5, 50]);

      let svg =
        d3.select('body')
          .append('svg')
          .attr('width', WIDTH)
          .attr('height', HEIGHT);

      svg.selectAll('circle')
         .data(SAMPLE_DATA)
         .enter()
         .append('circle')
         .attr('cx', (d) => { return xScale(d.point[0]); })
         .attr('cy', (d) => { return yScale(d.point[1]); })
         .attr('r', (d) => { return sizeScale(d.r); })
         .style('fill', 'coral')
         .style('stroke', 'none');

      svg.selectAll('text')
         .data(SAMPLE_DATA)
         .enter()
         .append('text')
         .text((d) => { return d.month })
         .attr('x', (d) => { return xScale(d.point[0]) + sizeScale(d.r) + 2; })
         .attr('y', (d) => { return yScale(d.point[1]); })
         .attr('font-family', 'sans-serif')
         .attr('font-size', '11px')
         .attr('fill', 'teal')
         .style('text-anchor', 'start')
         .style('alignment-baseline', 'middle');


    }).catch(csvErr => {
      console.log(csvErr);
    });
}

function extractCommunities(rawData) {
  let communities = [];

  for (var i = 0; i < rawData.length; i+=10) {
    communities.push(rawData[i].CommunityName);
  }

  return communities;
}
