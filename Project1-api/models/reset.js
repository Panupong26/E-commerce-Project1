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
        model.belongsTo(models.user,  {foreignKey : 'userId'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId'});
        model.belongsTo(models.admin,  {foreignKey : 'adminId'});
    };

    return model
}