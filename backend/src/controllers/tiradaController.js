const tiradaModel = require('../models/tiradaModel');

// Función para parsear y ejecutar una fórmula de dados (ej: 2d6+3)
const parsearFormula = (formula) => {
    const resultado = { dados: [], modificador: 0, total: 0 };
    
    // Limpiamos espacios y ponemos en minúsculas
    const formulaLimpia = formula.replace(/\s/g, '').toLowerCase();
    
    // Separamos los componentes (ej: 2d6+1d4+3 -> ['2d6', '1d4', '3'])
    const partes = formulaLimpia.split(/(?=[+-])/);
    
    partes.forEach(parte => {
        if (parte.includes('d')) {
            // Es un dado (ej: 2d6)
            const signo = parte.startsWith('-') ? -1 : 1;
            const parteClean = parte.replace(/^[+-]/, '');
            const [cantidad, caras] = parteClean.split('d').map(Number);
            
            for (let i = 0; i < cantidad; i++) {
                const tirada = Math.floor(Math.random() * caras) + 1;
                resultado.dados.push({ caras, resultado: tirada * signo });
                resultado.total += tirada * signo;
            }
        } else {
            // Es un modificador (ej: +3)
            const mod = parseInt(parte);
            resultado.modificador += mod;
            resultado.total += mod;
        }
    });

    return resultado;
};

// Realiza una tirada y la guarda en la base de datos
const realizarTirada = async (req, res) => {
    const { formula, id_personaje, id_campana } = req.body;
    const id_usuario = req.usuario.id;

    try {
        if (!formula) return res.status(400).json({ error: 'La fórmula es obligatoria' });

        const resultado = parsearFormula(formula);
        
        await tiradaModel.crearTirada(
            formula,
            resultado.total,
            { dados: resultado.dados, modificador: resultado.modificador },
            id_usuario,
            id_personaje || null,
            id_campana || null
        );

        res.status(201).json({
            formula,
            dados: resultado.dados,
            modificador: resultado.modificador,
            total: resultado.total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene el historial de tiradas del usuario
const getTiradasUsuario = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const tiradas = await tiradaModel.getTiradasByUsuario(id_usuario);
        res.json(tiradas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene el historial de tiradas de una campaña
const getTiradasCampana = async (req, res) => {
    const { id } = req.params;
    try {
        const tiradas = await tiradaModel.getTiradasByCampana(id);
        res.json(tiradas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { realizarTirada, getTiradasUsuario, getTiradasCampana };