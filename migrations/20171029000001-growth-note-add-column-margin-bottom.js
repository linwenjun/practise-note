module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('growth_note', 'answerLineCount', {
      type: 'text'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('growth_note', 'answerLineCount');
  }
};