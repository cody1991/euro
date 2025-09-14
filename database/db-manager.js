// 加载环境变量
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://dqkvszoabqwogljoerrk.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

class DatabaseManager {
  constructor() {
    this.supabase = supabase;
  }

  // 执行SQL文件
  async executeSQLFile(filePath) {
    try {
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      const { data, error } = await this.supabase.rpc('exec_sql', { sql: sqlContent });

      if (error) {
        console.error('SQL执行错误:', error);
        return false;
      }

      console.log('SQL执行成功');
      return true;
    } catch (error) {
      console.error('文件读取错误:', error);
      return false;
    }
  }

  // 创建表
  async createTable(tableName, columns) {
    try {
      const { data, error } = await this.supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_name', tableName);

      if (data && data.length > 0) {
        console.log(`表 ${tableName} 已存在`);
        return true;
      }

      // 这里需要直接执行SQL，因为Supabase客户端不直接支持CREATE TABLE
      console.log(`请手动在Supabase Dashboard中创建表: ${tableName}`);
      console.log('列定义:', columns);
      return false;
    } catch (error) {
      console.error('创建表错误:', error);
      return false;
    }
  }

  // 添加列
  async addColumn(tableName, columnName, columnType, constraints = '') {
    try {
      const sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType} ${constraints}`;
      const { data, error } = await this.supabase.rpc('exec_sql', { sql });

      if (error) {
        console.error('添加列错误:', error);
        return false;
      }

      console.log(`成功添加列 ${columnName} 到表 ${tableName}`);
      return true;
    } catch (error) {
      console.error('添加列错误:', error);
      return false;
    }
  }

  // 删除列
  async dropColumn(tableName, columnName) {
    try {
      const sql = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
      const { data, error } = await this.supabase.rpc('exec_sql', { sql });

      if (error) {
        console.error('删除列错误:', error);
        return false;
      }

      console.log(`成功删除列 ${columnName} 从表 ${tableName}`);
      return true;
    } catch (error) {
      console.error('删除列错误:', error);
      return false;
    }
  }

  // 查看表结构
  async describeTable(tableName) {
    try {
      // 使用SQL查询获取表结构
      const { data, error } = await this.supabase
        .rpc('exec_sql', {
          sql: `SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = '${tableName}' AND table_schema = 'public' ORDER BY ordinal_position;`
        });

      if (error) {
        console.error('查询表结构错误:', error);
        return null;
      }

      console.log(`表 ${tableName} 的结构:`);
      if (data && data.length > 0) {
        data.forEach(column => {
          console.log(`- ${column.column_name}: ${column.data_type} ${column.is_nullable === 'NO' ? 'NOT NULL' : ''} ${column.column_default ? `DEFAULT ${column.column_default}` : ''}`);
        });
      } else {
        console.log(`表 ${tableName} 不存在或没有列`);
      }

      return data;
    } catch (error) {
      console.error('查询表结构错误:', error);
      return null;
    }
  }

  // 查看所有表
  async listTables() {
    try {
      console.log('数据库连接成功！');
      console.log('请访问 Supabase Dashboard 查看表结构：');
      console.log('1. 访问 https://supabase.com/dashboard');
      console.log('2. 选择你的项目');
      console.log('3. 进入 "Table Editor" 查看表');
      console.log('4. 进入 "SQL Editor" 执行 SQL 语句');
      console.log('');
      console.log('建议先执行 database/schema.sql 创建表结构');

      return true;
    } catch (error) {
      console.error('连接数据库错误:', error);
      return null;
    }
  }

  // 插入测试数据
  async insertTestData() {
    try {
      // 插入行程数据
      const { data: itinerary, error: itineraryError } = await this.supabase
        .from('itineraries')
        .insert([
          {
            title: '欧洲20天深度游',
            start_date: '2024-01-15',
            end_date: '2024-02-03'
          }
        ])
        .select()
        .single();

      if (itineraryError) {
        console.error('插入行程数据错误:', itineraryError);
        return false;
      }

      console.log('成功插入测试数据');
      return true;
    } catch (error) {
      console.error('插入测试数据错误:', error);
      return false;
    }
  }

  // 清空表
  async truncateTable(tableName) {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .neq('id', 0); // 删除所有记录

      if (error) {
        console.error('清空表错误:', error);
        return false;
      }

      console.log(`成功清空表 ${tableName}`);
      return true;
    } catch (error) {
      console.error('清空表错误:', error);
      return false;
    }
  }
}

// 命令行工具
async function main() {
  const dbManager = new DatabaseManager();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'list':
      await dbManager.listTables();
      break;
    case 'describe':
      if (args.length === 0) {
        console.log('请提供表名');
        return;
      }
      await dbManager.describeTable(args[0]);
      break;
    case 'add-column':
      if (args.length < 3) {
        console.log('用法: node db-manager.js add-column <table_name> <column_name> <column_type>');
        return;
      }
      await dbManager.addColumn(args[0], args[1], args[2], args[3] || '');
      break;
    case 'drop-column':
      if (args.length < 2) {
        console.log('用法: node db-manager.js drop-column <table_name> <column_name>');
        return;
      }
      await dbManager.dropColumn(args[0], args[1]);
      break;
    case 'test-data':
      await dbManager.insertTestData();
      break;
    case 'truncate':
      if (args.length === 0) {
        console.log('请提供表名');
        return;
      }
      await dbManager.truncateTable(args[0]);
      break;
    default:
      console.log(`
数据库管理工具

用法: node db-manager.js <command> [args]

命令:
  list                     - 列出所有表
  describe <table_name>    - 查看表结构
  add-column <table> <column> <type> [constraints] - 添加列
  drop-column <table> <column> - 删除列
  test-data               - 插入测试数据
  truncate <table_name>   - 清空表

示例:
  node db-manager.js list
  node db-manager.js describe cities
  node db-manager.js add-column cities new_field VARCHAR(100)
  node db-manager.js drop-column cities old_field
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DatabaseManager;
