
import { useRef, useEffect, useState, useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React helper functions
import gradientChartLine from "assets/theme/functions/gradientChartLine";

// GradientLineChart configurations
import configs from "examples/Charts/LineCharts/GradientLineChart/configs";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import { scale } from "chroma-js";




function GradientLineChart({ title, description, height, chart }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const { data, options } = chartData;

  const [chartHeight, setChartHeight] = useState(400);
  const [SoftHeight, setSoftHeight] = useState(400);
  const [chartWidth, setChartWidth] = useState("500%");

  useEffect(() => {
    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
          ...dataset,
          tension: 0.1,
       
          animation: {
            duration: 0,
            easing: 'easeInOutExpo'
          },
          pointRadius: 0,
          borderWidth: 3,
          fill: true,

          maxBarThickness: 6,
          backgroundColor: gradientChartLine(
            chartRef.current.children[0],
            colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main
          ),
        }))

      : [];
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setChartWidth("100%")
          setChartHeight("auto")
          setSoftHeight("300px")
        } else {
          setSoftHeight('100vh')
          setChartHeight('auto')
          setChartWidth('100%')
        }
     
      };
    
      window.addEventListener('resize', handleResize);
      handleResize();     


    setChartData(configs(chart.labels || [], chartDatasets));
  }, [chart]);

  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
          {title && (
            <SoftBox mb={1}>
              <SoftTypography variant="h6">{title}</SoftTypography>
            </SoftBox>
          )}
          <SoftBox mb={2}>
            <SoftTypography component="div" variant="button" fontWeight="regular" color="text">
              {description}
            </SoftTypography>
          </SoftBox>
        </SoftBox>

      ) : null}
      {useMemo(
        () => (
          <SoftBox ref={chartRef} sx={{ width: chartWidth, height: chartHeight }} >
            <Line options={options}   height={chartHeight} data={data} width={chartWidth} />
          </SoftBox>
        ),
        [chartData, height, chartHeight ]
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of GradientLineChart
GradientLineChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the GradientLineChart
GradientLineChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default GradientLineChart;
