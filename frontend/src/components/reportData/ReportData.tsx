// ReportDetail.tsx

import React from 'react';
import { useParams } from 'react-router-dom';

const ReportData: React.FC = (): JSX.Element => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h2>Report Details</h2>
            <p>Display details for report with ID: {id}</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default ReportData;
