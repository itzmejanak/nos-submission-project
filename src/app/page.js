// pages/reports.js

"use client";

import { useEffect, useState } from 'react';
import { fetchData } from '../utils/fetchData';
import LoadingSpinner from './components/LoadingSpinner'; // Import the spinner

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getReports = async () => {
            document.title = 'Nos Checker';
            const result = await fetchData();
            setReports(result.reports);
            setLoading(false);
        };

        getReports();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredReports = reports.filter(report =>
        report.assignments.some(assignment =>
            assignment.assignmentReport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.id.includes(searchTerm) ||
            assignment.assignmentReport.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (loading) {
        return <LoadingSpinner />; // Use the loading spinner component
    }

    // Calculate totals
    const totalSubmitted = reports.filter(report => 
        report.assignments.every(assignment => assignment.assignmentReport.status === 'Submitted')
    ).length;

    const totalNotSubmitted = reports.length - totalSubmitted;

    return (
        <div className="reports-container">
            <h1 className='heading-title'>Check NOS Submission</h1>
            <input
                type="text"
                placeholder="Search by assignment name or report ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <div className="info-tab">
                <div className="totals">
                    <p className="total-submitted">Total Submitted: {totalSubmitted}</p>
                    <p className="total-not-submitted">Total Not Submitted: {totalNotSubmitted}</p>
                </div>

                <div className="guide">
                    <div className='box'>
                        <div className='box-item'></div>
                        <p className='color-guide'>Submitted</p>
                    </div>

                    <div className='box'>
                        <div className='box-item1'></div>
                        <p className='color-guide'>Not submitted</p>
                    </div>

                    <div className='box'>
                        <div className='box-item2'></div>
                        <p className='color-guide'>Late</p>
                    </div>
                </div>

            </div>
            {filteredReports.length === 0 ? (
                <p className="no-reports-message" style={{ color: "red", fontWeight: "900" }}>No reports found.</p>
            ) : (
                <div className="reports-grid">
                    {filteredReports.map(report => (
                        report.assignments.map((assignment, index) => {
                            // Determine card color based on assignment status
                            const status = assignment.assignmentReport.status;
                            const cardClass = status === 'Submitted' 
                                ? 'report-card submitted' 
                                : status === 'Late' 
                                ? 'report-card late-submitted' 
                                : 'report-card not-submitted';

                            return (
                                <div className={cardClass} key={`${report.id}-${index}`}>
                                    <h3 className="report-id">ID: <span className='spanJi'>{report.id}</span></h3>
                                    <p className="assignment-name">Assignment Name: <strong>{assignment.assignmentReport.name}</strong></p>
                                    <p className="assignment-status">Status: <strong>{assignment.assignmentReport.status}</strong></p>
                                    <p className="assignment-content">Content: <strong>{assignment.assignmentReport.content}</strong></p>
                                </div>
                            );
                        })
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportsPage;