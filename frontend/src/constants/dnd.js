// Razas de D&D 5e con sus bonificadores de atributo
export const RAZAS = {
    draconido: {
        nombre: 'Dragonido',
        bonificadores: { fuerza: 2, carisma: 1 }
    },
    elfo: {
        nombre: 'Elfo',
        subrazas: {
            alto_elfo: {
                nombre: 'Alto elfo',
                bonificadores: { destreza: 2, inteligencia: 1 }
            },
            elfo_bosque: {
                nombre: 'Elfo de los bosques',
                bonificadores: { destreza: 2, sabiduria: 1 }
            },
            elfo_oscuro: {
                nombre: 'Elfo oscuro (Drow)',
                bonificadores: { destreza: 2, carisma: 1 }
            }
        }
    },
    enano: {
        nombre: 'Enano',
        subrazas: {
            enano_colina: {
                nombre: 'Enano de la colina',
                bonificadores: { constitucion: 2, sabiduria: 1 }
            },
            enano_montana: {
                nombre: 'Enano de la montaña',
                bonificadores: { constitucion: 2, fuerza: 2 }
            }
        }
    },
    gnomo: {
        nombre: 'Gnomo',
        subrazas: {
            gnomo_bosque: {
                nombre: 'Gnomo de los bosques',
                bonificadores: { inteligencia: 2, destreza: 1 }
            },
            gnomo_roca: {
                nombre: 'Gnomo de las rocas',
                bonificadores: { inteligencia: 2, constitucion: 1 }
            }
        }
    },
    humano: {
        nombre: 'Humano',
        bonificadores: { fuerza: 1, destreza: 1, constitucion: 1, inteligencia: 1, sabiduria: 1, carisma: 1 }
    },
    mediano: {
        nombre: 'Mediano',
        subrazas: {
            mediano_pie_alegre: {
                nombre: 'Mediano pie alegre',
                bonificadores: { destreza: 2, carisma: 1 }
            },
            mediano_robusto: {
                nombre: 'Mediano robusto',
                bonificadores: { destreza: 2, constitucion: 1 }
            }
        }
    },
    semielfo: {
        nombre: 'Semielfo',
        bonificadores: { carisma: 2, inteligencia: 1, sabiduria: 1 }
    },
    semiorco: {
        nombre: 'Semiorco',
        bonificadores: { fuerza: 2, constitucion: 1 }
    },
    tiefling: {
        nombre: 'Tiefling',
        bonificadores: { inteligencia: 1, carisma: 2 }
    }
};

export const CLASES = {
    barbaro: {
        nombre: 'Bárbaro',
        dado_golpe: '1d12',
        atributo_principal: 'fuerza',
        salvaciones: ['fuerza', 'constitucion'],
        nivel_subclase: 3,
        subclases: ['Berserker', 'Guerrero Totémico', 'Heraldo de la Tormenta', 'Espíritu Ancestral', 'Furia de la Batalla', 'Alma Salvaje']
    },
    bardo: {
        nombre: 'Bardo',
        dado_golpe: '1d8',
        atributo_principal: 'carisma',
        salvaciones: ['destreza', 'carisma'],
        nivel_subclase: 3,
        subclases: ['Colegio del Conocimiento', 'Colegio del Valor', 'Colegio de los Susurros', 'Colegio de la Creación', 'Colegio de la Elocuencia']
    },
    brujo: {
        nombre: 'Brujo',
        dado_golpe: '1d8',
        atributo_principal: 'carisma',
        salvaciones: ['sabiduria', 'carisma'],
        nivel_subclase: 1,
        subclases: ['El Archihada', 'El Celestial', 'El Genio', 'El Gran Antiguo', 'El Infernal', 'El Tomo de las Sombras']
    },
    clerigo: {
        nombre: 'Clérigo',
        dado_golpe: '1d8',
        atributo_principal: 'sabiduria',
        salvaciones: ['sabiduria', 'carisma'],
        nivel_subclase: 1,
        subclases: ['Dominio de la Arcana', 'Dominio de la Forja', 'Dominio de la Guerra', 'Dominio de la Luz', 'Dominio de la Muerte', 'Dominio de la Naturaleza', 'Dominio de la Tempestad', 'Dominio de la Travesura', 'Dominio de la Vida', 'Dominio del Conocimiento', 'Dominio del Engaño', 'Dominio del Orden']
    },
    druida: {
        nombre: 'Druida',
        dado_golpe: '1d8',
        atributo_principal: 'sabiduria',
        salvaciones: ['inteligencia', 'sabiduria'],
        nivel_subclase: 2,
        subclases: ['Círculo de la Luna', 'Círculo de la Tierra', 'Círculo de las Esporas', 'Círculo de los Sueños', 'Círculo del Pastor', 'Círculo del Fuego Estelar']
    },
    explorador: {
        nombre: 'Explorador',
        dado_golpe: '1d10',
        atributo_principal: 'destreza',
        salvaciones: ['fuerza', 'destreza'],
        nivel_subclase: 3,
        subclases: ['Cazador', 'Amo de las Bestias', 'Acechador del Horizonte', 'Exterminador de Monstruos', 'Merodeador']
    },
    guerrero: {
        nombre: 'Guerrero',
        dado_golpe: '1d10',
        atributo_principal: 'fuerza',
        salvaciones: ['fuerza', 'constitucion'],
        nivel_subclase: 3,
        subclases: ['Campeón', 'Caballero de Batalla', 'Caballero Místico', 'Maestro de Combate', 'Samurái', 'Arcano Arcano', 'Caballero Rúnico']
    },
    hechicero: {
        nombre: 'Hechicero',
        dado_golpe: '1d6',
        atributo_principal: 'carisma',
        salvaciones: ['constitucion', 'carisma'],
        nivel_subclase: 1,
        subclases: ['Origen Dracónico', 'Alma Salvaje', 'Línea de Sangre de Sombras', 'Magia Divina', 'Magia de Tormenta', 'Mente Aberrante']
    },
    mago: {
        nombre: 'Mago',
        dado_golpe: '1d6',
        atributo_principal: 'inteligencia',
        salvaciones: ['inteligencia', 'sabiduria'],
        nivel_subclase: 2,
        subclases: ['Escuela de Abjuración', 'Escuela de Conjuración', 'Escuela de Adivinación', 'Escuela de Encantamiento', 'Escuela de Evocación', 'Escuela de Ilusión', 'Escuela de Nigromancia', 'Escuela de Transmutación', 'Cronurgia', 'Graviturgia']
    },
    monje: {
        nombre: 'Monje',
        dado_golpe: '1d8',
        atributo_principal: 'destreza',
        salvaciones: ['fuerza', 'destreza'],
        nivel_subclase: 3,
        subclases: ['Camino de la Mano Abierta', 'Camino de la Sombra', 'Camino de los Cuatro Elementos', 'Camino del Sol', 'Camino del Guerrero del Dragón', 'Camino de la Misericordia']
    },
    paladin: {
        nombre: 'Paladín',
        dado_golpe: '1d10',
        atributo_principal: 'fuerza',
        salvaciones: ['sabiduria', 'carisma'],
        nivel_subclase: 3,
        subclases: ['Juramento de Devoción', 'Juramento de los Ancestros', 'Juramento de Venganza', 'Juramento de Conquista', 'Juramento de la Corona', 'Juramento de Gloria', 'Juramento de Redención', 'Rompejuramentos']
    },
    picaro: {
        nombre: 'Pícaro',
        dado_golpe: '1d8',
        atributo_principal: 'destreza',
        salvaciones: ['destreza', 'inteligencia'],
        nivel_subclase: 3,
        subclases: ['Ladrón', 'Asesino', 'Embaucador Arcano', 'Explorador', 'Inquisidor', 'Fantasma', 'Alma del Cuchillo']
    }
};