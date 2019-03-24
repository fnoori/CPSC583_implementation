let filename = 'crime_by_community_2016_ONLY.csv';
let crimeData;
let communities = [];
const months = ["January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"];
let chosenMonth;
let communityData = [];
let communityJSON = {
  'City': 'Calgary',
  'children': []
};

const crimeColours = {
  'Assault (Non-domestic)': '#1abc9c',
  'Commercial Robbery': '#2ecc71',
  'Street Robbery': '#3498db',
  'Violence \'Other\' (Non-domestic)': '#9b59b6',
  'Residential Break & Enter': '#34495e',
  'Commercial Break & Enter': '#f1c40f',
  'Theft OF Vehicle': '#e67e22',
  'Theft FROM Vehicle': '#e74c3c',
  'Social Disorder': '#ecf0f1',
  'Physical Disorder': '#95a5a6'
};


window.onload = async () => {
  $('[data-toggle=popover]').popover();
  loadData(filename);
  document.getElementById('monthRange').value = 0;
  let calgary = await d3.json('calgary_topo.json');
  drawMap(calgary);
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
  let treemapLayout =
    d3.treemap()
      .size([500,500]);

  let root = d3.hierarchy(communityJSON);
  root.sum((d) => {
    let value = d[chosenMonth] === undefined ? undefined : d[chosenMonth];
    return value;
  });

  treemapLayout(root);

  let node = d3.selectAll('g rect')
    .data(root.descendants())
    .transition()
    .duration(500)
    .attr('x', (d) => { return d.x0; })
    .attr('y', (d) => { return d.y0; })
    .attr('width', function(d) { return d.x1 - d.x0; })
    .attr('height', function(d) { return d.y1 - d.y0; })
    .style('fill', (d) => {
      if ((d['parent'] != null )) {
        return crimeColours[d['parent']['data']['Category']]
      }
    });
}

function resetSlider() {
  let slider = document.getElementById('monthRange');
  let output = document.getElementById('chosenMonth');

  slider.value = 0;
  output.innerHTML = slider.value;
  output.innerHTML = months[slider.value];
  chosenMonth = months[slider.value];
}

async function loadData(filename) {
  let communityChosen = document.getElementById('communityChosen').innerHTML;

  resetSlider();

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

  d3.selectAll("#treeMapLayout > *").remove();

  initCircles();
}

function initCircles() {
  let treemapLayout =
    d3.treemap()
      .size([500,500]);

  let root = d3.hierarchy(communityJSON);
  root.sum((d) => {
    let value = d['January'] === undefined ? 0 : d['January'];
    return value;
  });

  treemapLayout.paddingInner(1);
  treemapLayout(root);

  var tooltip = d3.select("body")
          .append("div")
          .attr("class", "my-tooltip")//add the tooltip class
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden");

  let nodes = d3.select('svg')
    .selectAll('rect')
    .data(root.descendants());

  let g =
    nodes.enter()
    .append('g');

  g.append('rect')
    .attr('x', (d) => { return d.x0; })
    .attr('y', (d) => { return d.y0; })
    .attr('width', function(d) { return d.x1 - d.x0; })
    .attr('height', function(d) { return d.y1 - d.y0; })
    .style('fill', (d) => {
      if ((d['parent'] != null )) {
        return crimeColours[d['parent']['data']['Category']]
      }
    })
    .on('mouseover', (d) => {
      tooltip.style("visibility", "visible")
        .text(d.value)
    })
    .on('mousemove', () => {
      return tooltip.style('top', (d3.event.pageY - 40) + 'px').style('left', (d3.event.pageX - 5) + 'px');
    })
    .on('mouseout', () => {
      return tooltip.style('visibility', 'hidden');
    });
}

function extractCommunities(rawData) {
  let communities = [];

  for (var i = 0; i < rawData.length; i+=10) {
    communities.push(rawData[i].CommunityName);
  }

  return communities;
}

function drawMap(calgary) {
  const width = 500;
  const height = 500;
  const calgarySvg = d3.select("#calgaryMap");
  const myProjection = d3.geoMercator();
  const path = d3.geoPath().projection(myProjection);
  const graticule = d3.geoGraticule();

  calgarySvg.append("path")
    .datum(graticule.outline)
    .attr("class", "foreground")
    .attr("d", path);

  let communities = topojson.feature(calgary, calgary.objects.collection);
  let neighbors = topojson.neighbors(calgary.objects.collection.geometries);
  let communityBoundaries = topojson.mesh(calgary, calgary.objects.collection, function(a, b) {
      return a !== b;
  })

  myProjection
      .scale(1)
      .translate([0, 0]);

  let b = path.bounds(communities),
          s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
          t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  let communityChosenId = 'EauClaire';

  myProjection
      .scale(s)
      .translate(t);

  calgarySvg.selectAll('.communities')
      .data(communities.features)
      .enter().append('path')
      .attr('id', (d) => {
        return d['properties']['name'].replace(/ /g,'').replace(/\//g,'');
      })
      .attr('class', (d) => {
        return 'calgary-path';
      })
      .attr('d', path)
      .on('mouseover', (d) => {
        d3.select('#communityHighlighted').text(d['properties']['name'].toUpperCase());

        if (this.communityChosenId != d3.select(d3.event.target).attr('id')) {
          d3.select(d3.event.target).attr('class', 'calgary-path-mouseover');
        }
      })
      .on('mouseout', (d) => {
        if (d3.select(d3.event.target).attr('id') != this.communityChosenId) {
          d3.select(d3.event.target).attr('class', 'calgary-path');
        }

      })
      .on('click', (d) => {
        d3.select('.communityHover').text(d['properties']['name'].toUpperCase());
        d3.select('.communityHover').style('font-weight', 'bold');
        d3.select(d3.event.target).attr('class', 'calgary-path-click');

        if (this.communityChosenId != d3.select(d3.event.target).attr('id')) {
          d3.select(`#${this.communityChosenId}`).attr('class', 'calgary-path');
        }

        this.communityChosenId = d3.select(d3.event.target).attr('id');

        this.loadData();
      });
}
