import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import SpacesList from './pages/SpacesList';
import OccupiedSpaces from './pages/OccupiedSpaces';
import ReservationDetails from './pages/ReservationDetails';
import AdminDashboard from './pages/AdminDashboard';

function AppRouter() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<SpacesList />} />
                    <Route path="/reserv/:id" element={<ReservationDetails />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default AppRouter;
