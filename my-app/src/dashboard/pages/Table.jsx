import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Table as BootstrapTable, Container, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton"; // Import the Skeleton component
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

const Table = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const rowsPerPage = 100;

  useEffect(() => {
    Papa.parse("/data-to-visualize/Electric_Vehicle_Population_Data.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        setIsLoading(false); // Set loading to false once data is loaded
        console.log("Loaded Data", results.data);
      },
      error: (error) => {
        console.error("Error reading CSV: ", error);
        setIsLoading(false); // Set loading to false even on error
      },
    });
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / rowsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Calculate the index range for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Container>
      <div className="table-container ms-4">
        {isLoading ? ( // Show Skeleton if loading
          <Skeleton count={10} height={50} style={{ margin: "10px 0" }} />
        ) : (
          <BootstrapTable striped bordered hover className="table-primary">
            <thead>
              <tr>
                <th>VIN</th>
                <th>City</th>
                <th>County</th>
                <th>State</th>
                <th>CAFV Eligibility</th>
                <th>DOL Vehicle ID</th>
                <th>Electric Range</th>
                <th>Electric Utility</th>
                <th>Vehicle Type</th>
                <th>Legislative District</th>
                <th>Make</th>
                <th>Model</th>
                <th>Model Year</th>
                <th>Postal Code</th>
                <th>Vehicle Location</th>
                <th>Census Tract</th>

                <th>Base MSRP</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr key={index}>
                  <td>{row["VIN (1-10)"]}</td>
                  <td>{row.City}</td>
                  <td>{row.County}</td>
                  <td>{row.State}</td>
                  <td>
                    {row["Clean Alternative Fuel Vehicle (CAFV) Eligibility"]}
                  </td>
                  <td>{row["DOL Vehicle ID"]}</td>
                  <td>{row["Electric Range"]}</td>
                  <td>{row["Electric Utility"]}</td>
                  <td>{row["Electric Vehicle Type"]}</td>
                  <td>{row["Legislative District"]}</td>
                  <td>{row.Make}</td>
                  <td>{row.Model}</td>
                  <td>{row["Model Year"]}</td>
                  <td>{row["Postal Code"]}</td>

                  <td>{row["Vehicle Location"]}</td>
                  <td>{row["2020 Census Tract"]}</td>
                  <td>{row["Base MSRP"]}</td>
                </tr>
              ))}
            </tbody>
          </BootstrapTable>
        )}
        {!isLoading && (
          <div className="pagination-controls mt-3">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous Page
            </Button>
            <span className="mx-2">Page {currentPage}</span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
            >
              Next Page
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Table;
