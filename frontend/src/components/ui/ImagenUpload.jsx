import { useState } from 'react';
import { subirImagenRequest } from '../../services/uploadService';
import styles from './ImagenUpload.module.css';

const ImageUpload = ({ imagenActual, onImagenSubida }) => {
    const [preview, setPreview] = useState(imagenActual || null);
    const [subiendo, setSubiendo] = useState(false);

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setSubiendo(true);
        try {
            const url = await subirImagenRequest(file);
            onImagenSubida(url);
        } catch (error) {
            console.error(error);
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.preview}>
                {preview ? (
                    <img src={preview} alt="Preview" className={styles.imagen} />
                ) : (
                    <div className={styles.placeholder}>📷</div>
                )}
                {subiendo && <div className={styles.subiendo}>Subiendo...</div>}
            </div>
            <label className={styles.boton}>
                {preview ? 'Cambiar imagen' : 'Subir imagen'}
                <input type="file" accept="image/*" onChange={handleChange} hidden />
            </label>
        </div>
    );
};

export default ImageUpload;