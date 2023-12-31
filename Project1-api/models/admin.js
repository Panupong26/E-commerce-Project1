module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('admin', {
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {   
        tableName: 'admin',
        timestamps: false,
        underscored: true
    });

    model.associate = models => {
        model.hasMany(models.bill,  {foreignKey : 'adminId', onDelete: 'SET NULL'});
        model.hasMany(models.order,  {foreignKey : 'adminId', onDelete: 'SET NULL'});
        model.hasOne(models.reset, {foreignKey : 'adminId', onDelete: 'CASCADE'});
    };

    return model
}