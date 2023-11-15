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
        }
    >
>;

const ReportData: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState<ReportDataType>({});
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
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };
        void fetchData();
    }, [id]);

    const handleFormSubmit = (event: React.FormEvent): any => {
        event.preventDefault();
        // Use ReportService to update the report data
        // Update the ReportService import based on your actual structure
        reportService
            .updateReportData(id, formData)
            .then(() => {
                // Optionally, you can redirect the user or perform additional actions
                console.log('Report data updated successfully');
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
                console.log('response', response);
                setReportData(response);
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        void fetchData();
    }, [id]);

    return (
        <div>
            <h2>Edit Report</h2>
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
                <button type="submit">Save Changes</button>
            </form>
            <h2>Report Data</h2>
            <Table>
                <TableCaption>
                    Report Data for ID: {id}, {formData.name}
                </TableCaption>
                <TableBody>
                    {Object.entries(reportData).map(([date, rowData]) => (
                        <TableRow key={date}>
                            <TableCell>{date}</TableCell>
                            {Object.entries(rowData).map(([ticker, { close, open }]) => (
                                <React.Fragment key={ticker}>
                                    <TableCell>{`${ticker} Close`}</TableCell>
                                    <TableCell>{close as unknown as React.ReactNode}</TableCell>
                                    <TableCell>{`${ticker} Open`}</TableCell>
                                    <TableCell>{open as unknown as React.ReactNode}</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link to="/">
                <div style={{ color: 'lightblue' }}>Back to all reports</div>
            </Link>
        </div>
    );
};

export default ReportData;
