import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { GiCrossedSwords, GiWizardFace, GiDiceTwentyFacesTwenty, GiSpellBook } from 'react-icons/gi';

const Home = () => {
    return (
        <div className={styles.home}>

            {/* Hero */}
            <section className={styles.hero}>
                <h1>Tu aventura comienza aquí</h1>
                <p>Gestiona tus campañas, personajes y partidas de rol en un solo lugar. Para partidas online y presenciales.</p>
                <div className={styles.heroBotones}>
                    <Link to="/register" className={styles.botonPrimario}>Empieza gratis</Link>
                    <Link to="/login" className={styles.botonSecundario}>Iniciar sesión</Link>
                </div>
            </section>

            {/* Características */}
            <section className={styles.caracteristicas}>
                <h2>Todo lo que necesitas para jugar</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <span className={styles.icono}><GiCrossedSwords/></span>
                        <h3>Campañas</h3>
                        <p>Crea y gestiona tus campañas. Invita jugadores, organiza sesiones y lleva el control de tu historia.</p>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.icono}><GiWizardFace /></span>
                        <h3>Personajes</h3>
                        <p>Crea personajes con fichas completas adaptadas a cada sistema de rol.</p>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.icono}><GiDiceTwentyFacesTwenty /></span>
                        <h3>Dados</h3>
                        <p>Tira dados con fórmulas personalizadas y consulta el historial de tiradas de tus partidas.</p>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.icono}><GiSpellBook /></span>
                        <h3>Juegos</h3>
                        <p>Explora los sistemas de rol disponibles y encuentra el que mejor se adapte a tu grupo.</p>
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className={styles.cta}>
                <h2>¿Listo para tu próxima aventura?</h2>
                <p>Únete a TodoRol y empieza a jugar hoy mismo.</p>
                <Link to="/register" className={styles.botonPrimario}>Crear cuenta gratis</Link>
            </section>

        </div>
    );
};

export default Home;