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
      .size([300,300]);

  let rootNode = d3.hierarchy(communityJSON);
  rootNode.sum((d) => {
    let value = d[chosenMonth] === undefined ? 0 : d[chosenMonth];
    return value;
  });

  packLayout(rootNode);

  d3.selectAll('circle')
    .data(rootNode.descendants())
    .transition()
    .duration(1000)
    .attr('cx', (d) => { return d.x; })
    .attr('cy', (d) => { return d.y; })
    .attr('r', (d) => { return d.r; });

  /*
  var selectValue = d3.select('select').property('value')
  var data2 = data[selectValue]
  svg.selectAll('circle')
      .data(data2)
      .transition()
      .duration(1000)
      .attr('cx', function (d) { return d.cx })
      .attr('cy', function (d) { return d.cy })
      .attr('r', function (d) { return d.r })
      .attr('fill', function (d) { return d.fill })
  */
}

async function loadData(filename) {
  let communityChosen = document.getElementById('communityInput').value;
  console.log(communityChosen);

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

  let packLayout =
    d3.pack()
      .size([300,300]);

  let rootNode = d3.hierarchy(communityJSON);
  rootNode.sum((d) => {
    console.log(chosenMonth);
    let value = d['January'] === undefined ? 0 : d['January'];
    return value;
  });

  packLayout(rootNode);

  d3.select('svg g')
    .selectAll('circle')
    .data(rootNode.descendants())
    .enter()
    .append('circle')
    .attr('cx', (d) => { return d.x })
    .attr('cy', (d) => { return d.y })
    .attr('r', (d) => { return d.r });
}

function extractCommunities(rawData) {
  let communities = [];

  for (var i = 0; i < rawData.length; i+=10) {
    communities.push(rawData[i].CommunityName);
  }

  return communities;
}
