module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('verify', {
        status: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING(255),
            validate: {
                notEmpty: true
            }
        },
        username: {
            type: DataTypes.STRING(255),
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
        },
        ref: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {   
        tableName: 'verify',
        timestamps: false,
        underscored: true
    });

    return model
}