// components/AllReports.tsx
import React, { useState, useEffect } from 'react';
import { isNamedExports } from 'typescript';
import { useNavigate, Link } from 'react-router-dom';
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
                setAllReports(response);
                setReportCount((response.length as number) + 1);
            } catch (error) {
                console.error(error);
            }
        };
        void fetchData(); // Mark the promise as ignored with the `void` operator
    }, []);

    useEffect(() => {
        if (reportCount >= 1) {
            const fetchData = async (): Promise<void> => {
                try {
                    const response = await reportService.getAllReports();
                    setAllReports(response);
                } catch (error) {
                    console.error(error);
                }
            };
            void fetchData(); // Mark the promise as ignored with the `void` operator
        }
    }, [reportCount]);

    const handleDeleteReport = async (id: number): Promise<void> => {
        try {
            await reportService.deleteReport(id);
            setAllReports((prevReports) => prevReports.filter((report: Report) => report.id !== id));
            setReportCount(reportCount - 1);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteReportWrapper = (id: number): void => {
        handleDeleteReport(id).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <CreateReport reportCount={reportCount} setReportCount={setReportCount} />
                <AlertDescription>
                    <Link to="/calendar" style={{ color: 'navy', alignSelf: 'flex-start' }}>
                        Beta: Try Calendar view!
                    </Link>
                </AlertDescription>
            </div>
            <br />
            <hr />
            <br />
            <h2 className="font-medium">Saved Reports</h2>
            <ul>
                {allReports !== null && allReports !== undefined && allReports.length > 0 ? (
                    allReports.map((report: Report) => (
                        <li key={report.id}>
                            <div>
                                <Link className="underline" style={{ color: 'blue' }} to={`/reports/${report.id}`}>
                                    {report.id}. {report.name}
                                </Link>
                            </div>
                            {/* Add more details as needed */}
                            <div>Start Date: {report.date_start}</div>
                            <div>End Date: {report.date_end}</div>
                            <div>Metric: {report.metric}</div>
                            {/* Add more details as needed */}

                            <button
                                style={{ color: 'red', fontSize: '12px' }}
                                type="button"
                                onClick={() => {
                                    handleDeleteReportWrapper(report.id);
                                }}
                            >
                                <span style={{ border: '.5px solid red', padding: '2px', marginBottom: '1px' }}>X Delete report</span>
                            </button>

                            <hr />
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
