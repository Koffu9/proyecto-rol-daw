import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginRequest } from '../../services/authService';
import styles from './Login.module.css';
import AuthLogo from '../../components/auth/AuthLogo';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await loginRequest(form);
            login(res.data.token, res.data.usuario);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <AuthLogo />
                <h1 className={styles.titulo}>Iniciar sesión</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.boton}>Entrar</button>
                </form>
                <p className={styles.link}>
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;