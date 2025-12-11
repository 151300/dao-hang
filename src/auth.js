
/**
 * 用户认证模块
 */

/**
 * 验证会话
 */
export async function verifySession(request, env) {
  try {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return false;
    
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => c.trim().split('='))
    );
    
    const sessionToken = cookies.session;
    if (!sessionToken) return false;
    
    // 从 KV 获取会话
    const sessionData = await env.NAV_STORE.get(`session_${sessionToken}`);
    if (!sessionData) return false;
    
    const session = JSON.parse(sessionData);
    
    // 检查会话是否过期
    if (session.expires < Math.floor(Date.now() / 1000)) {
      await env.NAV_STORE.delete(`session_${sessionToken}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}

/**
 * 创建会话
 */
export async function createSession(env, username) {
  const sessionToken = crypto.randomUUID();
  const sessionExpiry = Math.floor(Date.now() / 1000) + 86400; // 24小时
  
  await env.NAV_STORE.put(
    `session_${sessionToken}`,
    JSON.stringify({
      username,
      expires: sessionExpiry
    }),
    { expirationTtl: 86400 }
  );
  
  return sessionToken;
}
