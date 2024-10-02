// components/LoadingSpinner.js

import './LoadingSpinner.css'; // Import the CSS for the spinner

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading reports...</p>
        </div>
    );
};

export default LoadingSpinner;