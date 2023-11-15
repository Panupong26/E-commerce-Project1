module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('notification', {
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        notificationPicture: {
            type: DataTypes.STRING(255),
        },
        notificationType: {
            type: DataTypes.ENUM('TO_USER_ORDER', 'TO_SELLER_ORDER'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.ENUM('UNREAD', 'READ'),
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
        tableName: 'notification',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.user,  {foreignKey : 'userId', onDelete: 'CASCADE'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId', onDelete: 'CASCADE'});
    };

    return model
}