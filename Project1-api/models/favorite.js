module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('favorite',{},{   
        tableName: 'favorite',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.user,  {foreignKey : 'userId' , onDelete: 'CASCADE'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId', onDelete: 'CASCADE'});
    };

    return model
}