import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerRequest, loginRequest } from '../../services/authService';
import styles from './Register.module.css';

const Register = () => {
    const [form, setForm] = useState({ nombre_usuario: '', email: '', password: '', confirmar_password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmar_password) {
            return setError('Las contraseñas no coinciden');
        }

        try {
            await registerRequest({ nombre_usuario: form.nombre_usuario, email: form.email, password: form.password });
            const res = await loginRequest({ email: form.email, password: form.password });
            login(res.data.token, res.data.usuario);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrarse');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.titulo}>Crear cuenta</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="nombre_usuario"
                        placeholder="Nombre de usuario"
                        value={form.nombre_usuario}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
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
                    <input
                        type="password"
                        name="confirmar_password"
                        placeholder="Confirmar contraseña"
                        value={form.confirmar_password}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.boton}>Registrarse</button>
                </form>
                <p className={styles.link}>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;