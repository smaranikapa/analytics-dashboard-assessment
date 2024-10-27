import React, { useState, useEffect, Suspense } from "react";
import Papa from "papaparse";
import { Container, Row, Col } from "react-bootstrap";
import { Pie, Bar, Line, Scatter } from "react-chartjs-2"; // Import both Pie and Bar components
import { Chart, registerables } from "chart.js"; // Import Chart and registerables from Chart.js
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const PieChart = React.lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Pie }))
);
const BarChart = React.lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Bar }))
);
const LineChart = React.lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Line }))
);
const ScatterChart = React.lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Scatter }))
);
// Register all necessary components, including scales
Chart.register(...registerables);
const Graph = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [makeChartData, setMakeChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [countyChartData, setCountyChartData] = useState({});
  const [cafvChartData, setCAFVChartData] = useState({});
  const [histogramData, setHistogramData] = useState({});
  const [scatterData, setScatterData] = useState({});
  const [barvsChartData, setBarVsChartData] = useState({});
  const [modelbarChartData, setModelBarChartData] = useState({});

  useEffect(() => {
    setIsLoading(true); // Set loading to true at the start of the effect
    Papa.parse("/data-to-visualize/Electric_Vehicle_Population_Data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        try {
          // Call preparation functions
          preparePieChartData(results.data);
          prepareBarChartData(results.data);
          prepareMakeChartData(results.data);
          prepareLineChartData(results.data);
          prepareCountyChartData(results.data);
          prepareCAFVPieChartData(results.data);
          prepareHistogramData(results.data);
          prepareScatterData(results.data);
          prepareBarVsChartData(results.data);
          prepareModelBarChartData(results.data);
        } catch (error) {
          console.error("Error processing data: ", error);
        } finally {
          setIsLoading(false); // End loading after 10 seconds
        }
        console.log("Data loaded: ", results.data);
      },
      error: (error) => {
        console.error("Error reading CSV: ", error);
        setIsLoading(false); // Set loading to false if there's an error
      },
    });
  }, []);

  const prepareBarVsChartData = (data) => {
    const districtCounts = {};

    // Count EVs in each legislative district
    data.forEach((row) => {
      const district = row["Legislative District"];
      if (district) {
        districtCounts[district] = (districtCounts[district] || 0) + 1;
      }
    });

    // Prepare data for bar chart
    setBarVsChartData({
      labels: Object.keys(districtCounts),
      datasets: [
        {
          label: "Number of EVs by Legislative District",
          data: Object.values(districtCounts),
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for the bars
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };
  const prepareModelBarChartData = (data) => {
    const modelCounts = {};

    // Count occurrences of each model
    data.forEach((row) => {
      const model = row.Model;
      if (model) {
        modelCounts[model] = (modelCounts[model] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const sortedModels = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Take top 5

    // Separate labels and counts
    const labels = sortedModels.map(([model]) => model);
    const counts = sortedModels.map(([, count]) => count);

    // Set up bar chart data
    setModelBarChartData({
      labels: labels,
      datasets: [
        {
          label: "Top 5 Best-Selling Models",
          data: counts,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    });
  };
  const prepareScatterData = (data) => {
    const points = [];

    // Populate scatter plot points
    data.forEach((row) => {
      const range = parseInt(row["Electric Range"], 10);
      const msrp = parseInt(row["Base MSRP"], 10);

      if (!isNaN(range) && !isNaN(msrp)) {
        points.push({ x: range, y: msrp });
      }
    });

    setScatterData({
      datasets: [
        {
          label: "MSRP vs. Electric Range",
          data: points,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointRadius: 4,
        },
      ],
    });
  };
  const prepareHistogramData = (data) => {
    // Define bins for electric ranges
    const bins = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    const binCounts = Array(bins.length - 1).fill(0);

    // Populate bins with electric range counts
    data.forEach((row) => {
      const range = parseInt(row["Electric Range"], 10);
      if (!isNaN(range)) {
        for (let i = 0; i < bins.length - 1; i++) {
          if (range >= bins[i] && range < bins[i + 1]) {
            binCounts[i] += 1;
            break;
          }
        }
      }
    });

    // Setup data for Chart.js
    setHistogramData({
      labels: bins
        .slice(0, -1)
        .map((start, index) => `${start}-${bins[index + 1]} miles`),
      datasets: [
        {
          label: "Vehicle Count",
          data: binCounts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };
  const prepareLineChartData = (data) => {
    const yearCounts = {};

    // Count occurrences of each model year
    data.forEach((row) => {
      const modelYear = row["Model Year"];
      if (modelYear) {
        yearCounts[modelYear] = (yearCounts[modelYear] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const sortedYears = Object.entries(yearCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Take top 5

    // Separate labels and counts
    const labels = sortedYears.map(([year]) => year);
    const counts = sortedYears.map(([, count]) => count);

    // Set up line chart data
    setLineChartData({
      labels: labels,
      datasets: [
        {
          label: "Top 5 Best-Selling Model Years",
          data: counts,
          fill: false,
          borderColor: "rgba(75, 192, 192, 0.8)",
          tension: 0.1, // Smoothing the line
        },
      ],
    });
  };
  const prepareCAFVPieChartData = (data) => {
    const eligibilityCounts = {
      "Eligibility unknown as battery range has not been researched": 0,
      "Clean Alternative Fuel Vehicle Eligible": 0,
      "Not eligible due to low battery range": 0,
    };

    // Count occurrences of each CAFV eligibility status
    data.forEach((row) => {
      const eligibilityStatus =
        row["Clean Alternative Fuel Vehicle (CAFV) Eligibility"];
      if (eligibilityCounts[eligibilityStatus] !== undefined) {
        eligibilityCounts[eligibilityStatus] += 1;
      }
    });

    // Prepare the pie chart data
    setCAFVChartData({
      labels: Object.keys(eligibilityCounts),
      datasets: [
        {
          data: Object.values(eligibilityCounts),
          backgroundColor: ["#ff9999", "#66b3ff", "#99ff99"], // Colors for each category
        },
      ],
    });
  };
  const prepareCountyChartData = (data) => {
    const countyCounts = {};

    // Count the number of vehicles per county
    data.forEach((row) => {
      const county = row.County;
      if (county) {
        countyCounts[county] = (countyCounts[county] || 0) + 1;
      }
    });

    // Sort counties by sales in descending order and take the top 10
    const sortedCounties = Object.entries(countyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Prepare the data for the chart
    setCountyChartData({
      labels: sortedCounties.map(([county]) => county),
      datasets: [
        {
          label: "Vehicle Sales by County",
          data: sortedCounties.map(([_, count]) => count),
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  };
  const preparePieChartData = (data) => {
    const vehicleCounts = {
      BEV: 0,
      PHEV: 0,
    };

    data.forEach((row) => {
      if (row["Electric Vehicle Type"] === "Battery Electric Vehicle (BEV)") {
        vehicleCounts.BEV += 1;
      } else if (
        row["Electric Vehicle Type"] ===
        "Plug-in Hybrid Electric Vehicle (PHEV)"
      ) {
        vehicleCounts.PHEV += 1;
      }
    });

    setPieChartData({
      labels: [
        "Battery Electric Vehicle (BEV)",
        "Plug-in Hybrid Electric Vehicle (PHEV)",
      ],
      datasets: [
        {
          data: [vehicleCounts.BEV, vehicleCounts.PHEV],
          backgroundColor: ["yellow", "red"], // Colors for each vehicle type
        },
      ],
    });
  };

  const prepareBarChartData = (data) => {
    const vehicleCounts = {
      BEV: 0,
      PHEV: 0,
    };

    data.forEach((row) => {
      if (row["Electric Vehicle Type"] === "Battery Electric Vehicle (BEV)") {
        vehicleCounts.BEV += 1;
      } else if (
        row["Electric Vehicle Type"] ===
        "Plug-in Hybrid Electric Vehicle (PHEV)"
      ) {
        vehicleCounts.PHEV += 1;
      }
    });

    setBarChartData({
      labels: [
        "Battery Electric Vehicle (BEV)",
        "Plug-in Hybrid Electric Vehicle (PHEV)",
      ],
      datasets: [
        {
          label: "Number of Vehicles",
          data: [vehicleCounts.BEV, vehicleCounts.PHEV],
          backgroundColor: ["yellow", "green"], // Same colors for consistency
        },
      ],
    });
  };

  const prepareMakeChartData = (data) => {
    const makesToShow = [
      "TESLA",
      "FORD",
      "NISSAN",
      "BMW",
      "CHEVROLET",
      "VOLVO",
      "KIA",
    ];
    const makeCounts = {};
    // Define fixed colors for each make
    const fixedColors = {
      TESLA: "rgba(255, 99, 132, 0.6)", // Pink
      FORD: "rgba(54, 162, 235, 0.6)", // Blue
      NISSAN: "rgba(255, 255, 0, 0.6)", // Yellow
      BMW: "rgba(75, 192, 192, 0.6)", // Teal
      CHEVROLET: "rgba(153, 102, 255, 0.6)", // Purple
      VOLVO: "rgba(0, 255, 0, 0.6)", // Orange
      KIA: "rgba(255, 205, 86, 0.6)", // Light Yellow
    };
    // Count occurrences of each specified make
    data.forEach((row) => {
      const make = row.Make; // Get the car make
      if (makesToShow.includes(make)) {
        // Check if the make is in the specified list
        makeCounts[make] = (makeCounts[make] || 0) + 1; // Increment the count for this make
      }
    });

    // Prepare data for the make chart only for specified makes
    setMakeChartData({
      labels: Object.keys(makeCounts),
      datasets: [
        {
          label: "Number of Vehicles by Make",
          data: Object.values(makeCounts),
          backgroundColor: Object.keys(makeCounts).map(
            (make) => fixedColors[make]
          ), // Use fixed colors for each make
        },
      ],
    });
  };
  return (
    <>
      {/* Charts Section */}
      <Container>
        <Row style={{ marginLeft: "20px" }}>
          {/* Pie Chart Section */}
          <Col md={6} style={{ marginTop: "20px", height: "300px" }}>
            {isLoading ? (
              // Skeleton Loader
              <Skeleton
                height={300}
                width={300}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              // Pie Chart when data is ready
              <>
                <Suspense
                  fallback={
                    <Skeleton
                      height={300}
                      width={300}
                      style={{ borderRadius: "50%" }}
                    />
                  }
                >
                  <h5>Electric Vehicle Type Distribution (Pie Chart)</h5>
                  <PieChart
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Suspense>
              </>
            )}
          </Col>

          {/* Bar Chart Section */}
          <Col md={6} style={{ marginTop: "20px", height: "300px" }}>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              barChartData.labels && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}>
                    <h5>Electric Vehicle Type Comparison (Bar Chart)</h5>
                    <BarChart
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </Suspense>
                </>
              )
            )}
          </Col>
        </Row>

        <Row
          style={{
            marginLeft: "20px",

            marginTop: "60px",
          }}
        >
          <Col md={6} style={{ marginTop: "20px", height: "400px" }}>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              makeChartData.labels && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}>
                    <h5>Vehicle Count by Make (Bar Chart)</h5>
                    <BarChart
                      data={makeChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                      style={{ height: "400px" }}
                    />
                  </Suspense>
                </>
              )
            )}
          </Col>
          <Col md={6} style={{ marginTop: "20px", height: "450px" }}>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              lineChartData.labels && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}>
                    <h5>Top 5 Best-Selling Model Years (Line Chart)</h5>
                    <LineChart
                      data={lineChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Vehicles Sold",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Model Year",
                            },
                          },
                        },
                      }}
                    />
                  </Suspense>
                </>
              )
            )}
          </Col>
        </Row>
        <Row
          style={{
            marginLeft: "20px",

            marginTop: "60px",
          }}
        >
          {/* Existing components and charts */}
          {/* County Sales Bar Chart */}
          <Col md={6} style={{ marginTop: "20px", height: "400px" }}>
            {isLoading ? (
              <Skeleton height={300} /> // Using Skeleton for loading state
            ) : (
              countyChartData.labels && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}>
                    <h5>Top 10 Counties by Vehicle Sales</h5>
                    <BarChart
                      data={countyChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Vehicles Sold",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "County",
                            },
                          },
                        },
                      }}
                      style={{ height: "400px" }}
                    />
                  </Suspense>
                </>
              )
            )}
          </Col>
          <Col md={6} style={{ height: "400px" }}>
            <div style={{ height: "400px" }}>
              {isLoading ? (
                <Skeleton
                  height={300}
                  width={300}
                  style={{ borderRadius: "50%" }}
                /> // Skeleton for loading state
              ) : (
                cafvChartData.labels && (
                  <>
                    <Suspense fallback={<Skeleton height={300} />}>
                      <h5>CAFV Eligibility Distribution</h5>
                      <PieChart
                        data={cafvChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </Suspense>
                  </>
                )
              )}
            </div>
          </Col>
        </Row>

        <Row
          style={{
            marginLeft: "20px",

            marginTop: "60px",
          }}
        >
          <Col md={6} style={{ height: "500px" }}>
            {isLoading ? (
              <Skeleton height={300} width={500} /> // Skeleton for loading state
            ) : (
              histogramData.labels && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}></Suspense>
                  <h5>Electric Range Distribution (Histogram)</h5>
                  <BarChart
                    data={histogramData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Electric Range (miles)",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Number of Vehicles",
                          },
                        },
                      },
                    }}
                  />
                </>
              )
            )}
          </Col>
          <Col md={6} style={{ height: "500px" }}>
            {isLoading ? (
              <Skeleton height={300} /> // Skeleton for loading state
            ) : (
              scatterData.datasets && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}></Suspense>
                  <h5>MSRP vs. Electric Range (Scatter Plot)</h5>
                  <Scatter
                    data={scatterData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Electric Range (miles)",
                          },
                          beginAtZero: true,
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Base MSRP (USD)",
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </>
              )
            )}
          </Col>
        </Row>
        <Row
          style={{
            marginLeft: "20px",

            marginTop: "60px",
          }}
        >
          <Col md={6} style={{ height: "400px" }}>
            <div style={{ height: "400px" }}>
              {isLoading ? (
                <Skeleton height={300} width={500} /> // Skeleton for loading state
              ) : (
                modelbarChartData.labels && (
                  <>
                    <Suspense fallback={<Skeleton height={300} />}></Suspense>
                    <h6>Top 5 Best-Selling Models (Bar Chart)</h6>
                    <BarChart
                      data={modelbarChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </>
                )
              )}
            </div>
          </Col>
          <Col md={6} style={{ height: "400px" }}>
            {isLoading ? (
              <Skeleton height={300} /> // Skeleton for loading state
            ) : (
              barChartData.labels && (
                <>
                  <Suspense fallback={<Skeleton height={300} />}></Suspense>
                  <h6>EV Distribution Across Legislative Districts</h6>
                  <BarChart
                    data={barvsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Legislative District",
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Number of EVs",
                          },
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </>
              )
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Graph;
