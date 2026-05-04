import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCampanaRequest } from '../../services/campanaService';
import styles from './CrearCampana.module.css';
import ImageUpload from '../../components/ui/ImagenUpload';

const CrearCampana = () => {
    const [form, setForm] = useState({ titulo: '', descripcion: '', mapa_url: '' });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            await crearCampanaRequest(form);
            navigate('/campanas');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la campaña');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cabecera}>
                <h1>Crear campaña</h1>
                <button className={styles.botonVolver} onClick={() => navigate('/campanas')}>
                    ← Volver
                </button>
            </div>

            <div className={styles.card}>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.campo}>
                        <label>Título</label>
                        <input
                            type="text"
                            name="titulo"
                            placeholder="Nombre de la campaña"
                            value={form.titulo}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.campo}>
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Describe tu campaña..."
                            value={form.descripcion}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows={5}
                        />
                    </div>
                    <div className={styles.campo}>
                        <label>Imagen de portada</label>
                        <ImageUpload
                            onImagenSubida={(url) => setForm(prev => ({ ...prev, mapa_url: url }))}
                        />
                    </div>
                    <div className={styles.botones}>
                        <button type="button" className={styles.botonSecundario} onClick={() => navigate('/campanas')}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.botonPrimario} disabled={cargando}>
                            {cargando ? 'Creando...' : 'Crear campaña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearCampana;