import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPersonajeRequest } from '../../services/personajeService';
import styles from './CrearPersonaje.module.css';

const PASOS = ['Info básica', 'Atributos', 'Combate', 'Competencias', 'Equipo y trasfondo'];

const CrearPersonaje = () => {
    const [pasoActual, setPasoActual] = useState(0);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        // Info básica
        nombre: '',
        descripcion: '',
        clase: '',
        raza: '',
        trasfondo: '',
        alineamiento: '',
        // Atributos
        atributos: {
            fuerza: 10, destreza: 10, constitucion: 10,
            inteligencia: 10, sabiduria: 10, carisma: 10
        },
        // Combate
        combate: {
            puntos_vida_max: 8, puntos_vida_actual: 8,
            dados_golpe: '1d8', clase_armadura: 10,
            iniciativa: 0, velocidad: 30
        },
        // Competencias
        tiradas_salvacion: {
            fuerza: false, destreza: false, constitucion: false,
            inteligencia: false, sabiduria: false, carisma: false
        },
        habilidades: {
            acrobacias: false, arcanos: false, atletismo: false,
            engano: false, historia: false, intimidacion: false,
            juego_de_manos: false, medicina: false, naturaleza: false,
            percepcion: false, perspicacia: false, persuasion: false,
            religion: false, sigilo: false, supervivencia: false,
            trato_animales: false
        },
        // Equipo y trasfondo
        equipo: {
            inventario: [],
            monedas: { po: 0, pp: 0, pe: 0, pn: 0, pc: 0 }
        },
        trasfondo_rp: {
            rasgos_personalidad: '',
            ideales: '',
            vinculos: '',
            defectos: ''
        }
    });

    const [inventarioInput, setInventarioInput] = useState({
        nombre: '',
        es_arma: false,
        dado_dano: '1d6',
        atributo: 'fuerza',
        competencia: false
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAtributo = (e) => {
        setForm({ ...form, atributos: { ...form.atributos, [e.target.name]: parseInt(e.target.value) || 0 } });
    };

    const handleCombate = (e) => {
        setForm({ ...form, combate: { ...form.combate, [e.target.name]: e.target.value } });
    };

    const handleSalvacion = (e) => {
        setForm({ ...form, tiradas_salvacion: { ...form.tiradas_salvacion, [e.target.name]: e.target.checked } });
    };

    const handleHabilidad = (e) => {
        setForm({ ...form, habilidades: { ...form.habilidades, [e.target.name]: e.target.checked } });
    };

    const handleMoneda = (e) => {
        setForm({ ...form, equipo: { ...form.equipo, monedas: { ...form.equipo.monedas, [e.target.name]: parseInt(e.target.value) || 0 } } });
    };

    const handleTrasfondoRp = (e) => {
        setForm({ ...form, trasfondo_rp: { ...form.trasfondo_rp, [e.target.name]: e.target.value } });
    };

    const agregarInventario = () => {
        if (!inventarioInput.nombre.trim()) return;
        const objeto = inventarioInput.es_arma
            ? { ...inventarioInput }
            : { nombre: inventarioInput.nombre, es_arma: false };
        setForm({ ...form, equipo: { ...form.equipo, inventario: [...form.equipo.inventario, objeto] } });
        setInventarioInput({ nombre: '', es_arma: false, dado_dano: '1d6', atributo: 'fuerza', competencia: false });
    };

    const eliminarInventario = (index) => {
        const nuevo = form.equipo.inventario.filter((_, i) => i !== index);
        setForm({ ...form, equipo: { ...form.equipo, inventario: nuevo } });
    };

    const handleSubmit = async () => {
        if (!form.nombre.trim()) return setError('El nombre es obligatorio');
        setCargando(true);
        setError('');
        try {
            await crearPersonajeRequest({
                nombre: form.nombre,
                descripcion: form.descripcion,
                sistema: 'dnd',
                datos: {
                    clase: form.clase,
                    subclase: '',
                    raza: form.raza,
                    nivel: 1,
                    trasfondo: form.trasfondo,
                    alineamiento: form.alineamiento,
                    atributos: form.atributos,
                    combate: form.combate,
                    tiradas_salvacion: form.tiradas_salvacion,
                    habilidades: form.habilidades,
                    equipo: form.equipo,
                    trasfondo_rp: form.trasfondo_rp
                }
            });
            navigate('/personajes');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear el personaje');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cabecera}>
                <h1>Crear personaje</h1>
                <button className={styles.botonVolver} onClick={() => navigate('/personajes')}>← Volver</button>
            </div>

            {/* Barra de progreso */}
            <div className={styles.progreso}>
                {PASOS.map((paso, index) => (
                    <div key={index} className={styles.pasoWrapper}>
                        <div className={`${styles.pasoBola} ${index < pasoActual ? styles.pasoCompletado : ''} ${index === pasoActual ? styles.pasoActivo : ''}`}>
                            {index < pasoActual ? '✓' : index + 1}
                        </div>
                        <span className={`${styles.pasoLabel} ${index === pasoActual ? styles.pasoLabelActivo : ''}`}>{paso}</span>
                        {index < PASOS.length - 1 && <div className={`${styles.pasoLinea} ${index < pasoActual ? styles.pasoLineaCompletada : ''}`} />}
                    </div>
                ))}
            </div>

            {/* Contenido del paso */}
            <div className={styles.card}>
                {error && <p className={styles.error}>{error}</p>}

                {/* Paso 1 - Info básica */}
                {pasoActual === 0 && (
                    <div className={styles.paso}>
                        <h2>Información básica</h2>
                        <div className={styles.grid2}>
                            <div className={styles.campo}>
                                <label>Nombre *</label>
                                <input name="nombre" value={form.nombre} onChange={handleChange} className={styles.input} placeholder="Nombre del personaje" required />
                            </div>
                            <div className={styles.campo}>
                                <label>Clase</label>
                                <input name="clase" value={form.clase} onChange={handleChange} className={styles.input} placeholder="Ej: Guerrero, Pícaro..." />
                            </div>
                            <div className={styles.campo}>
                                <label>Raza</label>
                                <input name="raza" value={form.raza} onChange={handleChange} className={styles.input} placeholder="Ej: Humano, Elfo..." />
                            </div>
                            <div className={styles.campo}>
                                <label>Trasfondo</label>
                                <input name="trasfondo" value={form.trasfondo} onChange={handleChange} className={styles.input} placeholder="Ej: Criminal, Soldado..." />
                            </div>
                            <div className={styles.campo}>
                                <label>Alineamiento</label>
                                <select name="alineamiento" value={form.alineamiento} onChange={handleChange} className={styles.input}>
                                    <option value="">Selecciona...</option>
                                    <option>Legal bueno</option>
                                    <option>Neutral bueno</option>
                                    <option>Caótico bueno</option>
                                    <option>Legal neutral</option>
                                    <option>Neutral</option>
                                    <option>Caótico neutral</option>
                                    <option>Legal malvado</option>
                                    <option>Neutral malvado</option>
                                    <option>Caótico malvado</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.campo}>
                            <label>Descripción</label>
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className={styles.textarea} rows={3} placeholder="Descripción del personaje..." />
                        </div>
                    </div>
                )}

                {/* Paso 2 - Atributos */}
                {pasoActual === 1 && (
                    <div className={styles.paso}>
                        <h2>Atributos</h2>
                        <div className={styles.gridAtributos}>
                            {Object.keys(form.atributos).map(attr => (
                                <div key={attr} className={styles.atributo}>
                                    <label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</label>
                                    <input type="number" name={attr} value={form.atributos[attr]} onChange={handleAtributo} className={styles.inputNumero} min={1} max={20} />
                                    <span className={styles.modificador}>
                                        {Math.floor((form.atributos[attr] - 10) / 2) >= 0 ? '+' : ''}
                                        {Math.floor((form.atributos[attr] - 10) / 2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Paso 3 - Combate */}
                {pasoActual === 2 && (
                    <div className={styles.paso}>
                        <h2>Combate</h2>
                        <div className={styles.grid2}>
                            <div className={styles.campo}>
                                <label>Puntos de vida máximos</label>
                                <input type="number" name="puntos_vida_max" value={form.combate.puntos_vida_max} onChange={handleCombate} className={styles.input} min={1} />
                            </div>
                            <div className={styles.campo}>
                                <label>Puntos de vida actuales</label>
                                <input type="number" name="puntos_vida_actual" value={form.combate.puntos_vida_actual} onChange={handleCombate} className={styles.input} min={0} />
                            </div>
                            <div className={styles.campo}>
                                <label>Dados de golpe</label>
                                <input name="dados_golpe" value={form.combate.dados_golpe} onChange={handleCombate} className={styles.input} placeholder="Ej: 1d8" />
                            </div>
                            <div className={styles.campo}>
                                <label>Clase de armadura</label>
                                <input type="number" name="clase_armadura" value={form.combate.clase_armadura} onChange={handleCombate} className={styles.input} min={1} />
                            </div>
                            <div className={styles.campo}>
                                <label>Iniciativa</label>
                                <input type="number" name="iniciativa" value={form.combate.iniciativa} onChange={handleCombate} className={styles.input} />
                            </div>
                            <div className={styles.campo}>
                                <label>Velocidad (pies)</label>
                                <input type="number" name="velocidad" value={form.combate.velocidad} onChange={handleCombate} className={styles.input} min={0} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Paso 4 - Competencias */}
                {pasoActual === 3 && (
                    <div className={styles.paso}>
                        <h2>Competencias</h2>
                        <div className={styles.seccion}>
                            <h3>Tiradas de salvación</h3>
                            <div className={styles.gridCheck}>
                                {Object.keys(form.tiradas_salvacion).map(sal => (
                                    <label key={sal} className={styles.checkLabel}>
                                        <input type="checkbox" name={sal} checked={form.tiradas_salvacion[sal]} onChange={handleSalvacion} />
                                        {sal.charAt(0).toUpperCase() + sal.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.seccion}>
                            <h3>Habilidades</h3>
                            <div className={styles.gridCheck}>
                                {Object.keys(form.habilidades).map(hab => (
                                    <label key={hab} className={styles.checkLabel}>
                                        <input type="checkbox" name={hab} checked={form.habilidades[hab]} onChange={handleHabilidad} />
                                        {hab.replace(/_/g, ' ').charAt(0).toUpperCase() + hab.replace(/_/g, ' ').slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Paso 5 - Equipo y trasfondo */}
                {pasoActual === 4 && (
                    <div className={styles.paso}>
                        <h2>Equipo y trasfondo</h2>
                        <div className={styles.seccion}>
                            <h3>Inventario</h3>
                            <div className={styles.inventarioForm}>
                                <div className={styles.inventarioFila}>
                                    <input
                                        value={inventarioInput.nombre}
                                        onChange={e => setInventarioInput({ ...inventarioInput, nombre: e.target.value })}
                                        onKeyDown={e => e.key === 'Enter' && agregarInventario()}
                                        className={styles.input}
                                        placeholder="Nombre del objeto..."
                                    />
                                    <label className={styles.checkLabel}>
                                        <input
                                            type="checkbox"
                                            checked={inventarioInput.es_arma}
                                            onChange={e => setInventarioInput({ ...inventarioInput, es_arma: e.target.checked })}
                                        />
                                        Es arma
                                    </label>
                                </div>
                                {inventarioInput.es_arma && (
                                    <div className={styles.inventarioArma}>
                                        <div className={styles.campo}>
                                            <label>Dado de daño</label>
                                            <select
                                                value={inventarioInput.dado_dano}
                                                onChange={e => setInventarioInput({ ...inventarioInput, dado_dano: e.target.value })}
                                                className={styles.input}
                                            >
                                                <option>1d4</option>
                                                <option>1d6</option>
                                                <option>1d8</option>
                                                <option>1d10</option>
                                                <option>1d12</option>
                                                <option>2d6</option>
                                            </select>
                                        </div>
                                        <div className={styles.campo}>
                                            <label>Atributo</label>
                                            <select
                                                value={inventarioInput.atributo}
                                                onChange={e => setInventarioInput({ ...inventarioInput, atributo: e.target.value })}
                                                className={styles.input}
                                            >
                                                <option value="fuerza">Fuerza</option>
                                                <option value="destreza">Destreza</option>
                                            </select>
                                        </div>
                                        <label className={styles.checkLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInput.competencia}
                                                onChange={e => setInventarioInput({ ...inventarioInput, competencia: e.target.checked })}
                                            />
                                            Competencia
                                        </label>
                                    </div>
                                )}
                                <button type="button" className={styles.botonAnadir} onClick={agregarInventario}>
                                    Añadir objeto
                                </button>
                            </div>
                            <ul className={styles.inventarioLista}>
                                {form.equipo.inventario.map((item, i) => (
                                    <li key={i} className={styles.inventarioItem}>
                                        <span>
                                            {item.nombre}
                                            {item.es_arma && <span className={styles.armaTag}>⚔️ {item.dado_dano} ({item.atributo})</span>}
                                        </span>
                                        <button onClick={() => eliminarInventario(i)}>✕</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.seccion}>
                            <h3>Monedas</h3>
                            <div className={styles.gridMonedas}>
                                {Object.keys(form.equipo.monedas).map(moneda => (
                                    <div key={moneda} className={styles.moneda}>
                                        <label>{moneda.toUpperCase()}</label>
                                        <input type="number" name={moneda} value={form.equipo.monedas[moneda]} onChange={handleMoneda} className={styles.inputNumero} min={0} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.seccion}>
                            <h3>Trasfondo</h3>
                            <div className={styles.grid2}>
                                {Object.keys(form.trasfondo_rp).map(campo => (
                                    <div key={campo} className={styles.campo}>
                                        <label>{campo.replace(/_/g, ' ').charAt(0).toUpperCase() + campo.replace(/_/g, ' ').slice(1)}</label>
                                        <textarea name={campo} value={form.trasfondo_rp[campo]} onChange={handleTrasfondoRp} className={styles.textarea} rows={2} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navegación entre pasos */}
                <div className={styles.navegacion}>
                    {pasoActual > 0 && (
                        <button className={styles.botonSecundario} onClick={() => setPasoActual(pasoActual - 1)}>
                            ← Anterior
                        </button>
                    )}
                    {pasoActual < PASOS.length - 1 && (
                        <button className={styles.botonPrimario} onClick={() => setPasoActual(pasoActual + 1)}>
                            Siguiente →
                        </button>
                    )}
                    {pasoActual === PASOS.length - 1 && (
                        <button className={styles.botonPrimario} onClick={handleSubmit} disabled={cargando}>
                            {cargando ? 'Creando...' : 'Crear personaje'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrearPersonaje;