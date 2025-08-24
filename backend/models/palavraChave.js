const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>{
    const palavraChave = sequelize.define('palavraChave', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        palavra: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    });

    return palavraChave;
}

