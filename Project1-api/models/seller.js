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
        model.hasMany(models.notification, {foreignKey : 'sellerId', onDelete: 'CASCADE'});
        model.hasMany(models.favorite, {foreignKey : 'sellerId', onDelete: 'CASCADE'});
        model.hasMany(models.bill, {foreignKey : 'sellerId', onDelete: 'SET NULL'});
        model.hasMany(models.order, {foreignKey : 'sellerId', onDelete: 'SET NULL'});
        model.hasMany(models.product, {foreignKey : 'sellerId', onDelete: 'CASCADE'});
        model.hasOne(models.reset, {foreignKey : 'sellerId', onDelete: 'CASCADE'});
    };

    return model
}