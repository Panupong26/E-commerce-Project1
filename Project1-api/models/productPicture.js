module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('productPicture', {
        picture: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
    },
    {   
        tableName: 'productPicture',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.product,  {foreignKey : 'productId', onDelete: 'CASCADE'});
    };

    return model
}