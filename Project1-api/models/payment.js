module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('payment', {
        ref: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        item: {
            type: DataTypes.TEXT,
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
        paymentOption: {
            type: DataTypes.ENUM('CARD', 'QR'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {   
        tableName: 'payment',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.user,  {foreignKey : 'userId', onDelete: 'CASCADE'});
    };

    return model
}