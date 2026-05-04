import { useNavigate } from 'react-router-dom';
import styles from './Juegos.module.css';

const Juegos = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1>Juegos</h1>
            <p className={styles.subtitulo}>Sistemas de rol disponibles en TodoRol</p>

            <div className={styles.grid}>
                {/* D&D 5e */}
                <div className={styles.juegoCard}>
                    <div className={styles.juegoImagen}>
                        <img src="https://upload.wikimedia.org/wikipedia/en/8/8e/Dungeons_%26_Dragons_5th_Edition_logo.svg" alt="D&D 5e" />
                    </div>
                    <div className={styles.juegoInfo}>
                        <div className={styles.juegoHeader}>
                            <h2>Dungeons & Dragons 5e</h2>
                            <span className={styles.badgeDisponible}>Disponible</span>
                        </div>
                        <p className={styles.juegoDescripcion}>
                            El juego de rol más popular del mundo. Crea personajes épicos, explora mazmorras y vive aventuras inolvidables en un mundo de fantasía medieval.
                        </p>
                        <div className={styles.juegoStats}>
                            <div className={styles.juegoStat}>
                                <span className={styles.juegoStatNumero}>12</span>
                                <span className={styles.juegoStatLabel}>Clases</span>
                            </div>
                            <div className={styles.juegoStat}>
                                <span className={styles.juegoStatNumero}>9</span>
                                <span className={styles.juegoStatLabel}>Razas</span>
                            </div>
                            <div className={styles.juegoStat}>
                                <span className={styles.juegoStatNumero}>9</span>
                                <span className={styles.juegoStatLabel}>Alineamientos</span>
                            </div>
                        </div>
                        <button className={styles.botonPrimario} onClick={() => navigate('/personajes/crear')}>
                            Crear personaje
                        </button>
                    </div>
                </div>

                {/* Journey to Halo - Próximamente */}
                <div className={`${styles.juegoCard} ${styles.proximamente}`}>
                    <div className={styles.proximamenteOverlay}>
                        <span>Próximamente</span>
                    </div>
                    <div className={styles.juegoImagen}>
                        <div className={styles.imagenPlaceholder}>🎲</div>
                    </div>
                    <div className={styles.juegoInfo}>
                        <div className={styles.juegoHeader}>
                            <h2>Journey to Halo</h2>
                            <span className={styles.badgeProximamente}>Próximamente</span>
                        </div>
                        <p className={styles.juegoDescripcion}>
                            Un sistema de rol original creado por veterano del rol. Nuevas mecánicas, un universo único y una experiencia de juego diferente te esperan muy pronto. Lo mejor de los juegos de mesa y lo mejor de los juegos de rol.
                        </p>
                        <div className={styles.juegoStats}>
                            <div className={styles.juegoStat}>
                                <span className={styles.juegoStatNumero}>?</span>
                                <span className={styles.juegoStatLabel}>Clases</span>
                            </div>
                            <div className={styles.juegoStat}>
                                <span className={styles.juegoStatNumero}>?</span>
                                <span className={styles.juegoStatLabel}>Razas</span>
                            </div>
                            <div className={styles.juegoStat}>
                                <span className={styles.juegoStatNumero}>?</span>
                                <span className={styles.juegoStatLabel}>Facciones</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Juegos;