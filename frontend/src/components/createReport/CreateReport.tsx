import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormItem, FormLabel, FormControl, FormField } from '../common/form';
import reportService from '../services/reportService';
import { Alert, AlertDescription } from '../common/alert';

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

    const onSubmit = async (data: ReportCreate): Promise<void> => {
        const filtered = data.tickers.filter((ticker) => ticker.ticker !== undefined && ticker.metric !== undefined);
        // Validate main report data
        if (data.date_start === undefined || data.date_end === undefined || data.metric === undefined || data.name === undefined) {
            setError('*Cannot create report with empty fields');
            return;
        }

        // Validate tickers
        if (filtered === undefined || filtered.length === 0 || filtered.some((ticker) => ticker?.ticker === undefined || ticker?.metric === undefined)) {
            setError('*Cannot create report with empty ticker fields');
            return;
        }
        try {
            // Log the report data
            await reportService.createReport(reportCount, { ...data, tickers: filtered });

            // Use the prevCount parameter to log the updated value
            setReportCount((prevCount) => {
                return prevCount + 1;
            });
            setError(null);
        } catch (error) {
            console.error('Error creating report:', error);
        }
    };

    const handleRemoveTicker = (index: number): void => {
        setReportData((prevData) => {
            const newTickers = [...prevData.tickers];
            newTickers.splice(index, 1);

            return {
                ...prevData,
                tickers: newTickers,
            };
        });
    };
    useEffect(() => {
        // Reset error when tickers are updated
        setError(null);
    }, [reportData.tickers]);

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
                {error !== null && <AlertDescription style={{ color: 'red' }}>{error}</AlertDescription>}

                {/* Submit button */}
                <div>
                    <button type="submit" style={{ color: 'green' }}>
                        Generate report
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default CreateReport;
