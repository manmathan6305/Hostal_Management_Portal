require('dotenv').config();
const { sequelize, Sequelize } = require('../config/database');

const Complaint = require('../models/Complaint');

async function migrate() {
  try {
    console.log('Starting complaint image column migration...');
    await sequelize.authenticate();
    console.log('Database connected.');

    const qi = sequelize.getQueryInterface();
    const tableName = Complaint.getTableName();
    const table = await qi.describeTable(tableName);

    if (!table.imageUrl) {
      await qi.addColumn(tableName, 'imageUrl', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
      console.log('imageUrl column added to Complaints.');
    } else {
      console.log('imageUrl column already exists on Complaints, skipping.');
    }

    console.log('Complaint image column migration completed.');
  } catch (error) {
    console.error('Complaint image column migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate().then(() => process.exit(0));
