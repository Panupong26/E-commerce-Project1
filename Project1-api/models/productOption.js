module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('productOption', {
        optionName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        outOfStock: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {   
        tableName: 'productOption',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.product,  {foreignKey : 'productId', onDelete: 'CASCADE'});
        model.hasMany(models.optionPicture, {foreignKey : 'optionId' , onDelete: 'CASCADE'});
    };

    return model
}