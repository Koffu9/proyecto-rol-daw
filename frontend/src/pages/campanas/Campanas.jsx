import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCampanasRequest, eliminarCampanaRequest } from '../../services/campanaService';
import CampanaCard from '../../components/campaign/CampanaCard';
import styles from './Campanas.module.css';
import { unirseACampanaRequest } from '../../services/campanaService';

const Campanas = () => {
    const [campanas, setCampanas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalUnirse, setModalUnirse] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cargarCampanas();
    }, []);

    const cargarCampanas = async () => {
        try {
            const res = await getCampanasRequest();
            setCampanas(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar esta campaña?')) return;
        try {
            await eliminarCampanaRequest(id);
            setCampanas(campanas.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (cargando) return <div className={styles.cargando}>Cargando campañas...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.cabecera}>
                <h1>Mis campañas</h1>
                <div className={styles.botones}>
                    <button className={styles.botonSecundario} onClick={() => setModalUnirse(true)}>
                        Unirse a campaña
                    </button>
                    <button className={styles.botonPrimario} onClick={() => navigate('/campanas/crear')}>
                        Crear campaña
                    </button>
                </div>
            </div>

            {campanas.length === 0 ? (
                <div className={styles.vacio}>
                    <p>No tienes campañas todavía.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {campanas.map(campana => (
                        <CampanaCard
                            key={campana.id}
                            campana={campana}
                            onEliminar={handleEliminar}
                        />
                    ))}
                </div>
            )}

            {modalUnirse && (
                <ModalUnirse onCerrar={() => setModalUnirse(false)} onUnirse={cargarCampanas} />
            )}
        </div>
    );
};

const ModalUnirse = ({ onCerrar, onUnirse }) => {
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await unirseACampanaRequest(codigo);
            onUnirse();
            onCerrar();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al unirse a la campaña');
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onCerrar}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Unirse a campaña</h2>
                <p>Introduce el código de invitación que te ha dado el máster.</p>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <input
                        type="text"
                        placeholder="Código de invitación"
                        value={codigo}
                        onChange={e => setCodigo(e.target.value.toUpperCase())}
                        className={styles.input}
                        required
                    />
                    <div className={styles.modalBotones}>
                        <button type="button" className={styles.botonSecundario} onClick={onCerrar}>Cancelar</button>
                        <button type="submit" className={styles.botonPrimario}>Unirse</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Campanas;