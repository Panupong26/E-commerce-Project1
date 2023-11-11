module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('product', {
        productName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        productType: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        acceptCod: {
            type: DataTypes.ENUM('TRUE', 'FALSE'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        productDetail: {
            type: DataTypes.TEXT
        },
        productSellCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        date: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {   
        tableName: 'product',
        timestamps: false,
        underscored: true
    });


    model.associate = models => {
        model.hasMany(models.cart, {foreignKey : 'productId'});
        model.hasMany(models.review, {foreignKey : 'productId'});
        model.hasMany(models.order, {foreignKey : 'productId'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId'});
        model.hasMany(models.productPicture, {foreignKey : 'productId'});
        model.hasMany(models.productOption, {foreignKey : 'productId'});
        model.hasMany(models.shippingOption, {foreignKey : 'productId'});
    };

    return model
}

