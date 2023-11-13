module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('user', {
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        profileName: {
            type: DataTypes.STRING(255),
            validate: {
                notEmpty: true
            }
        },
        profilePicture: {
            type: DataTypes.STRING(255)
        },
        receiveName: {
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
        phoneNumber: {
            type: DataTypes.STRING(255)
        },
        address: {
            type: DataTypes.STRING(255)
        },
        bankName: {
            type: DataTypes.STRING(255)
        },
        bankAccountNumber: {
            type: DataTypes.STRING(255)
        },
    },
    {   
        tableName: 'user',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.hasMany(models.notification, {foreignKey : 'userId'});
        model.hasMany(models.favorite, {foreignKey : 'userId'});
        model.hasMany(models.order, {foreignKey : 'userId'});
        model.hasMany(models.review, {foreignKey : 'userId'});
        model.hasMany(models.cart, {foreignKey : 'userId'});
        model.hasOne(models.reset, {foreignKey : 'userId'});
        model.hasOne(models.payment, {foreignKey : 'userId'});
    };

    return model
}

