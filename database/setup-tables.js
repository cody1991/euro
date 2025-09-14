// 加载环境变量
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  console.log('开始设置数据库表结构...');
  console.log('Supabase URL:', supabaseUrl);

  try {
    // 读取 schema.sql 文件
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    console.log('读取 schema.sql 文件成功');
    console.log('SQL 内容长度:', sqlContent.length, '字符');

    // 将SQL按分号分割成单独的语句
    const sqlStatements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('找到', sqlStatements.length, '个SQL语句');

    // 逐个执行SQL语句
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      console.log(`\n执行语句 ${i + 1}/${sqlStatements.length}:`);
      console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));

      try {
        // 使用 Supabase 的 SQL 执行功能
        const { data, error } = await supabase.rpc('exec', { sql: statement });

        if (error) {
          console.error('执行失败:', error);
          // 继续执行下一个语句
          continue;
        }

        console.log('✅ 执行成功');
      } catch (err) {
        console.error('执行出错:', err.message);
        // 继续执行下一个语句
        continue;
      }
    }

    console.log('\n🎉 数据库表结构设置完成！');
    console.log('\n请访问 Supabase Dashboard 查看创建的表：');
    console.log('1. 访问 https://supabase.com/dashboard');
    console.log('2. 选择你的项目');
    console.log('3. 进入 "Table Editor" 查看所有表');

  } catch (error) {
    console.error('设置表结构失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  setupTables().catch(console.error);
}

module.exports = { setupTables };
