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
        model.hasMany(models.cart, {foreignKey : 'productId', onDelete: 'CASCADE'});
        model.hasMany(models.review, {foreignKey : 'productId', onDelete: 'CASCADE'});
        model.hasMany(models.order, {foreignKey : 'productId', onDelete: 'SET NULL'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId', onDelete: 'CASCADE'});
        model.hasMany(models.productPicture, {foreignKey : 'productId', onDelete: 'CASCADE'});
        model.hasMany(models.productOption, {foreignKey : 'productId', onDelete: 'CASCADE'});
        model.hasMany(models.shippingOption, {foreignKey : 'productId', onDelete: 'CASCADE'});
    };

    return model
}

