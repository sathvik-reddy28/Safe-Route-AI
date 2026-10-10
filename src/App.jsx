import {Routes,Route,Link} from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DashboardPage from './routes/DashboardPage';
import MapPage from './routes/MapPage';
import RouteCheckerPage from './routes/RouteCheckerPage';
import AlertVerificationPage from './routes/AlertVerificationPage';
import PhrasebookPage from './routes/PhrasebookPage';
import SavedAlertsPage from './routes/SavedAlertsPage';
import EmergencyModePage from './routes/EmergencyModePage';
import DataSourcesPage from './routes/DataSourcesPage';
export default function App(){return(<Routes><Route element={<AppLayout/>}>
  <Route index element={<DashboardPage/>}/><Route path="map" element={<MapPage/>}/><Route path="route" element={<RouteCheckerPage/>}/>
  <Route path="verify" element={<AlertVerificationPage/>}/><Route path="phrases" element={<PhrasebookPage/>}/><Route path="saved" element={<SavedAlertsPage/>}/>
  <Route path="quick" element={<EmergencyModePage/>}/><Route path="sources" element={<DataSourcesPage/>}/>
  <Route path="*" element={<div className="card">Page not found. <Link to="/">Back to dashboard</Link></div>}/>
</Route></Routes>)}
