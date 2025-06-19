import Dexie from 'dexie';

export const db = new Dexie("ColetasMariposasDB");

// Atualize para a versão 2 e crie as tabelas: pastas e coletas (com pastaId)
db.version(2).stores({
  pastas: '++id, nome',
  coletas: '++id, especie, local, data, registrado_por, pastaId'
});
