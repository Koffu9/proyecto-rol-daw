//Contexto de la sesión del usuario.
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        if (token && usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setCargando(false);
    }, []);

    const login = (token, usuarioData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        setUsuario(usuarioData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            setUsuario(null);
        }
    };

    const updateUsuario = (datos) => {
        const usuarioActualizado = { ...usuario, ...datos };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando, updateUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);