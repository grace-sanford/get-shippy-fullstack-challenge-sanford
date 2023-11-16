import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllReports from './components/allReports/AllReports';
import ReportData from './components/views/ReportData';
import ReportCalendar from './components/views/ReportCalendar';

const App: React.FC = (): JSX.Element => {
    return (
        <Router>
            <div className="p-8">
                <Routes>
                    <Route path="/calendar" element={<ReportCalendar />} />
                    <Route path="/reports/:id" element={<ReportData />} />
                    <Route path="/" element={<AllReports />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
