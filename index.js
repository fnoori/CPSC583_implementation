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
      .size([500,500]);

  let rootNode = d3.hierarchy(communityJSON);
  rootNode.sum((d) => {
    let value = d[chosenMonth] === undefined ? undefined : d[chosenMonth];
    return value;
  });

  packLayout(rootNode);

  let node = d3.selectAll('g circle')
    .data(rootNode.descendants())
    .transition()
    .duration(1000)
    .attr('cx', (d) => { return d.x; })
    .attr('cy', (d) => { return d.y; })
    .attr('r', (d) => { return d.r; });

  let text = d3.selectAll('g text')
    .data(rootNode.descendants())
    .transition()
    .duration(1000)
    .text((d) => {
      if (d['data'][chosenMonth]) {
        return d['parent']['data']['Category'];
      }
    })
    .style('font-size', function(d) {
      setTimeout(() => {
        console.log(this.getComputedTextLength());
        return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 12) + 'px';
      }, 4000);
    })
    .attr('x', (d) => { return d.x; })
    .attr('y', (d) => { return d.y; })
    .style('fill', 'white')
    .style('text-anchor', 'middle');
}

async function loadData(filename) {
  let communityChosen = document.getElementById('communityInput').value;

  if (crimeData === undefined) {
    crimeData = await d3.csv(filename);
  }

  communityData = [];
  crimeData.forEach(row => {
    if (row.CommunityName === communityChosen) {
      communityData.push(row);
    }
  });

  communityJSON = {
    'City': 'Calgary',
    'children': []
  };
  communityData.forEach((row) => {
    let January = row.January === undefined ? 0 : row.January;
    let February = row.February === undefined ? 0 : row.February;
    let March = row.March === undefined ? 0 : row.March;
    let April = row.April === undefined ? 0 : row.April;
    let May = row.May === undefined ? 0 : row.May;
    let June = row.June === undefined ? 0 : row.June;
    let July = row.July === undefined ? 0 : row.July;
    let August = row.August === undefined ? 0 : row.August;
    let September = row.September === undefined ? 0 : row.September;
    let October = row.October === undefined ? 0 : row.October;
    let November = row.November === undefined ? 0 : row.November;
    let December = row.December === undefined ? 0 : row.December;

    communityJSON.children.push({
      'CommunityName': row.CommunityName,
      'children': [
        {
          'Category': row.Category,
          'children': [
            {'January': January},
            {'February': February},
            {'March': March},
            {'April': April},
            {'May': May},
            {'June': June},
            {'July': July},
            {'August': August },
            {'September': September},
            {'October': October},
            {'November': November},
            {'December': December}
          ]
        }
      ]
    });
  });

  d3.selectAll("svg > *").remove();

  initCircles();
}

function initCircles() {
  let packLayout =
    d3.pack()
      .size([500,500]);

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
    .text((d) => {
      if (d['data']['January']) {
        return d['parent']['data']['Category'];
      }
    })
    .style('font-size', function(d) {
      console.log(this.getComputedTextLength());
      return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 12) + 'px';
    })
    .attr('x', (d) => { return d.x; })
    .attr('y', (d) => { return d.y; })
    .style('fill', 'white')
    .style('text-anchor', 'middle');

}

function extractCommunities(rawData) {
  let communities = [];

  for (var i = 0; i < rawData.length; i+=10) {
    communities.push(rawData[i].CommunityName);
  }

  return communities;
}
