import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllReports from './components/allReports/AllReports';
import ReportData from './components/reportData/ReportData';
import { Alert, AlertDescription, AlertTitle } from './components/common/alert';
import { Textarea } from './components/common/textarea';

const App: React.FC = (): JSX.Element => {
    return (
        <Router>
            <div className="p-8">
                <Routes>
                    <Route path="/reports/:id" element={<ReportData />} />
                    <Route path="/" element={<AllReports />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
