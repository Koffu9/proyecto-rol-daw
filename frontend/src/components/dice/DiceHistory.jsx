import { useState, useEffect } from 'react';
import { getTiradasUsuarioRequest, getTiradasCampanaRequest } from '../../services/tiradaService';
import styles from './DiceHistory.module.css';
import { GiCharacter } from 'react-icons/gi';
import { FiClock } from 'react-icons/fi';


const DiceHistory = ({ id_campana, refresh = 0 }) => {
    const [tiradas, setTiradas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarTiradas();
    }, [refresh]);

    const cargarTiradas = async () => {
        try {
            const res = id_campana
                ? await getTiradasCampanaRequest(id_campana)
                : await getTiradasUsuarioRequest();
            setTiradas(res.data);
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

    if (cargando) return <div className={styles.cargando}>Cargando historial...</div>;

    return (
        <div className={styles.container}>
            <h3 className={styles.titulo}>Historial de tiradas</h3>
            {tiradas.length === 0 ? (
                <p className={styles.vacio}>No hay tiradas todavía.</p>
            ) : (
                <div className={styles.lista}>
                    {tiradas.map(t => (
                        <div key={t.id} className={styles.tiradaItem}>
                            <span className={styles.total}>{t.resultado_total}</span>
                            <div className={styles.info}>
                                <span className={styles.formula}>{t.formula}</span>
                                <div className={styles.meta}>
                                    {id_campana && t.nombre_usuario && (
                                        <span className={styles.metaItem}>@{t.nombre_usuario}</span>
                                    )}
                                    {t.personaje_nombre && (
                                        <span className={styles.metaItem}>
                                            <GiCharacter /> {t.personaje_nombre}
                                        </span>
                                    )}
                                    <span className={styles.metaItem}>
                                        <FiClock /> {formatearFecha(t.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiceHistory;