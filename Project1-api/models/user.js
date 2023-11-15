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
        model.hasMany(models.notification, {foreignKey : 'userId', onDelete: 'CASCADE'});
        model.hasMany(models.favorite, {foreignKey : 'userId', onDelete: 'CASCADE'});
        model.hasMany(models.order, {foreignKey : 'userId', onDelete: 'SET NULL'});
        model.hasMany(models.review, {foreignKey : 'userId', onDelete: 'SET NULL'});
        model.hasMany(models.cart, {foreignKey : 'userId', onDelete: 'CASCADE'});
        model.hasOne(models.reset, {foreignKey : 'userId', onDelete: 'CASCADE'});
        model.hasOne(models.payment, {foreignKey : 'userId', onDelete: 'CASCADE'});
    };

    return model
}

