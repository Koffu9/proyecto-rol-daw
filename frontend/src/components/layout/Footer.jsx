import { Link } from 'react-router-dom';
import { FaDiscord, FaTwitter, FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.contenido}>
                <div className={styles.marca}>
                    <h3>🎲 TodoRol</h3>
                    <p>Tu plataforma de rol en español. Gestiona campañas, personajes y partidas en un solo lugar.</p>
                </div>

                <div className={styles.columna}>
                    <h4>Navegación</h4>
                    <Link to="/dashboard">Inicio</Link>
                    <Link to="/campanas">Campañas</Link>
                    <Link to="/personajes">Personajes</Link>
                    <Link to="/juegos">Juegos</Link>
                </div>

                <div className={styles.columna}>
                    <h4>Legal</h4>
                    <Link to="/sobre-nosotros">Sobre nosotros</Link>
                    <Link to="/contacto">Contacto</Link>
                    <Link to="/privacidad">Política de privacidad</Link>
                </div>

                <div className={styles.columna}>
                    <h4>Síguenos</h4>
                    <div className={styles.redes}>
                        <a href="https://discord.com" target="_blank" rel="noreferrer"><FaDiscord /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>© 2026 TodoRol. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;