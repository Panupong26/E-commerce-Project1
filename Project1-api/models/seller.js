module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('seller', {
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        storeName: {
            type: DataTypes.STRING(255),
            validate: {
                notEmpty: true
            }
        },
        storePicture: {
            type: DataTypes.STRING(255),
        },
        welcomeMessage: {
            type: DataTypes.STRING(255),

        },
        storeDescription: {
            type: DataTypes.TEXT
        },
        phoneNumber: {
            type: DataTypes.STRING(255)
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        address: {
            type: DataTypes.STRING(255)
        },
        facebook: {
            type: DataTypes.STRING(255)
        },
        instagram: {
            type: DataTypes.STRING(255)
        },
        bankName: {
            type: DataTypes.STRING(255)
        },
        bankAccountNumber: {
            type: DataTypes.STRING(255)
        },
        totalSellCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {   
        tableName: 'seller',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.hasMany(models.notification, {foreignKey : 'sellerId'});
        model.hasMany(models.favorite, {foreignKey : 'sellerId'});
        model.hasMany(models.bill, {foreignKey : 'sellerId'});
        model.hasMany(models.order, {foreignKey : 'sellerId'});
        model.hasMany(models.product, {foreignKey : 'sellerId'});
        model.hasOne(models.reset, {foreignKey : 'sellerId'});
    };

    return model
}