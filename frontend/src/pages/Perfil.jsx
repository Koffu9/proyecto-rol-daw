import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPerfilRequest, updateImagenPerfilRequest, updatePasswordRequest } from '../services/perfilService';
import ImageUpload from '../components/ui/ImagenUpload';
import styles from './Perfil.module.css';

const Perfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [formPassword, setFormPassword] = useState({ password_actual: '', password_nueva: '', confirmar_password: '' });
    const [errorPassword, setErrorPassword] = useState('');
    const [successPassword, setSuccessPassword] = useState('');
    const [guardandoPassword, setGuardandoPassword] = useState(false);
    const { usuario, updateUsuario } = useAuth();

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            const res = await getPerfilRequest();
            setPerfil(res.data);
            // Actualizamos el contexto con la imagen
            updateUsuario({ imagen_url: res.data.imagen_url });
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleImagenSubida = async (url) => {
        try {
            await updateImagenPerfilRequest(url);
            setPerfil({ ...perfil, imagen_url: url });
            updateUsuario({ imagen_url: url });
        } catch (error) {
            console.error(error);
        }
    };

    const handlePasswordChange = (e) => {
        setFormPassword({ ...formPassword, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrorPassword('');
        setSuccessPassword('');
        setGuardandoPassword(true);
        try {
            await updatePasswordRequest(formPassword);
            setSuccessPassword('Contraseña actualizada correctamente');
            setFormPassword({ password_actual: '', password_nueva: '', confirmar_password: '' });
        } catch (err) {
            setErrorPassword(err.response?.data?.error || 'Error al cambiar la contraseña');
        } finally {
            setGuardandoPassword(false);
        }
    };

    const formatearHoras = (horas) => {
        const h = Math.floor(horas);
        const m = Math.round((horas - h) * 60);
        return `${h}h ${m}m`;
    };

    if (cargando) return <div className={styles.cargando}>Cargando perfil...</div>;

    return (
        <div className={styles.container}>
            <h1>Mi perfil</h1>

            <div className={styles.grid}>
                {/* Info del usuario */}
                <div className={styles.seccion}>
                    <h2>Información</h2>
                    <div className={styles.perfilInfo}>
                        <div className={styles.avatarGrande}>
                            <ImageUpload
                                imagenActual={perfil.imagen_url}
                                onImagenSubida={handleImagenSubida}
                            />
                        </div>
                        <div className={styles.datos}>
                            <div className={styles.dato}>
                                <span className={styles.datoLabel}>Nombre de usuario</span>
                                <span className={styles.datoValor}>@{perfil.nombre_usuario}</span>
                            </div>
                            <div className={styles.dato}>
                                <span className={styles.datoLabel}>Email</span>
                                <span className={styles.datoValor}>{perfil.email}</span>
                            </div>
                            <div className={styles.dato}>
                                <span className={styles.datoLabel}>Miembro desde</span>
                                <span className={styles.datoValor}>
                                    {new Date(perfil.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className={styles.dato}>
                                <span className={styles.datoLabel}>Tiempo jugado</span>
                                <span className={styles.datoValor}>{formatearHoras(perfil.horas_conexion || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className={styles.seccion}>
                    <h2>Estadísticas</h2>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumero}>{perfil.stats.campanas}</span>
                            <span className={styles.statLabel}>Campañas</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumero}>{perfil.stats.personajes}</span>
                            <span className={styles.statLabel}>Personajes</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumero}>{perfil.stats.tiradas}</span>
                            <span className={styles.statLabel}>Tiradas</span>
                        </div>
                    </div>
                </div>

                {/* Cambiar contraseña */}
                <div className={`${styles.seccion} ${styles.seccionAncha}`}>
                    <h2>Cambiar contraseña</h2>
                    {errorPassword && <p className={styles.error}>{errorPassword}</p>}
                    {successPassword && <p className={styles.success}>{successPassword}</p>}
                    <form onSubmit={handlePasswordSubmit} className={styles.formPassword}>
                        <div className={styles.campo}>
                            <label>Contraseña actual</label>
                            <input
                                type="password"
                                name="password_actual"
                                value={formPassword.password_actual}
                                onChange={handlePasswordChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.campo}>
                            <label>Nueva contraseña</label>
                            <input
                                type="password"
                                name="password_nueva"
                                value={formPassword.password_nueva}
                                onChange={handlePasswordChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.campo}>
                            <label>Confirmar nueva contraseña</label>
                            <input
                                type="password"
                                name="confirmar_password"
                                value={formPassword.confirmar_password}
                                onChange={handlePasswordChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.botonPrimario} disabled={guardandoPassword}>
                            {guardandoPassword ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Perfil;