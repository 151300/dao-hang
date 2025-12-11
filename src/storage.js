
/**
 * 数据存储操作模块
 */

import { DEFAULT_NAV_DATA } from './config.js';

/**
 * 加载导航数据
 */
export async function loadNavData(env) {
  try {
    const data = await env.NAV_STORE.get('nav_data');
    
    if (!data) {
      return getDefaultData(env);
    }
    
    const navData = JSON.parse(data);
    return navData;
  } catch (error) {
    console.error('Error loading nav data:', error);
    return getDefaultData(env);
  }
}

/**
 * 保存导航数据
 */
export async function saveNavData(env, data) {
  try {
    // 添加更新时间
    data.updatedAt = new Date().toISOString();
    data.version = env.VERSION || '1.0.0';
    
    await env.NAV_STORE.put('nav_data', JSON.stringify(data));
    return { success: true, updatedAt: data.updatedAt };
  } catch (error) {
    console.error('Error saving nav data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 获取默认数据
 */
function getDefaultData(env) {
  const siteName = env.SITE_NAME || '我的导航';
  const description = env.SITE_DESCRIPTION || '精心整理的实用网站导航';
  
  const defaultData = JSON.parse(JSON.stringify(DEFAULT_NAV_DATA));
  defaultData.siteName = siteName;
  defaultData.description = description;
  
  return defaultData;
}
