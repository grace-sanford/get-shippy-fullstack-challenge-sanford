import AllReports from './components/allReports/AllReports';
import { Alert, AlertDescription, AlertTitle } from './components/common/alert';
import { Textarea } from './components/common/textarea';

const App: React.FC = (): JSX.Element => {
    return (
        <div className="p-8">
            <AllReports />
        </div>
    );
};

export default App;
