import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Card, Container, Row, Col } from "react-bootstrap";

const Best = () => {
  const [bestSellingModelYear, setBestSellingModelYear] = useState({
    year: "",
    count: 0,
  });
  const [bestSellingModel, setBestSellingModel] = useState({
    model: "",
    count: 0,
  });
  const [bestSellingCounty, setBestSellingCounty] = useState("");
  const [bestSellingState, setBestSellingState] = useState("");
  const [mostPopularVehicleType, setMostPopularVehicleType] = useState({
    type: "Loading...",
    count: 0,
  });
  const [bestSellingCity, setBestSellingCity] = useState("Loading...");
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse("/data-to-visualize/Electric_Vehicle_Population_Data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data;
        setData(parsedData);

        // Calculate best-selling model year
        const bestYear = getBestSellingModelYear(parsedData);
        setBestSellingModelYear(bestYear);

        // Calculate best-selling model
        const bestModel = getBestSellingModel(parsedData);
        setBestSellingModel(bestModel);

        // Calculate best-selling county
        calculateBestSellingCounty(parsedData);

        setBestSellingState(getBestSellingState(parsedData));

        calculateMostPopularVehicleType(parsedData);

        calculateMostPopularVehicleType(parsedData);
        calculateBestSellingCity(parsedData);
      },
      error: (error) => {
        console.error("Error reading CSV: ", error);
      },
    });
  }, []);
  const calculateBestSellingCity = (data) => {
    const cityCounts = {};

    data.forEach((row) => {
      const city = row.City;
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    const bestCity = Object.keys(cityCounts).reduce((a, b) =>
      cityCounts[a] > cityCounts[b] ? a : b
    );

    setBestSellingCity(bestCity);
  };
  const calculateMostPopularVehicleType = (data) => {
    const vehicleTypeCounts = data.reduce((acc, row) => {
      const vehicleType = row["Electric Vehicle Type"];
      if (vehicleType) {
        acc[vehicleType] = (acc[vehicleType] || 0) + 1;
      }
      return acc;
    }, {});

    const mostPopularType = Object.keys(vehicleTypeCounts).reduce((a, b) =>
      vehicleTypeCounts[a] > vehicleTypeCounts[b] ? a : b
    );

    setMostPopularVehicleType({
      type: mostPopularType,
      count: vehicleTypeCounts[mostPopularType],
    });
  };
  const getBestSellingState = (data) => {
    const stateCounts = {};
    data.forEach((row) => {
      const state = row.State;
      if (state) {
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      }
    });
    return Object.keys(stateCounts).reduce((a, b) =>
      stateCounts[a] > stateCounts[b] ? a : b
    );
  };
  const getBestSellingModelYear = (data) => {
    const yearCounts = {};

    data.forEach((row) => {
      const modelYear = row["Model Year"];
      if (modelYear) {
        yearCounts[modelYear] = (yearCounts[modelYear] || 0) + 1;
      }
    });

    const bestSellingYear = Object.keys(yearCounts).reduce((a, b) =>
      yearCounts[a] > yearCounts[b] ? a : b
    );

    return { year: bestSellingYear, count: yearCounts[bestSellingYear] };
  };

  const getBestSellingModel = (data) => {
    const modelCounts = data.reduce((acc, row) => {
      const model = row.Model;
      if (model) {
        acc[model] = (acc[model] || 0) + 1;
      }
      return acc;
    }, {});

    const bestSellingModel = Object.keys(modelCounts).reduce(
      (bestModel, model) =>
        modelCounts[model] > (modelCounts[bestModel] || 0) ? model : bestModel,
      ""
    );

    return { model: bestSellingModel, count: modelCounts[bestSellingModel] };
  };

  const calculateBestSellingCounty = (data) => {
    const countyCounts = {};

    data.forEach((row) => {
      const county = row.County;
      if (county) {
        countyCounts[county] = (countyCounts[county] || 0) + 1;
      }
    });

    const bestCounty = Object.keys(countyCounts).reduce((a, b) =>
      countyCounts[a] > countyCounts[b] ? a : b
    );

    setBestSellingCounty(bestCounty);
  };

  return (
    <Container style={{ marginLeft: "25px", marginTop: "5px" }}>
      <Row className="mt-4 mb-4">
        <Col md={4}>
          <Card className="mb-4 mt-4 bg-dark text-light shadow-sm">
            <Card.Body>
              <Card.Title>Best-Selling Model Year</Card.Title>
              <Card.Text>
                Model Year:{" "}
                <strong>{bestSellingModelYear.year || "Loading..."}</strong>
              </Card.Text>
              <Card.Text>
                Total Sales:{" "}
                <strong>{bestSellingModelYear.count || "Loading..."}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 mt-4 bg-danger text-light shadow-sm">
            <Card.Body>
              <Card.Title>Best-Selling Model</Card.Title>
              <Card.Text>
                Model: {bestSellingModel.model || "Loading..."}
              </Card.Text>
              <Card.Text>
                Units Sold: {bestSellingModel.count || "Loading..."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 mt-4 bg-primary text-light shadow-sm">
            <Card.Body>
              <Card.Title>Best-Selling County</Card.Title>
              <Card.Text className="pt-4 pb-3">
                Best Selling County: {bestSellingCounty || "Loading..."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4 mb-4">
        <Col md={4}>
          <Card className="mb-4 mt-4 bg-dark text-light shadow-sm">
            <Card.Body>
              <Card.Title>Best-Selling State</Card.Title>
              <Card.Text className="pt-4 pb-3">
                Best Selling State {bestSellingState || "Loading..."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 mt-4 bg-danger text-light shadow-sm">
            <Card.Body>
              <Card.Title>Most Popular Vehicle Type</Card.Title>
              <Card.Text>
                Type: {mostPopularVehicleType.type || "Loading..."}
              </Card.Text>
              <Card.Text>
                Units Sold: {mostPopularVehicleType.count || "Loading..."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 mt-4 bg-info text-light shadow-sm">
            <Card.Body>
              <Card.Title>Best-Selling City</Card.Title>
              <Card.Text className="pt-4 pb-3">
                Best Selling City {bestSellingCity || "Loading..."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Best;
