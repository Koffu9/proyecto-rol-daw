import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampanaRequest, getPersonajesDeCampanaRequest, asociarPersonajeRequest, desasociarPersonajeRequest, getParticipantesRequest, getNpcsDeCampanaRequest, crearNpcRequest, toggleVisibilidadNpcRequest, toggleNpcsVisiblesRequest, eliminarNpcRequest } from '../../services/campanaService';
import { getPersonajesRequest } from '../../services/personajeService';
import { useAuth } from '../../context/AuthContext';
import styles from './DetalleCampana.module.css';
import DiceRoller from '../../components/dice/DiceRoller';
import DiceHistory from '../../components/dice/DiceHistory';

const DetalleCampana = () => {
    const [campana, setCampana] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [pestanaActiva, setPestanaActiva] = useState('descripcion');
    const { id } = useParams();
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [personajesCampana, setPersonajesCampana] = useState([]);
    const [misPersonajes, setMisPersonajes] = useState([]);
    const [modalAsociar, setModalAsociar] = useState(false);
    const [participantes, setParticipantes] = useState([]);

    const [npcs, setNpcs] = useState([]);
    const [modalNpc, setModalNpc] = useState(false);
    const [formNpc, setFormNpc] = useState({ nombre: '', descripcion: '' });
    const [npcConFicha, setNpcConFicha] = useState(false);
    const [npcSeleccionado, setNpcSeleccionado] = useState(null);

    const [refreshTiradas, setRefreshTiradas] = useState(0);
    
    const cargarNpcs = async () => {
        try {
            const res = await getNpcsDeCampanaRequest(id);
            setNpcs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarPersonajes = async () => {
        try {
            const res = await getPersonajesDeCampanaRequest(id);
            setPersonajesCampana(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    const cargarParticipantes = async () => {
        try {
            const res = await getParticipantesRequest(id);
            setParticipantes(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarCampana();
        cargarPersonajes();
        cargarParticipantes();
        cargarNpcs();
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
        { id: 'tiradas', label: 'Tiradas' },
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
                    <div className={styles.jugadoresTab}>
                        <div className={styles.tabCabecera}>
                            <h3>Participantes de la campaña</h3>
                        </div>
                        {participantes.length === 0 ? (
                            <p className={styles.vacio}>No hay participantes todavía.</p>
                        ) : (
                            <div className={styles.jugadoresLista}>
                                {participantes.map(p => (
                                    <div key={p.id} className={styles.jugadorItem}>
                                        <div className={styles.jugadorAvatar}>
                                            {p.nombre_usuario.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className={styles.jugadorInfo}>
                                            <span className={styles.jugadorNombre}>@{p.nombre_usuario}</span>
                                        </div>
                                        <span className={`${styles.rolBadge} ${p.rol === 'master' ? styles.rolMaster : styles.rolJugador}`}>
                                            {p.rol === 'master' ? '👑 Máster' : '🎲 Jugador'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {pestanaActiva === 'personajes' && (
                    <div className={styles.personajesTab}>
                        <div className={styles.tabCabecera}>
                            <h3>Personajes de la campaña</h3>
                            <button className={styles.botonPrimario} onClick={async () => {
                                const res = await getPersonajesRequest();
                                setMisPersonajes(res.data.filter(p => !p.id_campana));
                                setModalAsociar(true);
                            }}>
                                + Añadir personaje
                            </button>
                        </div>
                        {personajesCampana.length === 0 ? (
                            <p className={styles.vacio}>No hay personajes en esta campaña todavía.</p>
                        ) : (
                            <div className={styles.personajesLista}>
                                {personajesCampana.map(p => {
                                    const datos = p.datos ? JSON.parse(p.datos) : null;
                                    return (
                                        <div key={p.id} className={styles.personajeItem}>
                                            <div className={styles.personajeAvatar}>
                                                {p.nombre.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className={styles.personajeInfo}>
                                                <span className={styles.personajeNombre}>{p.nombre}</span>
                                                <span className={styles.personajeSubtitulo}>
                                                    {datos ? `${datos.raza} ${datos.clase} Nv.${datos.nivel}` : 'Sin ficha'}
                                                </span>
                                                <span className={styles.personajeJugador}>@{p.nombre_usuario}</span>
                                            </div>
                                            {p.id_usuario === usuario.id && (
                                                <button className={styles.botonDesasociar} onClick={async () => {
                                                    await desasociarPersonajeRequest(id, p.id);
                                                    cargarPersonajes();
                                                }}>
                                                    Quitar
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* Modal para asociar personaje */}
                        {modalAsociar && (
                            <div className={styles.modalOverlay} onClick={() => setModalAsociar(false)}>
                                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                                    <h2>Añadir personaje</h2>
                                    <p>Selecciona uno de tus personajes para añadirlo a esta campaña.</p>
                                    {misPersonajes.length === 0 ? (
                                        <p className={styles.vacio}>No tienes personajes disponibles.</p>
                                    ) : (
                                        <div className={styles.modalLista}>
                                            {misPersonajes.map(p => {
                                                const datos = p.datos ? JSON.parse(p.datos) : null;
                                                return (
                                                    <div key={p.id} className={styles.modalPersonajeItem} onClick={async () => {
                                                        await asociarPersonajeRequest(id, p.id);
                                                        cargarPersonajes();
                                                        setModalAsociar(false);
                                                    }}>
                                                        <div className={styles.personajeAvatar}>
                                                            {p.nombre.slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className={styles.personajeInfo}>
                                                            <span className={styles.personajeNombre}>{p.nombre}</span>
                                                            <span className={styles.personajeSubtitulo}>
                                                                {datos ? `${datos.raza} ${datos.clase} Nv.${datos.nivel}` : 'Sin ficha'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <button className={styles.botonSecundario} onClick={() => setModalAsociar(false)}>Cancelar</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {pestanaActiva === 'tiradas' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <DiceRoller
                            id_campana={parseInt(id)}
                            onTirada={() => setRefreshTiradas(prev => prev + 1)}
                        />
                        <DiceHistory id_campana={parseInt(id)} refresh={refreshTiradas} />
                    </div>
                )}
                {pestanaActiva === 'npcs' && (
                    <div className={styles.npcsTab}>
                        {esMaster && (
                            <div className={styles.npcsCabecera}>
                                <div className={styles.toggleNpcs}>
                                    <span>Pestaña visible para jugadores</span>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={campana.npcs_visibles}
                                            onChange={async (e) => {
                                                const nuevoValor = e.target.checked;
                                                await toggleNpcsVisiblesRequest(id, nuevoValor);
                                                setCampana({ ...campana, npcs_visibles: nuevoValor });
                                            }}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                    </label>
                                </div>
                                <button className={styles.botonPrimario} onClick={() => setModalNpc(true)}>
                                    + Crear NPC
                                </button>
                            </div>
                        )}

                        {npcs.length === 0 ? (
                            <p className={styles.vacio}>No hay NPCs en esta campaña todavía.</p>
                        ) : (
                            <div className={styles.npcLista}>
                                {npcs
                                    .filter(npc => esMaster || npc.visible)
                                    .map(npc => (
                                        <div key={npc.id} className={`${styles.npcItem} ${!npc.visible ? styles.npcOculto : ''}`}
                                            onClick={() => {
                                                if (npc.sistema) {
                                                    navigate(`/personajes/${npc.id}`);
                                                } else {
                                                    setNpcSeleccionado(npc);
                                                }
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className={styles.personajeAvatar}>
                                                {npc.nombre.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className={styles.personajeInfo}>
                                                <span className={styles.personajeNombre}>{npc.nombre}</span>
                                                <span className={styles.personajeSubtitulo}>{npc.descripcion || 'Sin descripción'}</span>
                                            </div>
                                            {esMaster && (
                                                <div className={styles.npcAcciones}>
                                                    <label className={styles.toggle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={npc.visible}
                                                            onChange={async (e) => {
                                                                const nuevoVisible = e.target.checked;
                                                                await toggleVisibilidadNpcRequest(id, npc.id, nuevoVisible);
                                                                setNpcs(npcs.map(n => n.id === npc.id ? { ...n, visible: nuevoVisible } : n));
                                                            }}
                                                        />
                                                        <span className={styles.toggleSlider}></span>
                                                    </label>
                                                    <span className={styles.visibilidadLabel}>{npc.visible ? 'Visible' : 'Oculto'}</span>
                                                    <button className={styles.botonDesasociar} onClick={async () => {
                                                        await eliminarNpcRequest(id, npc.id);
                                                        cargarNpcs();
                                                    }}>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        )}

                        {/* Modal crear NPC */}
                        {modalNpc && (
                            <div className={styles.modalOverlay} onClick={() => setModalNpc(false)}>
                                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                                    <h2>Crear NPC</h2>

                                    <div className={styles.campo}>
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            value={formNpc.nombre}
                                            onChange={e => setFormNpc({ ...formNpc, nombre: e.target.value })}
                                            className={styles.input}
                                            placeholder="Nombre del NPC..."
                                        />
                                    </div>
                                    <div className={styles.campo}>
                                        <label>Descripción</label>
                                        <textarea
                                            value={formNpc.descripcion}
                                            onChange={e => setFormNpc({ ...formNpc, descripcion: e.target.value })}
                                            className={styles.textarea}
                                            rows={3}
                                            placeholder="Descripción del NPC..."
                                        />
                                    </div>

                                    <label className={styles.checkLabel}>
                                        <input
                                            type="checkbox"
                                            checked={npcConFicha}
                                            onChange={e => setNpcConFicha(e.target.checked)}
                                        />
                                        Crear NPC con ficha completa
                                    </label>

                                    <div className={styles.modalBotones}>
                                        <button className={styles.botonSecundario} onClick={() => {
                                            setModalNpc(false);
                                            setNpcConFicha(false);
                                        }}>
                                            Cancelar
                                        </button>
                                        <button className={styles.botonPrimario} onClick={async () => {
                                            if (!formNpc.nombre.trim()) return;
                                            if (npcConFicha) {
                                                // Redirigimos a una página de crear NPC con ficha
                                                navigate(`/campanas/${id}/npcs/crear`);
                                            } else {
                                                await crearNpcRequest(id, formNpc);
                                                setFormNpc({ nombre: '', descripcion: '' });
                                                setModalNpc(false);
                                                setNpcConFicha(false);
                                                cargarNpcs();
                                            }
                                        }}>
                                            {npcConFicha ? 'Continuar →' : 'Crear NPC'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {npcSeleccionado && (
                            <div className={styles.modalOverlay} onClick={() => setNpcSeleccionado(null)}>
                                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                                    <h2>{npcSeleccionado.nombre}</h2>
                                    <p>{npcSeleccionado.descripcion || 'Sin descripción.'}</p>
                                    <button className={styles.botonSecundario} onClick={() => setNpcSeleccionado(null)}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetalleCampana;