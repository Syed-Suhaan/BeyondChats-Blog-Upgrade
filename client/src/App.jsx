import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ArticleList />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
