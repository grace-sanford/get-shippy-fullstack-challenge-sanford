import { BrowserRouter as Router } from 'react-router-dom';
import AllReports from './components/allReports/AllReports';
import { Alert, AlertDescription, AlertTitle } from './components/common/alert';
import { Textarea } from './components/common/textarea';

const App: React.FC = (): JSX.Element => {
    return (
        <Router>
            <div className="p-8">
                <AllReports />
            </div>
        </Router>
    );
};

export default App;
