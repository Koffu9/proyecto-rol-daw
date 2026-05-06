import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonajeRequest } from '../../services/personajeService';
import styles from './DetallePersonaje.module.css';
import { useAuth } from '../../context/AuthContext';
import DiceRoller from '../../components/dice/DiceRoller';
import DiceHistory from '../../components/dice/DiceHistory';


const BONIFICADOR_COMPETENCIA = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];

const calcularModificador = (valor) => Math.floor((valor - 10) / 2);
const formatearMod = (mod) => mod >= 0 ? `+${mod}` : `${mod}`;

const DetallePersonaje = () => {
    const [personaje, setPersonaje] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [pestanaInferior, setPestanaInferior] = useState('equipo');
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [refreshTiradas, setRefreshTiradas] = useState(0);
    useEffect(() => {
        cargarPersonaje();
    }, []);

    const cargarPersonaje = async () => {
        try {
            const res = await getPersonajeRequest(id);
            setPersonaje(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <div className={styles.cargando}>Cargando personaje...</div>;
    if (!personaje) return <div className={styles.cargando}>Personaje no encontrado.</div>;

    const ficha = personaje.ficha ? (typeof personaje.ficha.datos === 'string' ? JSON.parse(personaje.ficha.datos) : personaje.ficha.datos) : null;
    const nivel = ficha?.nivel || 1;
    const bonComp = BONIFICADOR_COMPETENCIA[nivel - 1];
    const iniciales = personaje.nombre.slice(0, 2).toUpperCase();
    const sistema = personaje.ficha?.sistema === 'dnd' ? 'D&D 5e' : personaje.ficha?.sistema === 'jth' ? 'Journey to Halo' : 'Sin sistema';

    const calcularHabilidad = (nombreHabilidad, atributo) => {
        if (!ficha) return 0;
        const mod = calcularModificador(ficha.atributos[atributo]);
        const tieneComp = ficha.habilidades[nombreHabilidad];
        return mod + (tieneComp ? bonComp : 0);
    };

    const calcularSalvacion = (atributo) => {
        if (!ficha) return 0;
        const mod = calcularModificador(ficha.atributos[atributo]);
        const tieneComp = ficha.tiradas_salvacion[atributo];
        return mod + (tieneComp ? bonComp : 0);
    };

    const habilidadesAtributo = {
        acrobacias: 'destreza', arcanos: 'inteligencia', atletismo: 'fuerza',
        engano: 'carisma', historia: 'inteligencia', intimidacion: 'carisma',
        juego_de_manos: 'destreza', medicina: 'sabiduria', naturaleza: 'inteligencia',
        percepcion: 'sabiduria', perspicacia: 'sabiduria', persuasion: 'carisma',
        religion: 'inteligencia', sigilo: 'destreza', supervivencia: 'sabiduria',
        trato_animales: 'sabiduria'
    };

    const armas = ficha?.equipo?.inventario?.filter(item => item.es_arma) || [];

    return (
        <div className={styles.container}>

            {/* Cabecera */}
            <div className={styles.cabecera}>
                <button className={styles.botonVolver} onClick={() => navigate(-1)}>← Volver</button>
                <div className={styles.cabeceraInfo}>
                    <div className={styles.avatar}>
                        {personaje.imagen_url
                            ? <img src={personaje.imagen_url} alt={personaje.nombre} />
                            : <div className={styles.avatarPlaceholder}>{iniciales}</div>
                        }
                    </div>
                    <div className={styles.info}>
                        <h1>{personaje.nombre}</h1>
                        <p className={styles.subtitulo}>
                            {ficha ? `${ficha.raza} ${ficha.clase} — Nivel ${ficha.nivel}` : 'Sin ficha'}
                        </p>
                        <p className={styles.sistema}>{sistema}</p>
                        {personaje.campana_titulo && (
                            <p className={styles.campana}>📖 {personaje.campana_titulo}</p>
                        )}
                    </div>
                    <div className={styles.cabeceraAcciones}>
                        {(!personaje.es_npc || personaje.id_usuario === usuario.id) && (
                            <button className={styles.botonNivel} onClick={() => navigate(`/personajes/${id}/subir-nivel`)}>
                                ⬆ Subir nivel
                            </button>
                        )}
                        {(!personaje.es_npc || personaje.id_usuario === usuario.id) && (
                            <button className={styles.botonEditar} onClick={() => navigate(`/personajes/${id}/editar`)}>
                                Editar
                            </button>
                        )}

                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            {ficha && (
                <div className={styles.contenidoPrincipal}>

                    {/* Columna izquierda */}
                    <div className={styles.columnaIzq}>

                        {/* Atributos */}
                        <div className={styles.seccion}>
                            <h2 className={styles.seccionTitulo}>Atributos</h2>
                            <div className={styles.gridAtributos}>
                                {Object.entries(ficha.atributos).map(([attr, valor]) => {
                                    const mod = calcularModificador(valor);
                                    return (
                                        <div key={attr} className={styles.atributo}>
                                            <span className={styles.atributoNombre}>{attr.slice(0, 3).toUpperCase()}</span>
                                            <span className={styles.atributoValor}>{valor}</span>
                                            <span className={styles.atributoMod}>{formatearMod(mod)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Combate */}
                        <div className={styles.seccion}>
                            <h2 className={styles.seccionTitulo}>Combate</h2>
                            <div className={styles.gridCombate}>
                                <div className={styles.combateStat}>
                                    <span className={styles.combateValor}>{ficha.combate.puntos_vida_actual}/{ficha.combate.puntos_vida_max}</span>
                                    <span className={styles.combateLabel}>Puntos de vida</span>
                                </div>
                                <div className={styles.combateStat}>
                                    <span className={styles.combateValor}>{ficha.combate.clase_armadura}</span>
                                    <span className={styles.combateLabel}>Clase armadura</span>
                                </div>
                                <div className={styles.combateStat}>
                                    <span className={styles.combateValor}>{formatearMod(ficha.combate.iniciativa)}</span>
                                    <span className={styles.combateLabel}>Iniciativa</span>
                                </div>
                                <div className={styles.combateStat}>
                                    <span className={styles.combateValor}>{ficha.combate.velocidad}</span>
                                    <span className={styles.combateLabel}>Velocidad (pies)</span>
                                </div>
                                <div className={styles.combateStat}>
                                    <span className={styles.combateValor}>{ficha.combate.dados_golpe}</span>
                                    <span className={styles.combateLabel}>Dados de golpe</span>
                                </div>
                                <div className={styles.combateStat}>
                                    <span className={styles.combateValor}>{formatearMod(bonComp)}</span>
                                    <span className={styles.combateLabel}>Bon. competencia</span>
                                </div>
                            </div>
                        </div>
                        {/* Ataques */}
                        {armas.length > 0 && (
                            <div className={styles.seccion}>
                                <h2 className={styles.seccionTitulo}>Ataques</h2>
                                <table className={styles.tablaAtaques}>
                                    <thead>
                                        <tr>
                                            <th>Arma</th>
                                            <th>Bon. ataque</th>
                                            <th>Daño</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {armas.map((arma, i) => {
                                            const mod = calcularModificador(ficha.atributos[arma.atributo]);
                                            const bonAtaque = mod + (arma.competencia ? bonComp : 0);
                                            const danio = `${arma.dado_dano} ${formatearMod(mod)}`;
                                            return (
                                                <tr key={i}>
                                                    <td>{arma.nombre}</td>
                                                    <td>{formatearMod(bonAtaque)}</td>
                                                    <td>{danio}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>

                    {/* Columna derecha — aside */}
                    <div className={styles.columnaDer}>

                        {/* Tiradas de salvación */}
                        <div className={styles.seccion}>
                            <h2 className={styles.seccionTitulo}>Tiradas de salvación</h2>
                            <div className={styles.listaCompetencias}>
                                {Object.keys(ficha.tiradas_salvacion).map(attr => {
                                    const val = calcularSalvacion(attr);
                                    const tieneComp = ficha.tiradas_salvacion[attr];
                                    return (
                                        <div key={attr} className={styles.competenciaItem}>
                                            <span className={`${styles.competenciaDot} ${tieneComp ? styles.competenciaDotActivo : ''}`} />
                                            <span className={styles.competenciaNombre}>{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                                            <span className={styles.competenciaValor}>{formatearMod(val)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Habilidades */}
                        <div className={styles.seccion}>
                            <h2 className={styles.seccionTitulo}>Habilidades</h2>
                            <div className={styles.listaCompetencias}>
                                {Object.keys(ficha.habilidades).map(hab => {
                                    const atributo = habilidadesAtributo[hab];
                                    const val = calcularHabilidad(hab, atributo);
                                    const tieneComp = ficha.habilidades[hab];
                                    return (
                                        <div key={hab} className={styles.competenciaItem}>
                                            <span className={`${styles.competenciaDot} ${tieneComp ? styles.competenciaDotActivo : ''}`} />
                                            <span className={styles.competenciaNombre}>{hab.replace(/_/g, ' ').charAt(0).toUpperCase() + hab.replace(/_/g, ' ').slice(1)}</span>
                                            <span className={styles.competenciaValor}>{formatearMod(val)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tirada de dados */}
            <DiceRoller
                id_personaje={parseInt(id)}
                onTirada={() => setRefreshTiradas(prev => prev + 1)}
            />
            <DiceHistory refresh={refreshTiradas} />

            {/* Pestañas inferiores */}
            <div className={styles.pestanas}>
                <button className={`${styles.pestana} ${pestanaInferior === 'equipo' ? styles.pestanaActiva : ''}`} onClick={() => setPestanaInferior('equipo')}>Equipo</button>
                <button className={`${styles.pestana} ${pestanaInferior === 'trasfondo' ? styles.pestanaActiva : ''}`} onClick={() => setPestanaInferior('trasfondo')}>Trasfondo</button>
            </div>

            <div className={styles.pestanaContenido}>
                {pestanaInferior === 'equipo' && ficha && (
                    <div className={styles.equipo}>
                        <div className={styles.inventario}>
                            <h3>Inventario</h3>
                            {ficha.equipo.inventario.length === 0
                                ? <p className={styles.vacio}>Sin objetos.</p>
                                : <ul className={styles.inventarioLista}>
                                    {ficha.equipo.inventario.map((item, i) => (
                                        <li key={i} className={styles.inventarioItem}>
                                            {item.es_arma ? '⚔️' : '🎒'} {item.nombre || item}
                                            {item.es_arma && <span className={styles.armaTag}>{item.dado_dano} ({item.atributo})</span>}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                        <div className={styles.monedas}>
                            <h3>Monedas</h3>
                            <div className={styles.gridMonedas}>
                                {Object.entries(ficha.equipo.monedas).map(([tipo, cantidad]) => (
                                    <div key={tipo} className={styles.moneda}>
                                        <span className={styles.monedaTipo}>{tipo.toUpperCase()}</span>
                                        <span className={styles.monedaCantidad}>{cantidad}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {pestanaInferior === 'trasfondo' && ficha && (
                    <div className={styles.trasfondo}>
                        {Object.entries(ficha.trasfondo_rp).map(([campo, valor]) => (
                            <div key={campo} className={styles.trasfondoCampo}>
                                <h3>{campo.replace(/_/g, ' ').charAt(0).toUpperCase() + campo.replace(/_/g, ' ').slice(1)}</h3>
                                <p>{valor || 'Sin rellenar.'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetallePersonaje;