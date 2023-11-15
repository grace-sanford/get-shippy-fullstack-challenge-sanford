import React, { useState } from 'react';
import axios from 'axios';
import { Form, FormItem, FormLabel, FormControl, FormField } from '../common/form';
import reportService from '../services/reportService';

interface TickerCreate {
    ticker: string;
    metric: string;
}

interface ReportCreate {
    id: number;
    date_start: string;
    date_end: string;
    metric: string;
    name: string;
    tickers: TickerCreate[];
}
interface CreateReportProps {
    reportCount: number;
    setReportCount: React.Dispatch<React.SetStateAction<number>>;
}

const CreateReport: React.FC<CreateReportProps> = ({ reportCount, setReportCount }): JSX.Element => {
    console.log('Render CreateReport with reportId:', reportCount);
    const [reportData, setReportData] = useState<ReportCreate>({
        id: reportCount,
        date_start: '',
        date_end: '',
        metric: '',
        name: '',
        tickers: [{ ticker: '', metric: '' }],
    });

    const [error, setError] = useState<string | null>(null);

    const handleAddTicker = (): void => {
        setReportData((prevData) => ({
            ...prevData,
            tickers: [...prevData.tickers, { ticker: '', metric: '' }],
        }));
    };

    const handleRemoveTicker = (index: number): void => {
        const newTickers = [...reportData.tickers];
        newTickers.splice(index, 1);

        setReportData((prevData) => ({
            ...prevData,
            tickers: newTickers,
        }));
    };

    const onSubmit = async (data: ReportCreate): Promise<void> => {
        console.log('Submitting form with reportId:', reportCount);
        if (
            data.date_start.length === 0 ||
            data.date_end.length === 0 ||
            data.metric.length === 0 ||
            data.name.length === 0 ||
            data.tickers.some((ticker: any) => ticker?.ticker.length === 0 || ticker?.metric.length === 0)
        ) {
            // Set an error state to display an error message
            setError('Cannot create report with empty fields');
            console.log('Error', error);
        } else {
            // Prevent the default form submission
            // (You might also want to perform additional validation or submit the form to the server here)
            // Log the report data
            await reportService.createReport(reportCount, data);
            console.log('Before state update:', reportCount);
            setReportCount((prevCount) => prevCount + 1);
            console.log('After state update:', reportCount);
        }
    };

    return (
        <div>
            <h2 className="font-medium">Create a new report</h2>
            <Form onSubmit={onSubmit}>
                {/* Form items for main report data */}

                {/* Date Start */}
                <FormItem>
                    <FormLabel>Date Start: </FormLabel>
                    <FormControl>
                        <FormField name="date_start" render={({ field }) => <input type="text" {...field} value={field.value ?? ''} placeholder="YYYY-MM-DD" />} />
                    </FormControl>
                </FormItem>

                {/* Date End */}
                <FormItem>
                    <FormLabel>Date End: </FormLabel>
                    <FormControl>
                        <FormField name="date_end" render={({ field }) => <input type="text" {...field} value={field.value ?? ''} placeholder="YYYY-MM-DD" />} />
                    </FormControl>
                </FormItem>

                {/* Metric */}
                <FormItem>
                    <FormLabel>Metric: </FormLabel>
                    <FormControl>
                        <FormField name="metric" render={({ field }) => <input type="text" {...field} value={field.value ?? ''} placeholder="Enter Metric" />} />
                    </FormControl>
                </FormItem>

                {/* Name */}
                <FormItem>
                    <FormLabel>Name: </FormLabel>
                    <FormControl>
                        <FormField name="name" render={({ field }) => <input type="text" {...field} value={field.value ?? ''} placeholder="Enter Name" />} />
                    </FormControl>
                </FormItem>

                {/* Form items for tickers */}
                {reportData.tickers.map((ticker, index) => (
                    <div key={index}>
                        {/* Ticker */}
                        <FormField name={`tickers[${index}].ticker`} render={({ field }) => <input type="text" {...field} value={field.value ?? ''} placeholder="Ticker" />} />

                        {/* Metric */}
                        <FormField name={`tickers[${index}].metric`} render={({ field }) => <input type="text" {...field} value={field.value ?? ''} placeholder="Metric" />} />

                        {/* Remove Ticker button */}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    handleRemoveTicker(index);
                                }}
                            >
                                Remove Ticker
                            </button>
                        )}
                    </div>
                ))}

                {/* Add Ticker button */}
                <div>
                    <button type="button" onClick={handleAddTicker}>
                        Add Ticker
                    </button>
                </div>
                {error !== null && <div style={{ color: 'red' }}>{error}</div>}

                {/* Submit button */}
                <div>
                    <button type="submit">Generate report</button>
                </div>
            </Form>
        </div>
    );
};

export default CreateReport;
