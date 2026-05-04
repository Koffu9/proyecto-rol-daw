import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Campanas from './pages/campanas/Campanas.jsx'
import CrearCampana from './pages/campanas/CrearCampana.jsx';
import EditarCampana from './pages/campanas/EditarCampana.jsx';
import DetalleCampana from './pages/campanas/DetalleCampana';
import Personajes from './pages/personajes/Personajes';
import CrearPersonaje from './pages/personajes/CrearPersonaje';
import DetallePersonaje from './pages/personajes/DetallePersonaje';
import SubirNivel from './pages/personajes/SubirNivel';
import CrearNpc from './pages/campanas/CrearNpc';

const ProtectedRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  return usuario ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  return usuario ? <Navigate to="/dashboard" /> : children;
};



const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          // Rutas
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />

          // Rutas campañas
          <Route path="/campanas" element={<ProtectedRoute><Layout><Campanas /></Layout></ProtectedRoute>} />
          <Route path="/campanas/crear" element={<ProtectedRoute><Layout><CrearCampana /></Layout></ProtectedRoute>} />
          <Route path="/campanas/:id" element={<ProtectedRoute><Layout><DetalleCampana /></Layout></ProtectedRoute>} />
          <Route path="/campanas/:id/editar" element={<ProtectedRoute><Layout><EditarCampana /></Layout></ProtectedRoute>} />
          <Route path="/campanas/:id_campana/npcs/crear" element={<ProtectedRoute><Layout><CrearNpc /></Layout></ProtectedRoute>} />

          // Rutas personaje
          <Route path="/personajes" element={<ProtectedRoute><Layout><Personajes /></Layout></ProtectedRoute>} />
          <Route path="/personajes/crear" element={<ProtectedRoute><Layout><CrearPersonaje /></Layout></ProtectedRoute>} />
          <Route path="/personajes/:id" element={<ProtectedRoute><Layout><DetallePersonaje /></Layout></ProtectedRoute>} />
          <Route path="/personajes/:id/subir-nivel" element={<ProtectedRoute><Layout><SubirNivel /></Layout></ProtectedRoute>} />

          <Route path="/juegos" element={<ProtectedRoute><Layout><div>Juegos</div></Layout></ProtectedRoute>} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;