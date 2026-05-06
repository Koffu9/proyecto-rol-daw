import { useState } from 'react';
import { realizarTiradaRequest } from '../../services/tiradaService';
import styles from './DiceRoller.module.css';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';

const DADOS_RAPIDOS = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100'];

const DiceRoller = ({ id_personaje, id_campana, onTirada, personajes = [], npcs = [], esMaster = false }) => {
    const [formula, setFormula] = useState('');
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState('');

    const getIdPersonaje = () => {
        if (personajeSeleccionado) return parseInt(personajeSeleccionado);
        return id_personaje;
    };

    const tirar = async (formulaUsada) => {
        const f = formulaUsada || formula;
        if (!f.trim()) return setError('Escribe una fórmula');
        setCargando(true);
        setError('');
        try {
            const res = await realizarTiradaRequest(f, getIdPersonaje(), id_campana);
            setResultado(res.data);
            if (onTirada) onTirada(res.data);
        } catch (err) {
            setError('Fórmula no válida');
        } finally {
            setCargando(false);
        }
    };

    // Opciones del desplegable según rol
    const opciones = esMaster
        ? npcs.map(n => ({ id: n.id, label: `🎭 ${n.nombre}` }))
        : personajes.length > 1
            ? personajes.map(p => ({ id: p.id, label: ` ${p.nombre}` }))
            : [];

    return (
        <div className={styles.container}>
            <h3 className={styles.titulo}>Tirador de dados</h3>

            {/* Selector de personaje/NPC */}
            {opciones.length > 0 && (
                <div className={styles.selectorPersonaje}>
                    <label className={styles.selectorLabel}>
                        {esMaster ? 'Tirar como NPC' : 'Tirar como personaje'}
                    </label>
                    <select
                        className={styles.selector}
                        value={personajeSeleccionado}
                        onChange={e => setPersonajeSeleccionado(e.target.value)}
                    >
                        <option value="">— Yo mismo —</option>
                        {opciones.map(o => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Dados rápidos */}
            <div className={styles.dadosRapidos}>
                {DADOS_RAPIDOS.map(dado => (
                    <button key={dado} className={styles.dadoBoton} onClick={() => {
                        setFormula(dado);
                        tirar(dado);
                    }}>
                        {dado}
                    </button>
                ))}
            </div>

            {/* Input de fórmula */}
            <div className={styles.formulaInput}>
                <input
                    type="text"
                    value={formula}
                    onChange={e => setFormula(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && tirar()}
                    className={styles.input}
                    placeholder="Ej: 2d6+3, 1d20+5..."
                />
                <button className={styles.botonTirar} onClick={() => tirar()} disabled={cargando}>
                    {cargando ? '...' : <><GiDiceTwentyFacesTwenty /> Tirar</>}
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {resultado && (
                <div className={styles.resultado}>
                    <div className={styles.resultadoTotal}>
                        <span className={styles.resultadoNumero}>{resultado.total}</span>
                        <span className={styles.resultadoFormula}>{resultado.formula}</span>
                    </div>
                    <div className={styles.resultadoDados}>
                        {resultado.dados.map((d, i) => (
                            <span key={i} className={styles.dado}>
                                d{d.caras}: <strong>{d.resultado}</strong>
                            </span>
                        ))}
                        {resultado.modificador !== 0 && (
                            <span className={styles.dado}>
                                Mod: <strong>{resultado.modificador >= 0 ? '+' : ''}{resultado.modificador}</strong>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiceRoller;