import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampanaRequest } from '../../services/campanaService';
import { useAuth } from '../../context/AuthContext';
import styles from './DetalleCampana.module.css';

const DetalleCampana = () => {
    const [campana, setCampana] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [pestanaActiva, setPestanaActiva] = useState('descripcion');
    const { id } = useParams();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        cargarCampana();
    }, []);

    const cargarCampana = async () => {
        try {
            const res = await getCampanaRequest(id);
            setCampana(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <div className={styles.cargando}>Cargando campaña...</div>;
    if (!campana) return <div className={styles.cargando}>Campaña no encontrada.</div>;

    const esMaster = campana.id_master === usuario.id;

    const pestanas = [
        { id: 'descripcion', label: 'Descripción' },
        { id: 'jugadores', label: 'Jugadores' },
        { id: 'personajes', label: 'Personajes' },
        ...(esMaster || campana.npcs_visibles ? [{ id: 'npcs', label: 'NPCs' }] : []),
    ];

    return (
        <div className={styles.container}>

            {/* Cabecera */}
            <div className={styles.cabecera}>
                <button className={styles.botonVolver} onClick={() => navigate('/campanas')}>
                    ← Volver
                </button>
                <div className={styles.cabeceraInfo}>
                    <div className={styles.imagen}>
                        {campana.mapa_url ? (
                            <img src={campana.mapa_url} alt={campana.titulo} />
                        ) : (
                            <div className={styles.imagenPlaceholder}>🎲</div>
                        )}
                    </div>
                    <div className={styles.info}>
                        <h1>{campana.titulo}</h1>
                        <p>{campana.descripcion}</p>
                        {esMaster && (
                            <div className={styles.codigoInvitacion}>
                                <span>Código de invitación:</span>
                                <strong>{campana.codigo_invitacion}</strong>
                            </div>
                        )}
                    </div>
                    {esMaster && (
                        <button className={styles.botonEditar} onClick={() => navigate(`/campanas/${id}/editar`)}>
                            Editar campaña
                        </button>
                    )}
                </div>
            </div>

            {/* Pestañas */}
            <div className={styles.pestanas}>
                {pestanas.map(p => (
                    <button
                        key={p.id}
                        className={`${styles.pestana} ${pestanaActiva === p.id ? styles.pestanaActiva : ''}`}
                        onClick={() => setPestanaActiva(p.id)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Contenido pestañas */}
            <div className={styles.contenido}>
                {pestanaActiva === 'descripcion' && (
                    <div className={styles.descripcion}>
                        <p>{campana.descripcion || 'Sin descripción.'}</p>
                    </div>
                )}
                {pestanaActiva === 'jugadores' && (
                    <div className={styles.placeholder}>
                        <p>Lista de jugadores — próximamente</p>
                    </div>
                )}
                {pestanaActiva === 'personajes' && (
                    <div className={styles.placeholder}>
                        <p>Personajes de la campaña — próximamente</p>
                    </div>
                )}
                {pestanaActiva === 'npcs' && (
                    <div className={styles.placeholder}>
                        {esMaster && (
                            <div className={styles.toggleNpcs}>
                                <span>Visible para jugadores</span>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={campana.npcs_visibles}
                                        onChange={() => {}}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>
                        )}
                        <p>NPCs de la campaña — próximamente</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetalleCampana;