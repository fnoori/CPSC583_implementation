let filename = 'downtown_calgary_crime_stats.csv';
let crimeData;
let communities = [];
const WIDTH = 1000;
const HEIGHT = 300;
const PAD = 10;
const MARGIN = 50;
const months = ["January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"];
let chosenMonth;
let communityData = [];
let communityJSON = {
  'City': 'Calgary',
  'children': []
};

window.onload = () => {
  loadData(filename);
  document.getElementById('monthRange').value = 0;
}

function sliderChange() {
  let slider = document.getElementById('monthRange');
  let output = document.getElementById('chosenMonth');

  output.innerHTML = slider.value; // Display the default slider value
  output.innerHTML = months[slider.value];
  chosenMonth = months[slider.value];

  monthsSliderInteraction();
}


function monthsSliderInteraction() {
  let packLayout =
    d3.pack()
      .size([600,600]);

  let rootNode = d3.hierarchy(communityJSON);
  rootNode.sum((d) => {
    let value = d[chosenMonth] === undefined ? 0 : d[chosenMonth];
    return value;
  });

  packLayout(rootNode);

/*
  let node = d3.selectAll('circle')
    .data(rootNode.descendants())
    .transition()
    .duration(1000)
    .attr('cx', (d) => { return d.x; })
    .attr('cy', (d) => { return d.y; })
    .attr('r', (d) => { return d.r; });
*/
let node = d3.selectAll('g circle')
  .data(rootNode.descendants())
  .transition()
  .duration(1000)
  .attr('cx', (d) => { return d.x; })
  .attr('cy', (d) => { return d.y; })
  .attr('r', (d) => { return d.r; });

let text = d3.selectAll('g text')
  .data(rootNode.descendants())
  .text((d) => { return d['data']['Category'] === undefined ? '' : d['data']['Category']; })
  .attr('x', (d) => { return d.x; })
  .attr('y', (d) => { return d.y; })
  .style('fill', 'white')
  .style('text-anchor', 'middle')
  .style('font-size', (d) => {
    let category = d['data']['Category'] === undefined ? '' : d['data']['Category'];
    let len = category.length;
    let size = d.r/3;
    size *= 10 / len;
    size += 1;
    return Math.round(size)+'px';
  });

}

async function loadData(filename) {
  let communityChosen = document.getElementById('communityInput').value;

  data = await d3.csv(filename);

  data.forEach(row => {
    if (row.CommunityName === communityChosen) {
      communityData.push(row);
    }
  });

  communityData.forEach((row) => {
    communityJSON.children.push({
      'CommunityName': row.CommunityName,
      'children': [
        {
          'Category': row.Category,
          'children': [
            {'January': row.January},
            {'February': row.February},
            {'March': row.March},
            {'April': row.April},
            {'May': row.May},
            {'June': row.June},
            {'July': row.July},
            {'August': row.August },
            {'September': row.September},
            {'October': row.October},
            {'November': row.November},
            {'December': row.December}
          ]
        }
      ]
    });
  });

  initCircles();
}

function initCircles() {
  let packLayout =
    d3.pack()
      .size([600,600]);

  let rootNode = d3.hierarchy(communityJSON);
  rootNode.sum((d) => {
    let value = d['January'] === undefined ? 0 : d['January'];
    return value;
  });

  packLayout(rootNode);

  let nodes = d3.select('svg')
    .selectAll('circle')
    .data(rootNode.descendants());

  let g =
    nodes.enter()
    .append('g');

  g.append('circle')
    .attr('cx', (d) => { return d.x; })
    .attr('cy', (d) => { return d.y; })
    .attr('r', (d) => { return d.r })
    .style('fill', 'red');

  g.append('text')
    .text((d) => { return d['data']['Category'] === undefined ? '' : d['data']['Category']; })
    .attr('x', (d) => { return d.x; })
    .attr('y', (d) => { return d.y; })
    .style('fill', 'white')
    .style('text-anchor', 'middle')
    .style('font-size', (d) => {
      let category = d['data']['Category'] === undefined ? '' : d['data']['Category'];
      let len = category.length;
      let size = d.r/3;
      size *= 10 / len;
      size += 1;
      return Math.round(size)+'px';
    });

}

function extractCommunities(rawData) {
  let communities = [];

  for (var i = 0; i < rawData.length; i+=10) {
    communities.push(rawData[i].CommunityName);
  }

  return communities;
}
