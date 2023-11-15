module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('reset', {
        ref: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }
    },
    {   
        tableName: 'reset',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.user,  {foreignKey : 'userId', onDelete: 'CASCADE'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId', onDelete: 'CASCADE'});
        model.belongsTo(models.admin,  {foreignKey : 'adminId', onDelete: 'CASCADE'});
    };

    return model
}