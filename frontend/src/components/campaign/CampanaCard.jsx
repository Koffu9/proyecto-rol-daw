import { useNavigate } from 'react-router-dom';
import styles from './CampanaCard.module.css';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
const CampanaCard = ({ campana, onEliminar }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.card} onClick={() => navigate(`/campanas/${campana.id}`)}>
            <div className={styles.imagen}>
                <img
                    src={campana.mapa_url || '../../public/default-campana.jfif'}
                    alt={campana.titulo}
                />
            </div>
            <div className={styles.contenido}>
                <h3>{campana.titulo}</h3>
                <p>{campana.descripcion}</p>
            </div>
            <div className={styles.botones} onClick={e => e.stopPropagation()}>
                <button className={styles.botonEditar} onClick={() => navigate(`/campanas/${campana.id}/editar`)}>
                    Editar
                </button>
                <button className={styles.botonEliminar} onClick={() => onEliminar(campana.id)}>
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default CampanaCard;