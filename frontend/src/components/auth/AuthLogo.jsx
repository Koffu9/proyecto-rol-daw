import { Link } from 'react-router-dom';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import styles from './AuthLogo.module.css';

const AuthLogo = () => {
    return (
        <Link to="/" className={styles.logo}>
            <GiDiceTwentyFacesTwenty className={styles.icono} />
            <span className={styles.texto}>TodoRol</span>
        </Link>
    );
};

export default AuthLogo;