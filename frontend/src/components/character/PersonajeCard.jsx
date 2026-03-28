import { useNavigate } from 'react-router-dom';
import styles from './PersonajeCard.module.css';

const PersonajeCard = ({ personaje, onEliminar }) => {
    const navigate = useNavigate();

    // Calculamos las iniciales para el placeholder
    const iniciales = personaje.nombre
        ? personaje.nombre.slice(0, 2).toUpperCase()
        : '??';

    // Construimos la línea de raza + clase + nivel
    const datos = personaje.datos ? JSON.parse(personaje.datos) : null;
    const subtitulo = datos
        ? `${datos.raza || ''} ${datos.clase || ''} Nv.${datos.nivel || 1}`
        : 'Sin ficha';

    // Nombre del sistema
    const sistema = personaje.sistema === 'dnd' ? 'D&D 5e' : personaje.sistema === 'jth' ? 'Journey to Halo' : 'Sin sistema';

    return (
        <div className={styles.card} onClick={() => navigate(`/personajes/${personaje.id}`)}>
            <div className={styles.avatar}>
                {personaje.imagen_url ? (
                    <img src={personaje.imagen_url} alt={personaje.nombre} />
                ) : (
                    <div className={styles.avatarPlaceholder}>{iniciales}</div>
                )}
            </div>
            <div className={styles.info}>
                <h3>{personaje.nombre}</h3>
                <p className={styles.subtitulo}>{subtitulo}</p>
                <p className={styles.sistema}>{sistema}</p>
                <p className={styles.campana}>
                    {personaje.campana_titulo ? `📖 ${personaje.campana_titulo}` : 'Sin campaña'}
                </p>
            </div>
            <div className={styles.botones} onClick={e => e.stopPropagation()}>
                <button className={styles.botonEditar} onClick={() => navigate(`/personajes/${personaje.id}/editar`)}>
                    Editar
                </button>
                <button className={styles.botonEliminar} onClick={() => onEliminar(personaje.id)}>
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default PersonajeCard;