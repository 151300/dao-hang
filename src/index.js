cat > src/index.js << 'EOF'
/**
 * Dao-Hang 导航系统主入口
 * 版本: 1.0.0
 */

import { verifySession, createSession } from './auth.js';
import { loadNavData, saveNavData } from './storage.js';
import { generateHomePage, generateLoginPage, generateErrorPage } from './templates.js';
import { successResponse, errorResponse } from './utils.js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      console.log(`[${new Date().toISOString()}] ${request.method} ${path}`);
      
      // 路由分发
      switch (true) {
        case path === '/':
          return handleHome(request, env);
          
        case path === '/login':
          return handleLogin(request, env);
          
        case path === '/logout':
          return handleLogout(request, env);
          
        case path === '/admin':
          const isAdmin = await verifySession(request, env);
          if (!isAdmin) {
            return Response.redirect(new URL('/login', request.url), 302);
          }
          return handleAdmin(request, env);
          
        case path.startsWith('/api/'):
          return handleApi(request, env, path);
          
        default:
          return new Response('404 - Page Not Found', {
            status: 404,
            headers: { 'Content-Type': 'text/html; charset=UTF-8' }
          });
      }
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response(generateErrorPage(error.message, 500), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }
  }
};

/**
 * 处理主页
 */
async function handleHome(request, env) {
  const navData = await loadNavData(env);
  const html = generateHomePage(navData, env);
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  });
}

/**
 * 处理登录
 */
async function handleLogin(request, env) {
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const username = formData.get('username');
      const password = formData.get('password');
      
      // 验证凭据
      if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
        // 创建会话
        const sessionToken = await createSession(env, username);
        
        // 重定向到管理后台
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/admin',
            'Set-Cookie': `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${
              env.ENVIRONMENT === 'production' ? '; Secure' : ''
            }`
          }
        });
      } else {
        return new Response(generateLoginPage('用户名或密码错误'), {
          headers: { 'Content-Type': 'text/html; charset=UTF-8' }
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      return new Response(generateLoginPage('登录时发生错误'), {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }
  }
  
  return new Response(generateLoginPage(), {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  });
}

/**
 * 处理登出
 */
async function handleLogout(request, env) {
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => c.trim().split('='))
    );
    const sessionToken = cookies.session;
    if (sessionToken) {
      await env.NAV_STORE.delete(`session_${sessionToken}`);
    }
  }
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': 'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    }
  });
}

/**
 * 处理管理后台
 */
async function handleAdmin(request, env) {
  const navData = await loadNavData(env);
  
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>管理后台 - ${navData.siteName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f7fa;
          color: #2d3748;
          min-height: 100vh;
        }
        
        .admin-container {
          display: flex;
          min-height: 100vh;
        }
        
        /* 侧边栏样式 */
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
        }
        
        .sidebar-header {
          padding: 25px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-header h2 {
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .sidebar-menu {
          list-style: none;
          padding: 20px 0;
        }
        
        .menu-item {
          padding: 0;
        }
        
        .menu-link {
          display: block;
          padding: 15px 25px;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-left: 4px solid transparent;
        }
        
        .menu-link:hover, .menu-link.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-left-color: white;
        }
        
        /* 主内容区样式 */
        .main-content {
          flex: 1;
          min-height: 100vh;
        }
        
        .header {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .header-left h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .logout-btn {
          background: #fed7d7;
          color: #9b2c2c;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        
        /* 内容区样式 */
        .content {
          padding: 30px;
        }
        
        .section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 25px;
          color: #2d3748;
        }
        
        /* 表单样式 */
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #4a5568;
        }
        
        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        /* 消息提示 */
        .message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: none;
        }
        
        .message.success {
          background: #c6f6d5;
          color: #22543d;
          border: 1px solid #9ae6b4;
        }
        
        .message.error {
          background: #fed7d7;
          color: #742a2a;
          border: 1px solid #fc8181;
        }
      </style>
    </head>
    <body>
      <div class="admin-container">
        <!-- 侧边栏 -->
        <div class="sidebar">
          <div class="sidebar-header">
            <h2>📊 导航管理</h2>
          </div>
          <ul class="sidebar-menu">
            <li class="menu-item">
              <a href="#" class="menu-link active" onclick="showSection('settings')">
                网站设置
              </a>
            </li>
            <li class="menu-item">
              <a href="#" class="menu-link" onclick="showSection('background')">
                背景设置
              </a>
            </li>
            <li class="menu-item">
              <a href="/" target="_blank" class="menu-link">
                查看网站
              </a>
            </li>
          </ul>
        </div>
        
        <!-- 主内容区 -->
        <div class="main-content">
          <!-- 顶部栏 -->
          <div class="header">
            <div class="header-left">
              <h1>管理后台</h1>
            </div>
            <div>
              <button class="logout-btn" onclick="logout()">退出登录</button>
            </div>
          </div>
          
          <!-- 内容区 -->
          <div class="content">
            <!-- 消息提示 -->
            <div id="message" class="message"></div>
            
            <!-- 网站设置 -->
            <div id="settings-section" class="section">
              <h2>网站设置</h2>
              <div class="form-group">
                <label class="form-label">网站名称</label>
                <input type="text" class="form-control" id="site-name" value="${navData.siteName}">
              </div>
              <div class="form-group">
                <label class="form-label">网站描述</label>
                <textarea class="form-control" id="site-description" rows="3">${navData.description}</textarea>
              </div>
              <button class="btn btn-primary" onclick="saveSettings()">保存设置</button>
            </div>
            
            <!-- 背景设置 -->
            <div id="background-section" class="section" style="display: none;">
              <h2>背景设置</h2>
              <div class="form-group">
                <label class="form-label">背景颜色</label>
                <input type="color" class="form-control" id="bg-color" value="${navData.config.bgColor || '#f8fafc'}" 
                       style="width: 100px; height: 40px;">
              </div>
              
              <div class="form-group">
                <label class="form-label">背景图片 URL</label>
                <input type="text" class="form-control" id="bg-image" value="${navData.config.bgImage || ''}" 
                       placeholder="输入图片链接">
              </div>
              
              <button class="btn btn-primary" onclick="saveBackground()">保存背景设置</button>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        // 当前编辑的数据
        let currentData = ${JSON.stringify(navData)};
        
        // 显示消息
        function showMessage(text, type = 'info', duration = 3000) {
          const messageEl = document.getElementById('message');
          messageEl.textContent = text;
          messageEl.className = 'message ' + type;
          messageEl.style.display = 'block';
          
          if (duration > 0) {
            setTimeout(() => {
              messageEl.style.display = 'none';
            }, duration);
          }
        }
        
        // 切换部分显示
        function showSection(sectionId) {
          // 隐藏所有部分
          document.querySelectorAll('.section').forEach(el => {
            el.style.display = 'none';
          });
          
          // 显示目标部分
          document.getElementById(sectionId + '-section').style.display = 'block';
          
          // 更新菜单激活状态
          document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
          });
          
          document.querySelector(\`[onclick*="'\${sectionId}'"]\`).classList.add('active');
        }
        
        // 保存网站设置
        async function saveSettings() {
          currentData.siteName = document.getElementById('site-name').value;
          currentData.description = document.getElementById('site-description').value;
          
          await saveToServer('settings');
        }
        
        // 保存背景设置
        async function saveBackground() {
          currentData.config.bgColor = document.getElementById('bg-color').value;
          currentData.config.bgImage = document.getElementById('bg-image').value;
          
          await saveToServer('background');
        }
        
        // 保存数据到服务器
        async function saveToServer(type) {
          try {
            showMessage('保存中...', 'info', 0);
            
            const response = await fetch('/api/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type, data: currentData })
            });
            
            const result = await response.json();
            
            if (result.success) {
              showMessage('保存成功', 'success');
            } else {
              showMessage('保存失败: ' + (result.error || '未知错误'), 'error');
            }
          } catch (error) {
            showMessage('保存失败: ' + error.message, 'error');
          }
        }
        
        // 登出
        function logout() {
          if (confirm('确定要退出登录吗？')) {
            window.location.href = '/logout';
          }
        }
      </script>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  });
}

/**
 * 处理API请求
 */
async function handleApi(request, env, path) {
  const isLoggedIn = await verifySession(request, env);
  
  if (!isLoggedIn && path !== '/api/health') {
    return errorResponse('未经授权', 401);
  }
  
  switch (true) {
    case path === '/api/save':
      if (request.method !== 'POST') {
        return errorResponse('方法不允许', 405);
      }
      return handleApiSave(request, env);
      
    case path === '/api/health':
      return successResponse({ status: 'ok', timestamp: new Date().toISOString() });
      
    default:
      return errorResponse('API端点不存在', 404);
  }
}

/**
 * 处理API保存
 */
async function handleApiSave(request, env) {
  try {
    const data = await request.json();
    const result = await saveNavData(env, data.data);
    
    if (result.success) {
      return successResponse({ updatedAt: result.updatedAt }, '保存成功');
    } else {
      return errorResponse(result.error, 500);
    }
  } catch (error) {
    console.error('API save error:', error);
    return errorResponse('保存数据时发生错误: ' + error.message, 500);
  }
}
EOF