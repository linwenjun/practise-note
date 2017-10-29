module.exports = (sequelize, DataTypes) => {
  const GrowthNote = sequelize.define('growth_note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    owner: {
      type: DataTypes.STRING
    },
    subject: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    answerLineCount: {
      type: DataTypes.TEXT
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return GrowthNote;
};

