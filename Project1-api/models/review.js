module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('review', {
        reviewMessage: {
            type: DataTypes.STRING(255)
        },
        reviewStar: {
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
        tableName: 'review',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.belongsTo(models.user,  {foreignKey : 'userId' , onDelete: 'SET NULL'});
        model.belongsTo(models.product,  {foreignKey : 'productId', onDelete: 'CASCADE'});
        model.belongsTo(models.order,  {foreignKey : 'orderId', onDelete: 'SET NULL'});
    };

    return model
}