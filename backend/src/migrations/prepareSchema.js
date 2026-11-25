require('dotenv').config();
const { sequelize } = require('../config/database');
require('../models');

async function waitForDatabase() {
  const transient = new Set(['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH', 'EAI_AGAIN']);
  for (let attempt = 1; ; attempt++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (error) {
      if (!transient.has(error.original?.code) || attempt >= 12) throw error;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

async function prepareSchema() {
  await waitForDatabase();
  const tables = await sequelize.getQueryInterface().showAllTables();
  const existing = new Set(tables);
  const models = Object.values(sequelize.models);
  // A case-sensitive MySQL host must not silently create a second set of tables.
  for (const model of models) {
    const name = model.getTableName();
    if (!existing.has(name) && tables.some(table => table.toLowerCase() === name.toLowerCase())) {
      throw new Error(`Table name case differs for ${name}. Review the existing schema.`);
    }
    if (existing.has(name)) await model.findAll({ limit: 0 });
  }
  if (!process.argv.includes('--check')) {
    // Preserve existing indexes and constraints. Create only absent tables in dependency order.
    const dependenciesFirst = sequelize.modelManager.getModelsTopoSortedByForeignKey()?.reverse();
    if (!dependenciesFirst) throw new Error('Review cyclic dependencies before creating tables.');
    for (const model of dependenciesFirst) {
      if (!existing.has(model.getTableName())) await model.sync({ force: false, alter: false });
    }
  }
  for (const model of models) await model.findAll({ limit: 0 });
  console.log(`Verified ${models.length} application tables.`);
}

prepareSchema()
  .catch(error => {
    console.error('Schema preparation failed:', error.name, error.original?.code || error.message.split('\n')[0]);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
