
/**
 * 工具函数模块
 */

/**
 * 生成错误响应
 */
export function errorResponse(message, status = 500) {
  return new Response(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * 生成成功响应
 */
export function successResponse(data = {}, message = '') {
  return new Response(JSON.stringify({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成网站图标
 */
export function generateSiteIcon(name) {
  const colors = [
    '#667eea', '#764ba2', '#f56565', '#ed8936',
    '#ecc94b', '#48bb78', '#38b2ac', '#4299e1'
  ];
  
  const color = colors[name.charCodeAt(0) % colors.length];
  const letter = name.charAt(0).toUpperCase();
  
  return { color, letter };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成随机 ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
EOF