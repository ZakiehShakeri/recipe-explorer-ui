import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./main";
import Recipe from './recipe';

function App() {
    return (
        <BrowserRouter basename="/recipe-explorer-ui">
            {/* <nav>
                <Link to="/">Home</Link> | <Link to="/recipe">Recipe</Link>
            </nav> */}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path='/recipe' element={<Recipe />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;