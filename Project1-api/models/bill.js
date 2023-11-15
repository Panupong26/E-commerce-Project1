module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('bill', {
        status: {
            type: DataTypes.ENUM('NOT_YET_SUBMITTED', 'PENDING', 'PAID'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        productName: {
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
        ref: {
            type: DataTypes.STRING(255),
            unique: true,
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
        totalIncome: {
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
        tableName: 'bill',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.order,  {foreignKey : 'orderId'});
        model.belongsTo(models.seller,  {foreignKey : 'sellerId', onDelete: 'SET NULL'});
        model.belongsTo(models.admin,  {foreignKey : 'adminId', onDelete: 'SET NULL'});
    };

    return model
}