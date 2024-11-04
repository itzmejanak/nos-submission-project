// pages/reports.js

"use client";

import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";
import LoadingSpinner from "./components/LoadingSpinner"; // Import the spinner

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  if (loading) {
    return <LoadingSpinner />; // Use the loading spinner component
  }

  // Calculate totals
  const totalSubmitted = reports.filter((report) =>
    report.assignments.every((assignment) => assignment.status === "Submitted")
  ).length;

  const totalLate = reports.filter((report) =>
    report.assignments.every((assignment) => assignment.status === "Late")
  ).length;

  const totalNotSubmitted = reports.length - totalSubmitted - totalLate;

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
      {filteredReports.length === 0 ? (
        <p
          className="no-reports-message"
          style={{ color: "red", fontWeight: "900" }}
        >
          No reports found.
        </p>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) =>
            report.assignments.map((assignment, index) => {
              // Determine card color based on assignment status
              const status = assignment.status;
              const cardClass =
                status === "Submitted"
                  ? "report-card submitted"
                  : status === "Late"
                  ? "report-card late-submitted"
                  : "report-card not-submitted";

              return (
                <div className={cardClass} key={`${report.id}-${index}`}>
                  <h3 className="report-id">
                    ID: <span className="spanJi">{report.id}</span>
                  </h3>
                  <p className="assignment-name">
                    Assignment Name: <strong>{assignment.name}</strong>
                  </p>
                  <p className="assignment-status">
                    Status: <strong>{assignment.status}</strong>
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
