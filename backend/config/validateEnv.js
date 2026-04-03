const requiredVars = [
  'JWT_SECRET',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'CLOUDFLARE_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET',
];

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não definidas:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('Verifique seu arquivo .env');
    process.exit(1);
  }
}

module.exports = validateEnv;
