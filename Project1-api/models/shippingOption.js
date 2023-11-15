module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('shippingOption', {
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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {   
        tableName: 'shippingOption',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.product,  {foreignKey : 'productId', onDelete: 'CASCADE'});
    };

    return model
}