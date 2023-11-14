import { Alert, AlertDescription, AlertTitle } from './components/common/alert';

const App: React.FC = (): JSX.Element => {
    return (
        <div className="p-8">
            <Alert>
                <AlertTitle>Hello World!</AlertTitle>
                <AlertDescription>This demo shows the usage of an alert component from the shadcn library.</AlertDescription>
            </Alert>
        </div>
    );
};

export default App;
