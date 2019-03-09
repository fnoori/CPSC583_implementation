let bubbleChart = () => {
  let width = 600;
  let height = 400;

  function chart(selection) {

  }

  chart.width = (value) => {
    if (!arguments.length) {
      return width;
    }
    width = value;

    return chart;
  }

  chart.height = (value) => {
    if (!arguments.length) {
      return height;
    }
    height = value;

    return chart;
  }

  return chart;
}
