import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCampanasRequest } from '../services/campanaService';
import { getPersonajesRequest } from '../services/personajeService';
import { getTiradasUsuarioRequest } from '../services/tiradaService';
import styles from './Dashboard.module.css';
import { GiCrossedSwords, GiWizardStaff, GiBookCover, GiCharacter, GiScrollUnfurled, GiDungeonGate, GiTreasureMap, GiAncientSword, GiImperialCrown } from 'react-icons/gi';
import DiceHistory from '../components/dice/DiceHistory';
import { FaChessKnight } from 'react-icons/fa';

const Dashboard = () => {
    const [campanas, setCampanas] = useState([]);
    const [personajes, setPersonajes] = useState([]);
    const [tiradas, setTiradas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resCampanas, resPersonajes, resTiradas] = await Promise.all([
                getCampanasRequest(),
                getPersonajesRequest(),
                getTiradasUsuarioRequest()
            ]);
            setCampanas(resCampanas.data.slice(0, 3));
            setPersonajes(resPersonajes.data.slice(0, 3));
            setTiradas(resTiradas.data.slice(0, 5));
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (fecha) => {
        const d = new Date(fecha);
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    if (cargando) return <div className={styles.cargando}>Cargando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.bienvenida}>
                <h1>Bienvenido, {usuario?.nombre_usuario} 👋</h1>
                <p>Aquí tienes un resumen de tu actividad reciente.</p>
            </div>

            {/* Accesos rápidos */}
            <div className={styles.accesosRapidos}>
                <button className={styles.accesoBoton} onClick={() => navigate('/campanas/crear')}>
                    <GiCrossedSwords className={styles.accesoIcono} />
                    <span>Crear campaña</span>
                </button>
                <button className={styles.accesoBoton} onClick={() => navigate('/personajes/crear')}>
                    <GiWizardStaff className={styles.accesoIcono} />
                    <span>Crear personaje</span>
                </button>
                <button className={styles.accesoBoton} onClick={() => navigate('/campanas')}>
                    <GiBookCover className={styles.accesoIcono} />
                    <span>Mis campañas</span>
                </button>
                <button className={styles.accesoBoton} onClick={() => navigate('/personajes')}>
                    <GiCharacter className={styles.accesoIcono} />
                    <span>Mis personajes</span>
                </button>
            </div>

            <div className={styles.grid}>
                {/* Campañas recientes */}
                <div className={styles.seccion}>
                    <div className={styles.seccionCabecera}>
                        <h2>Campañas recientes</h2>
                        <button className={styles.verTodo} onClick={() => navigate('/campanas')}>Ver todo</button>
                    </div>
                    {campanas.length === 0 ? (
                        <p className={styles.vacio}>No tienes campañas todavía.</p>
                    ) : (
                        <div className={styles.lista}>
                            {campanas.map(c => (
                                <div key={c.id} className={styles.item} onClick={() => navigate(`/campanas/${c.id}`)}>
                                    <div className={styles.itemIcono}>
                                        <GiDungeonGate />
                                    </div>
                                    <div className={styles.itemIcono}>
                                        <GiScrollUnfurled />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemNombre}>{c.titulo}</span>
                                        <span className={styles.itemMeta}>
                                            {c.id_master === usuario.id
                                                ? <><GiImperialCrown /> Máster</>
                                                : <><FaChessKnight /> Jugador</>
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Personajes recientes */}
                <div className={styles.seccion}>
                    <div className={styles.seccionCabecera}>
                        <h2>Personajes recientes</h2>
                        <button className={styles.verTodo} onClick={() => navigate('/personajes')}>Ver todo</button>
                    </div>
                    {personajes.length === 0 ? (
                        <p className={styles.vacio}>No tienes personajes todavía.</p>
                    ) : (
                        <div className={styles.lista}>
                            {personajes.map(p => {
                                const datos = p.datos ? JSON.parse(p.datos) : null;
                                return (
                                    <div key={p.id} className={styles.item} onClick={() => navigate(`/personajes/${p.id}`)}>
                                        <div className={styles.itemAvatar}>
                                            {p.imagen_url
                                                ? <img src={p.imagen_url} alt={p.nombre} />
                                                : p.nombre.slice(0, 2).toUpperCase()
                                            }
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemNombre}>{p.nombre}</span>
                                            <span className={styles.itemMeta}>
                                                {datos ? `${datos.raza} ${datos.clase} Nv.${datos.nivel}` : 'Sin ficha'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Actividad reciente - tiradas */}
                <div className={styles.seccionAncha}>
                    <div className={styles.seccionCabecera}>
                        <h2>Tiradas recientes</h2>
                    </div>
                    {tiradas.length === 0 ? (
                        <p className={styles.vacio}>No has hecho tiradas todavía.</p>
                    ) : (
                        <>
                            <DiceHistory />
                        </>)}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;