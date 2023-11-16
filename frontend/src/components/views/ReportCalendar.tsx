import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, TableCaption, TableRow, TableCell, TableHead } from '../common/table';
import { Calendar } from '../common/calendar'; // Replace with the actual path to your Calendar component
import reportService from '../services/reportService';
import { AlertDescription } from '../common/alert';

interface ResponseData {
    open: number;
    close: number;
    high: number;
    low: number;
}

const ReportCalendar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [ticker, setTicker] = useState('');
    const [result, setResult] = useState<ResponseData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDayClick = (day: Date): void => {
        setSelectedDay(day);
    };

    const handleSearch = async (): Promise<void> => {
        const formattedDay = selectedDay?.toISOString().split('T')[0];
        if (formattedDay !== null && ticker.trim() !== '') {
            try {
                const response = await reportService.getDataByDate(formattedDay, ticker);
                setResult(response);
                setError(null);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        } else {
            setError('*Please select a day and enter a valid ticker before searching.');
        }
    };

    return (
        <div>
            <Calendar showOutsideDays onDayClick={handleDayClick} selectedDay={selectedDay} />
            <label>Ticker: </label>
            <input
                type="text"
                value={ticker}
                onChange={(e) => {
                    setTicker(e.target.value);
                }}
            />
            <button
                type="button"
                style={{ color: 'navy' }}
                onClick={() => {
                    handleSearch().catch((error) => {
                        console.error('Error:', error);
                    });
                }}
            >
                Search
            </button>
            {error !== null && <AlertDescription style={{ color: 'red' }}>{error}</AlertDescription>}

            {/* Render data for the selected day */}
            {result !== null && (
                <Table>
                    <TableHead>Date: {selectedDay?.toISOString().split('T')[0]}</TableHead>
                    <TableCell>Open: {result.open}</TableCell>
                    <TableCell>Close: {result.close}</TableCell>
                    <TableCell style={{ color: 'green' }}>High: {result.high}</TableCell>
                    <TableCell style={{ color: 'red' }}>Low: {result.low}</TableCell>
                </Table>
            )}
            <Link to="/">
                <div style={{ color: 'lightblue' }}>Back to all reports</div>
            </Link>
        </div>
    );
};

export default ReportCalendar;
