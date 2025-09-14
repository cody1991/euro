const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

class DataManager {
  // 检查数据是否存在
  async checkDataExists(table, condition = {}) {
    let query = supabase.from(table).select('id');
    
    Object.keys(condition).forEach(key => {
      query = query.eq(key, condition[key]);
    });
    
    const { data, error } = await query.limit(1);
    if (error) throw error;
    return data && data.length > 0;
  }

  // 安全插入数据（避免重复）
  async safeInsert(table, data, uniqueFields = []) {
    if (uniqueFields.length > 0) {
      const condition = {};
      uniqueFields.forEach(field => {
        condition[field] = data[field];
      });
      
      const exists = await this.checkDataExists(table, condition);
      if (exists) {
        console.log(`数据已存在，跳过插入: ${table}`, condition);
        return { success: true, skipped: true };
      }
    }

    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return { success: true, data: result };
  }

  // 更新数据
  async updateData(table, updates, condition) {
    let query = supabase.from(table).update(updates);
    
    Object.keys(condition).forEach(key => {
      query = query.eq(key, condition[key]);
    });
    
    const { data, error } = await query.select();
    if (error) throw error;
    return { success: true, data };
  }

  // 删除数据
  async deleteData(table, condition) {
    let query = supabase.from(table).delete();
    
    Object.keys(condition).forEach(key => {
      query = query.eq(key, condition[key]);
    });
    
    const { error } = await query;
    if (error) throw error;
    return { success: true };
  }

  // 添加新城市
  async addCity(cityData) {
    return await this.safeInsert('cities', cityData, ['name', 'itinerary_id']);
  }

  // 添加新景点
  async addAttraction(attractionData) {
    return await this.safeInsert('attractions', attractionData, ['name', 'city_id']);
  }

  // 添加新交通
  async addTransportation(transportData) {
    return await this.safeInsert('transportation', transportData, ['type', 'from_city_id', 'to_city_id']);
  }

  // 更新景点信息
  async updateAttraction(attractionId, updates) {
    return await this.updateData('attractions', updates, { id: attractionId });
  }

  // 获取所有数据统计
  async getDataStats() {
    const [itineraries, cities, attractions, transportation] = await Promise.all([
      supabase.from('itineraries').select('id', { count: 'exact' }),
      supabase.from('cities').select('id', { count: 'exact' }),
      supabase.from('attractions').select('id', { count: 'exact' }),
      supabase.from('transportation').select('id', { count: 'exact' })
    ]);

    return {
      itineraries: itineraries.count,
      cities: cities.count,
      attractions: attractions.count,
      transportation: transportation.count
    };
  }
}

module.exports = DataManager;
