module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('order', {
        productName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        orderPicture: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        productOption: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        shippingOption: {
            type: DataTypes.STRING(255),
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
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        paymentOption: {
            type: DataTypes.ENUM('COD', 'CARD', 'QR'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        receiver: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        phoneNumber: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        destination: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.ENUM('PREPARE_SHIPPING', 'ON_DELIVERY', 'RECEIVED', 'CANCLE', 'PENDING_REFUND', 'REFUNDED'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        trackingNumber: {
            type: DataTypes.STRING(255),
        },
        ref: {
            type: DataTypes.STRING(255),
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
        hour: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        minute: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {   
        tableName: 'order',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.user,  {foreignKey : 'userId', onDelete: 'SET NULL'});
        model.hasOne(models.bill, {foreignKey : 'orderId', onDelete: 'SET NULL'});
        model.hasOne(models.review, {foreignKey : 'orderId', onDelete: 'SET NULL'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId', onDelete: 'SET NULL'});
        model.belongsTo(models.product,  {foreignKey : 'productId', onDelete: 'SET NULL'});
        model.belongsTo(models.admin,  {foreignKey : 'adminId', onDelete: 'SET NULL'});
    };

    return model
}