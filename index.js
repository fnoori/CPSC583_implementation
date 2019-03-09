let filename = 'downtown_calgary_crime_stats.csv';
let crimeData;
let communities = [];

window.onload = () => {
  loadData(filename);
}

function loadData(filename) {
  d3.csv(filename)
    .then(data => {

      communities = extractCommunities(data);

      d3.select('body')
        .selectAll('div')
        .data(communities)
        .enter()
        .append('div')
        .text((d) => {
          return d;
        });


        let svgContainer = d3.select('body')
          .append('svg')
          .attr('width', 800)
          .attr('height', 800);

/*
      let svgContainer =
          d3.select('body')
            .append('svg')
            .attr('width', 800)
            .attr('height', 800);

      let circleSelection = svgContainer.append('circle')
            .attr('cx', 25)
            .attr('cy', 25)
            .attr('r', 5)
            .attr('text', 'Abbedale')
            .style('fill', 'purple');
*/
/*
var svgSelection = bodySelection.append("svg")
 4                                .attr("width", 50)
 5                                .attr("height", 50);
 6
 7var circleSelection = svgSelection.append("circle")
 8                                  .attr("cx", 25)
 9                                  .attr("cy", 25)
10                                  .attr("r", 25)
11                                  .style("fill", "purple");

      let circles =
          svgContainer.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')

      let circleAttributes =
          circles.attr('cx', 20)
                  .attr('cy', 20)
                  .attr('r', (d) => {

                  })
*/

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
