// ReportDetail.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import reportService from '../services/reportService';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCaption } from '../common/table';

type ReportDataType = Record<
    string,
    Record<
        string,
        {
            close: number;
            open: number;
            high: number;
            low: number;
            volume: number;
        }
    >
>;

const ReportData: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState<ReportDataType>({});
    const [loading, setLoading] = useState<any>(true);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = Object.entries(reportData).slice(indexOfFirstItem, indexOfLastItem);
    const [formUpdate, setFormUpdate] = useState<boolean>(false);

    const [formData, setFormData] = useState<any>({
        // Initialize the form data with the existing report details
        // You can update this based on your actual report structure
        name: '',
        date_start: '',
        date_end: '',
        metric: '',
        tickers: [],
        // Add more fields as needed
    });

    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
        }, 100);
        const fetchData = async (): Promise<void> => {
            try {
                const response = await reportService.getReportById(id);
                setReportData(response);
                setFormData({
                    name: response.name,
                    date_start: response.date_start,
                    date_end: response.date_end,
                    metric: response.metric,
                    tickers: response.tickers,
                    // Update with more fields as needed
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };
        setFormUpdate(false);
        void fetchData();
    }, [id, formUpdate]);

    const handleFormSubmit = (event: React.FormEvent): any => {
        event.preventDefault();
        // Use ReportService to update the report data
        // Update the ReportService import based on your actual structure
        reportService
            .updateReportData(id, formData)
            .then(() => {
                // Optionally, you can redirect the user or perform additional actions
                setFormUpdate(true);
            })
            .catch((error) => {
                console.error('Error updating report data:', error);
            });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): any => {
        const { name, value } = event.target;
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await reportService.getReportDataById(id);
                setReportData(response);
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };
        void fetchData(); // Invoking the fetchData function when the component mounts or when formUpdate changes
    }, [formUpdate]);

    return (
        <div>
            {/* <h2>Edit Report</h2> */}
            <form onSubmit={handleFormSubmit}>
                {/* Add form fields based on your actual report structure */}
                <div>
                    <label>Name: </label>
                    <input type="text" name="name" placeholder={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Start Date: </label>
                    <input type="text" name="date_start" placeholder={formData.date_start} onChange={handleInputChange} />
                </div>
                <div>
                    <label>End Date: </label>
                    <input type="text" name="date_end" placeholder={formData.date_end} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Metric: </label>
                    <input type="text" name="metric" placeholder={formData.metric} onChange={handleInputChange} />
                </div>
                <button type="submit" style={{ color: 'green' }}>
                    Update report
                </button>
            </form>

            {loading === true ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : (
                <div>
                    <br />
                    <hr />

                    <br />
                    <Table>
                        <TableCaption>
                            Report Data for: {formData.name}, {formData.date_start.slice(0, 10)} - {formData.date_end.slice(0, 10)}
                        </TableCaption>
                        <TableBody>
                            {currentData.map(([date, rowData]) => (
                                <TableRow key={date}>
                                    <TableCell>{date}</TableCell>
                                    {Object.entries(rowData).map(([ticker, { close, open, high, low, volume }]) => (
                                        <React.Fragment key={ticker}>
                                            <TableCell>{`${ticker} Open`}</TableCell>
                                            <TableCell>{open as unknown as React.ReactNode}</TableCell>
                                            <TableCell>{`${ticker} Close`}</TableCell>
                                            <TableCell>{close as unknown as React.ReactNode}</TableCell>
                                            <TableCell>{`${ticker} High`}</TableCell>
                                            <TableCell style={{ color: 'green' }}>{high as unknown as React.ReactNode}</TableCell>
                                            <TableCell>{`${ticker} Low`}</TableCell>
                                            <TableCell style={{ color: 'red' }}>{low as unknown as React.ReactNode}</TableCell>
                                            <TableCell>{`${ticker} Volume`}</TableCell>
                                            <TableCell>{volume as unknown as React.ReactNode}</TableCell>
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* Pagination */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
                            }}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span style={{ margin: '0 10px' }}>
                            Page {currentPage} of {Math.ceil(Object.keys(reportData).length / itemsPerPage)}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(Object.keys(reportData).length / itemsPerPage)));
                            }}
                            disabled={indexOfLastItem >= Object.keys(reportData).length}
                        >
                            Next
                        </button>
                    </div>
                    <Link to="/">
                        <div style={{ color: 'lightblue' }}>Back to all reports</div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ReportData;
