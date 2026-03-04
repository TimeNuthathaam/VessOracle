import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CardDetail from './pages/CardDetail';
import CardForm from './pages/CardForm';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/card/:id" element={<CardDetail />} />
          <Route path="/add" element={<CardForm />} />
          <Route path="/edit/:id" element={<CardForm />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
