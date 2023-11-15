module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define('optionPicture', {
        picture: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    },
    {   
        tableName: 'optionPicture',
        timestamps: false,
        underscored: true
    });
    
    model.associate = models => {
        model.belongsTo(models.productOption,  {foreignKey : 'optionId', onDelete: 'CASCADE'});
    };

    return model
}