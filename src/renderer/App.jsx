import '../styles/App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

//  Import TestComponents
import TestComponents from 'pages/TestComponents';
import Home from 'pages/Home';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
        </Routes>
      </Router>
    </>
  );
}
