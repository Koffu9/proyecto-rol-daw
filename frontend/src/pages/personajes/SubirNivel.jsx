import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonajeRequest, subirNivelRequest } from '../../services/personajeService';
import { CLASES } from '../../constants/dnd';
import styles from './SubirNivel.module.css';

const BONIFICADOR_COMPETENCIA = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];

const SubirNivel = () => {
    const [personaje, setPersonaje] = useState(null);
    const [ficha, setFicha] = useState(null);
    const [paso, setPaso] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [subclaseElegida, setSubclaseElegida] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        cargarPersonaje();
    }, []);

    const cargarPersonaje = async () => {
        try {
            const res = await getPersonajeRequest(id);
            setPersonaje(res.data);
            const datos = typeof res.data.ficha.datos === 'string'
                ? JSON.parse(res.data.ficha.datos)
                : res.data.ficha.datos;
            // Subimos el nivel al cargar
            setFicha({ ...datos, nivel: datos.nivel + 1 });
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleAtributo = (e) => {
        setFicha({ ...ficha, atributos: { ...ficha.atributos, [e.target.name]: parseInt(e.target.value) || 0 } });
    };

    const handleVida = (e) => {
        setFicha({ ...ficha, combate: { ...ficha.combate, [e.target.name]: parseInt(e.target.value) || 0 } });
    };

    const calcularModificador = (valor) => Math.floor((valor - 10) / 2);
    const formatearMod = (mod) => mod >= 0 ? `+${mod}` : `${mod}`;

    const claseData = ficha ? CLASES[ficha.clase] : null;
    const nivelActual = ficha?.nivel || 1;
    const bonComp = BONIFICADOR_COMPETENCIA[nivelActual - 1];
    const tocaSubclase = claseData && claseData.nivel_subclase === nivelActual && !ficha?.subclase;

    const handleSubmit = async () => {
        setGuardando(true);
        setError('');
        try {
            const datosFinales = { ...ficha };
            if (tocaSubclase && subclaseElegida) {
                datosFinales.subclase = subclaseElegida;
            }
            await subirNivelRequest(id, datosFinales);
            navigate(`/personajes/${id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al subir de nivel');
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return <div className={styles.cargando}>Cargando personaje...</div>;
    if (!personaje || !ficha) return <div className={styles.cargando}>Personaje no encontrado.</div>;

    const PASOS = ['Atributos', ficha.combate ? 'Puntos de vida' : null].filter(Boolean);

    return (
        <div className={styles.container}>
            <div className={styles.cabecera}>
                <h1>⬆ Subir a nivel {ficha.nivel}</h1>
                <button className={styles.botonVolver} onClick={() => navigate(`/personajes/${id}`)}>← Volver</button>
            </div>

            <div className={styles.infoPersonaje}>
                <span className={styles.nombre}>{personaje.nombre}</span>
                <span className={styles.clase}>{claseData?.nombre || ficha.clase} — Nivel {ficha.nivel}</span>
                <span className={styles.bonComp}>Bonificador de competencia: {formatearMod(bonComp)}</span>
            </div>

            {/* Barra de progreso */}
            <div className={styles.progreso}>
                {PASOS.map((p, i) => (
                    <div key={i} className={styles.pasoWrapper}>
                        <div className={`${styles.pasoBola} ${i < paso ? styles.pasoCompletado : ''} ${i === paso ? styles.pasoActivo : ''}`}>
                            {i < paso ? '✓' : i + 1}
                        </div>
                        <span className={`${styles.pasoLabel} ${i === paso ? styles.pasoLabelActivo : ''}`}>{p}</span>
                        {i < PASOS.length - 1 && <div className={`${styles.pasoLinea} ${i < paso ? styles.pasoLineaCompletada : ''}`} />}
                    </div>
                ))}
            </div>

            <div className={styles.card}>
                {error && <p className={styles.error}>{error}</p>}

                {/* Paso 1 - Atributos */}
                {paso === 0 && (
                    <div className={styles.paso}>
                        <h2>Atributos</h2>
                        <p className={styles.descripcion}>Revisa y actualiza tus atributos si has ganado alguna mejora.</p>
                        <div className={styles.gridAtributos}>
                            {Object.entries(ficha.atributos).map(([attr, valor]) => {
                                const mod = calcularModificador(valor);
                                return (
                                    <div key={attr} className={styles.atributo}>
                                        <label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</label>
                                        <input
                                            type="number"
                                            name={attr}
                                            value={valor}
                                            onChange={handleAtributo}
                                            className={styles.inputNumero}
                                            min={1}
                                            max={20}
                                        />
                                        <span className={styles.modificador}>{formatearMod(mod)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Paso 2 - Vida */}
                {paso === 1 && (
                    <div className={styles.paso}>
                        <h2>Puntos de vida</h2>
                        <p className={styles.descripcion}>
                            Al subir de nivel ganas {claseData?.dado_golpe || '1d8'} + modificador de Constitución ({formatearMod(calcularModificador(ficha.atributos.constitucion))}) de puntos de vida.
                        </p>
                        <div className={styles.gridVida}>
                            <div className={styles.campo}>
                                <label>Puntos de vida máximos</label>
                                <input
                                    type="number"
                                    name="puntos_vida_max"
                                    value={ficha.combate.puntos_vida_max}
                                    onChange={handleVida}
                                    className={styles.input}
                                    min={1}
                                />
                            </div>
                            <div className={styles.campo}>
                                <label>Puntos de vida actuales</label>
                                <input
                                    type="number"
                                    name="puntos_vida_actual"
                                    value={ficha.combate.puntos_vida_actual}
                                    onChange={handleVida}
                                    className={styles.input}
                                    min={0}
                                />
                            </div>
                        </div>

                        {/* Selector de subclase si toca */}
                        {tocaSubclase && (
                            <div className={styles.subclase}>
                                <h3>¡Elige tu subclase!</h3>
                                <p className={styles.descripcion}>Has alcanzado el nivel {nivelActual}, es momento de especializarte.</p>
                                <select
                                    value={subclaseElegida}
                                    onChange={e => setSubclaseElegida(e.target.value)}
                                    className={styles.input}
                                >
                                    <option value="">Selecciona subclase...</option>
                                    {claseData.subclases.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Navegación */}
                <div className={styles.navegacion}>
                    {paso > 0 && (
                        <button className={styles.botonSecundario} onClick={() => setPaso(paso - 1)}>
                            ← Anterior
                        </button>
                    )}
                    {paso < PASOS.length - 1 && (
                        <button className={styles.botonPrimario} onClick={() => setPaso(paso + 1)}>
                            Siguiente →
                        </button>
                    )}
                    {paso === PASOS.length - 1 && (
                        <button className={styles.botonPrimario} onClick={handleSubmit} disabled={guardando}>
                            {guardando ? 'Guardando...' : '⬆ Confirmar nivel'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubirNivel;