import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('app-root')!;
const root = createRoot(container);
root.render(<App />);