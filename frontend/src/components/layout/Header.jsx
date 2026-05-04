import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';

const Header = () => {
    const { usuario, logout } = useAuth();
    const [dropdownAbierto, setDropdownAbierto] = useState(false);

    const dropdownRef = useRef(null);
    //Efecto para que al clicar en cualquier sitio se cierre el desplegable del usuario (Si está abierto)
    useEffect(() => {
        const handleClickFuera = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const iniciales = usuario?.nombre_usuario
        ? usuario.nombre_usuario.slice(0, 2).toUpperCase()
        : '';

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/"><GiDiceTwentyFacesTwenty /> TodoRol</Link>
            </div>

            <nav className={styles.nav}>
                <Link to="/dashboard">Inicio</Link>
                <Link to="/campanas">Campañas</Link>
                <Link to="/personajes">Personajes</Link>
                <Link to="/juegos">Juegos</Link>
            </nav>

            <div className={styles.derecha}>
                {usuario ? (
                    <div className={styles.perfil} ref={dropdownRef} onClick={() => setDropdownAbierto(!dropdownAbierto)}>
                        <div className={styles.avatar}>
            {usuario?.imagen_url ? (
                <img src={usuario.imagen_url} alt={usuario.nombre_usuario} className={styles.avatarImg} />
            ) : (
                iniciales
            )}
        </div>
                        <span className={styles.nombre}>{usuario.nombre_usuario}</span>
                        <span className={styles.flecha}>▼</span>

                        {dropdownAbierto && (
                            <div className={styles.dropdown}>
                                <Link to="/perfil" onClick={() => setDropdownAbierto(false)}>
                                    Mi perfil
                                </Link>
                                <button onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className={styles.botonLogin}>Iniciar sesión</Link>
                )}
            </div>
        </header>
    );
};

export default Header;