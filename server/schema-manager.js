const { createClient } = require('@supabase/supabase-js');

class SchemaManager {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  // 检查表是否存在
  async tableExists(tableName) {
    const { data, error } = await this.supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (error) throw error;
    return data && data.length > 0;
  }

  // 检查字段是否存在
  async columnExists(tableName, columnName) {
    const { data, error } = await this.supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', tableName)
      .eq('column_name', columnName)
      .eq('table_schema', 'public');
    
    if (error) throw error;
    return data && data.length > 0;
  }

  // 获取表结构
  async getTableSchema(tableName) {
    const { data, error } = await this.supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .order('ordinal_position');
    
    if (error) throw error;
    return data;
  }

  // 添加新字段
  async addColumn(tableName, columnName, dataType, options = {}) {
    const exists = await this.columnExists(tableName, columnName);
    if (exists) {
      return { success: true, message: `字段 ${columnName} 已存在` };
    }

    // 注意：Supabase REST API 不支持 DDL 操作
    // 需要在 Supabase Dashboard 的 SQL Editor 中执行
    const sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${dataType}${options.default ? ` DEFAULT ${options.default}` : ''}${options.nullable === false ? ' NOT NULL' : ''};`;
    
    return {
      success: true,
      message: `请在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL:`,
      sql: sql
    };
  }

  // 创建新表
  async createTable(tableName, columns) {
    const exists = await this.tableExists(tableName);
    if (exists) {
      return { success: true, message: `表 ${tableName} 已存在` };
    }

    let sql = `CREATE TABLE ${tableName} (\n`;
    sql += columns.map(col => `  ${col.name} ${col.type}${col.primaryKey ? ' PRIMARY KEY' : ''}${col.autoIncrement ? ' SERIAL' : ''}${col.nullable === false ? ' NOT NULL' : ''}${col.default ? ` DEFAULT ${col.default}` : ''}`).join(',\n');
    sql += '\n);';

    return {
      success: true,
      message: `请在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL:`,
      sql: sql
    };
  }

  // 添加外键约束
  async addForeignKey(tableName, columnName, referencedTable, referencedColumn) {
    const sql = `ALTER TABLE ${tableName} ADD CONSTRAINT fk_${tableName}_${columnName} FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(${referencedColumn});`;
    
    return {
      success: true,
      message: `请在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL:`,
      sql: sql
    };
  }

  // 添加索引
  async addIndex(tableName, columnName, indexName = null) {
    const idxName = indexName || `idx_${tableName}_${columnName}`;
    const sql = `CREATE INDEX ${idxName} ON ${tableName}(${columnName});`;
    
    return {
      success: true,
      message: `请在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL:`,
      sql: sql
    };
  }

  // 获取所有表的信息
  async getAllTables() {
    const { data, error } = await this.supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) throw error;
    return data;
  }

  // 验证表结构
  async validateSchema() {
    const requiredTables = ['itineraries', 'cities', 'attractions', 'transportation'];
    const results = {};
    
    for (const table of requiredTables) {
      const exists = await this.tableExists(table);
      results[table] = {
        exists,
        schema: exists ? await this.getTableSchema(table) : null
      };
    }
    
    return results;
  }
}

module.exports = SchemaManager;
