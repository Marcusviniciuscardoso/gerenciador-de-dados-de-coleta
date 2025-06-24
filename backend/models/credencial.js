module.exports = (sequelize, DataTypes) => {
    try {
        const Credencial = sequelize.define('Credencial', {
            idCredenciais: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            senha_hash: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'credenciais',
            timestamps: false
        });

        Credencial.associate = (models) => {
            try {
                Credencial.hasOne(models.Usuario, {
                    foreignKey: 'credencial_id',
                    as: 'usuario'
                });
            } catch (err) {
                console.error('Erro na associação do model Credencial:', err.message);
            }
        };

        return Credencial;
    } catch (error) {
        console.error('Erro na definição do model Credencial:', error.message);
        throw error;
    }
};
