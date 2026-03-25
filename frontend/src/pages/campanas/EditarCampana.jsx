import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCampanaRequest, editarCampanaRequest } from '../../services/campanaService';
import styles from './CrearCampana.module.css';

const EditarCampana = () => {
    const [form, setForm] = useState({ titulo: '', descripcion: '' });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        cargarCampana();
    }, []);

    const cargarCampana = async () => {
        try {
            const res = await getCampanaRequest(id);
            setForm({ titulo: res.data.titulo, descripcion: res.data.descripcion || '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            await editarCampanaRequest(id, form);
            navigate('/campanas');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al editar la campaña');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cabecera}>
                <h1>Editar campaña</h1>
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
                    <div className={styles.botones}>
                        <button type="button" className={styles.botonSecundario} onClick={() => navigate('/campanas')}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.botonPrimario} disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarCampana;