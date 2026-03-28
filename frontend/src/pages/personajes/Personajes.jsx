import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonajesRequest, eliminarPersonajeRequest } from '../../services/personajeService';
import PersonajeCard from '../../components/character/PersonajeCard';
import styles from './Personajes.module.css';

const Personajes = () => {
    const [personajes, setPersonajes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        cargarPersonajes();
    }, []);

    const cargarPersonajes = async () => {
        try {
            const res = await getPersonajesRequest();
            setPersonajes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar este personaje?')) return;
        try {
            await eliminarPersonajeRequest(id);
            setPersonajes(personajes.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (cargando) return <div className={styles.cargando}>Cargando personajes...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.cabecera}>
                <h1>Mis personajes</h1>
                <button className={styles.botonPrimario} onClick={() => navigate('/personajes/crear')}>
                    + Crear personaje
                </button>
            </div>

            {personajes.length === 0 ? (
                <div className={styles.vacio}>
                    <p>No tienes personajes todavía.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {personajes.map(personaje => (
                        <PersonajeCard
                            key={personaje.id}
                            personaje={personaje}
                            onEliminar={handleEliminar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Personajes;