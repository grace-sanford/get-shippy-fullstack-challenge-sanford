// components/AllReports.tsx
import React, { useState, useEffect } from 'react';
import { isNamedExports } from 'typescript';
import { useNavigate } from 'react-router-dom';
import reportService from '../services/reportService';
import CreateReport from '../createReport/CreateReport';
import { Alert, AlertDescription } from '../common/alert';

interface Report {
    id: number;
    name: string;
    date_start: string;
    date_end: string;
    metric: string;
}

const AllReports: React.FC = (): JSX.Element => {
    const [allReports, setAllReports] = useState<Report[]>([]);
    const [reportCount, setReportCount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await reportService.getAllReports();
                console.log('response', response);
                setAllReports(response);
            } catch (error) {
                console.error(error);
            }
        };
        void fetchData(); // Mark the promise as ignored with the `void` operator
    }, []);

    useEffect(() => {
        if (reportCount > 1) {
            const fetchData = async (): Promise<void> => {
                try {
                    const response = await reportService.getAllReports();
                    console.log('response', response);
                    setAllReports(response);
                } catch (error) {
                    console.error(error);
                }
            };
            void fetchData(); // Mark the promise as ignored with the `void` operator
        }
        navigate('/');
    }, [reportCount]);

    const handleDeleteReport = async (id: number): Promise<void> => {
        try {
            await reportService.deleteReport(id);
            setAllReports((prevReports) => prevReports.filter((report: Report) => report.id !== id));
            // setReportCount(reportCount - 1);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteReportWrapper = (id: number): void => {
        handleDeleteReport(id).catch((error) => {
            console.error(error);
        });
    };

    console.log('allReports', allReports);
    console.log('reportCount', reportCount);
    return (
        <div>
            <CreateReport reportCount={reportCount} setReportCount={setReportCount} />
            <br />
            <hr />
            <br />
            <h2 className="font-medium">Saved Reports</h2>
            <ul>
                {allReports !== null && allReports !== undefined && allReports.length > 0 ? (
                    allReports.map((report: any) => (
                        <li key={report.id}>
                            {/* Render each report in the list */}
                            {/* Adjust the structure based on your actual report data */}
                            <div>
                                {report.id}. {report.name}
                            </div>
                            <div>Start Date: {report.date_start}</div>
                            <div>End Date: {report.date_end}</div>
                            <div>Metric: {report.metric}</div>
                            {/* Add more details as needed */}
                            <button
                                type="button"
                                onClick={() => {
                                    handleDeleteReportWrapper(report.id);
                                }}
                            >
                                X
                            </button>
                        </li>
                    ))
                ) : (
                    <Alert>
                        <AlertDescription>No reports yet</AlertDescription>
                    </Alert>
                )}
            </ul>
        </div>
    );
};

export default AllReports;