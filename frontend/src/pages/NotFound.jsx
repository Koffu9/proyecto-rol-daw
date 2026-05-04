import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.codigo}>404</h1>
            <h2 className={styles.titulo}>Página no encontrada</h2>
            <p className={styles.descripcion}>La página que buscas no existe o ha sido movida.</p>
            <div className={styles.botones}>
                <button className={styles.botonPrimario} onClick={() => navigate('/')}>
                    Ir al inicio
                </button>
                <button className={styles.botonSecundario} onClick={() => navigate(-1)}>
                    Volver atrás
                </button>
            </div>
        </div>
    );
};

export default NotFound;