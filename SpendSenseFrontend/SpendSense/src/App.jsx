import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import History from './pages/History';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import ManageCategories from './pages/ManageCategories'; // Import it here
import Subscription from './pages/Subscriptions';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-transaction" element={<AddTransaction />} />
      <Route path="/subscriptions" element={<Subscription />} />
      <Route path="/history" element={<History />} />
      <Route path="/categories" element={<ManageCategories />} /> {/* Add the route */}
    </Routes>
  );
}

export default App;