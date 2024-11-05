"use client"
import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";
import LoadingSpinner from "./components/LoadingSpinner"; // Import the spinner

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // You can adjust this number as needed

  useEffect(() => {
    const getReports = async () => {
      document.title = "Nos Checker";
      const result = await fetchData();
      setReports(result);
      setLoading(false);
    };

    getReports();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  // Filtered reports based on search term
  const filteredReports = reports.filter((report) =>
    report.assignments.some(
      (assignment) =>
        assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toString().includes(searchTerm) ||
        assignment.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />; // Use the loading spinner component
  }

  // Calculate totals by iterating through assignments
  const totalSubmitted = reports.reduce((acc, report) => {
    return (
      acc +
      report.assignments.filter((assignment) => assignment.status === "Submitted").length
    );
  }, 0);

  const totalLate = reports.reduce((acc, report) => {
    return (
      acc +
      report.assignments.filter((assignment) => assignment.status === "Late").length
    );
  }, 0);

  const totalNotSubmitted = reports.reduce((acc, report) => {
    return (
      acc +
      report.assignments.filter((assignment) => assignment.status === "NotSubmitted").length
    );
  }, 0);

  return (
    <div className="reports-container">
      <h1 className="heading-title">Check NOS Submission</h1>
      <input
        type="text"
        placeholder="Search by assignment name or report ID"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      
      {/* Totals with Inline Explanations */}
      <div className="info-tab">
        <div className="totals">
          <div className="calculateText">
            <p className="total-submitted">
              Total Submitted: {totalSubmitted + totalLate} <span className="emojiIcon">ⓘ</span>
            </p>
            <span className="hover-view">Submitted + Late</span>
          </div>
          
          <div className="calculateText">
            <p className="total-not-submitted">
              Not Submitted: {totalNotSubmitted} <span className="emojiIcon">ⓘ</span>
            </p>
            <span className="hover-view1">Length - (Late + Submitted)</span>
          </div>
          
          <div className="calculateText">
            <p className="total-late">Total Late: {totalLate} <span className="emojiIcon">ⓘ</span></p>
            <span className="hover-view2">Length - Total Submitted</span>
          </div>
        </div>
  
        {/* Guide for Status Types */}
        <div className="guide">
          <div className="box">
            <div className="box-item"></div>
            <p className="color-guide">Submitted</p>
          </div>
  
          <div className="box">
            <div className="box-item1"></div>
            <p className="color-guide">Not submitted</p>
          </div>
  
          <div className="box">
            <div className="box-item2"></div>
            <p className="color-guide">Late</p>
          </div>
        </div>
      </div>
  
      {/* Conditional Display for Reports */}
      {currentItems.length === 0 ? (
        <p className="no-reports-message" style={{ color: "red", fontWeight: "900" }}>
          No reports found.
        </p>
      ) : (
        <div className="reports-list">
          {currentItems.map((report) => (
            <div className="report-group" key={report.id}>
              {/* Report ID Section */}
              <h3 className="report-id">
                Report ID: <span className="spanJi">{report.id}</span>
              </h3>
  
              {/* Assignment List */}
              <div className="assignment-list">
                {report.assignments.map((assignment, index) => {
                  const status = assignment.status;
                  const cardClass =
                    status === "Submitted"
                      ? "assignment-card submitted"
                      : status === "Late"
                      ? "assignment-card late-submitted"
                      : "assignment-card not-submitted";
  
                  return (
                    <div className={`${cardClass} assignment`} key={`${report.id}-${index}`}>
                      <p className="assignment-name">
                        Name: <strong>{assignment.name}</strong>
                      </p>
                      <p className="assignment-status">
                        Status: <span className="status-tag">{status}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="prev-button"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredReports.length / itemsPerPage)}
          className="next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;