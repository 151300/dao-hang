/**
 * 生成主页HTML
 */
export function generateHomePage(navData, env) {
  const { siteName, description, config, categories } = navData;
  const bgStyle = config.bgImage 
    ? `background-image: url('${config.bgImage}'); background-size: cover; background-attachment: fixed;`
    : `background-color: ${config.bgColor || '#f8fafc'};`;
  
  // 关键修复：这是一个完整、闭合的HTML模板字符串，以 </script></body></html> 结尾
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${siteName}</title>
      <meta name="description" content="${description}">
      
      <style>
        :root {
          --primary-color: #667eea;
          --secondary-color: #764ba2;
          --bg-color: ${config.bgColor || '#f8fafc'};
          --text-color: #2d3748;
          --card-bg: rgba(255, 255, 255, 0.95);
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          --radius: 16px;
          --transition: all 0.3s ease;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--text-color);
          ${bgStyle}
          min-height: 100vh;
          transition: var(--transition);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        header {
          text-align: center;
          padding: 60px 20px 40px;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.8);
          border-radius: var(--radius);
          margin-bottom: 40px;
          box-shadow: var(--shadow);
        }
        
        h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .site-description {
          font-size: 1.2rem;
          color: #718096;
          max-width: 600px;
          margin: 0 auto 30px;
        }
        
        .categories {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .category {
          background: var(--card-bg);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }
        
        .category:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          cursor: pointer;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
        }
        
        .category-header h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        
        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
        
        .sites {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 30px;
        }
        
        .site-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          text-decoration: none;
          color: var(--text-color);
          transition: var(--transition);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .site-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }
        
        .site-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .site-info {
          flex: 1;
        }
        
        .site-info h3 {
          margin: 0 0 8px;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .site-info p {
          margin: 0;
          color: #718096;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .admin-link {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          padding: 15px 25px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          transition: var(--transition);
          z-index: 1000;
        }
        
        .admin-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
        }
        
        .footer {
          text-align: center;
          padding: 40px 20px;
          margin-top: 60px;
          color: #718096;
          font-size: 0.9rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .hidden .sites {
          display: none;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          
          header {
            padding: 40px 20px 30px;
            margin-bottom: 30px;
          }
          
          h1 {
            font-size: 2.2rem;
          }
          
          .sites {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          
          .category-header {
            padding: 20px;
          }
          
          .admin-link {
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            font-size: 0.9rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>${siteName}</h1>
          <p class="site-description">${description}</p>
        </header>
        
        <div class="categories">
          ${categories.map(category => `
            <div class="category ${category.hidden ? 'hidden' : ''}" id="category-${category.id}">
              <div class="category-header" onclick="toggleCategory(${category.id})">
                <h2>
                  <span class="category-icon">${category.icon || '📂'}</span>
                  ${category.name}
                </h2>
                <button class="toggle-btn">${category.hidden ? '+' : '−'}</button>
              </div>
              
              <div class="sites">
                ${category.sites.map(site => `
                  <a href="${site.url}" target="_blank" rel="noopener" class="site-card">
                    <div class="site-icon">${site.icon || site.name.charAt(0)}</div>
                    <div class="site-info">
                      <h3>${site.name}</h3>
                      <p>${site.description || ''}</p>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${siteName} | 基于 Cloudflare Workers 构建</p>
          <p>版本: ${env.VERSION || '1.0.0'} | 最后更新: ${navData.updatedAt ? new Date(navData.updatedAt).toLocaleDateString('zh-CN') : '刚刚'}</p>
        </div>
      </div>
      
      <a href="/admin" class="admin-link">管理后台</a>
      
      <script>
        // 从 localStorage 恢复分类状态
        document.addEventListener('DOMContentLoaded', () => {
          const hiddenCategories = JSON.parse(localStorage.getItem('dao_hang_hidden_categories') || '{}');
          Object.keys(hiddenCategories).forEach(id => {
            if (hiddenCategories[id]) {
              const category = document.getElementById('category-' + id);
              if (category) {
                category.classList.add('hidden');
                const toggleBtn = category.querySelector('.toggle-btn');
                if (toggleBtn) toggleBtn.textContent = '+';
              }
            }
          });
        });
        
        function toggleCategory(id) {
          const category = document.getElementById('category-' + id);
          const toggleBtn = category.querySelector('.toggle-btn');
          
          if (category.classList.contains('hidden')) {
            category.classList.remove('hidden');
            toggleBtn.textContent = '−';
          } else {
            category.classList.add('hidden');
            toggleBtn.textContent = '+';
          }
          
          // 保存状态到 localStorage
          const hiddenCategories = JSON.parse(localStorage.getItem('dao_hang_hidden_categories') || '{}');
          hiddenCategories[id] = category.classList.contains('hidden');
          localStorage.setItem('dao_hang_hidden_categories', JSON.stringify(hiddenCategories));
        }
      </script>
    </body>
    </html>
  `;
}

/**
 * 生成登录页面HTML
 */
export function generateLoginPage(errorMessage = '') {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>登录 - Dao-Hang 导航系统</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .login-container {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .login-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .login-header p {
          opacity: 0.9;
          font-size: 14px;
        }
        .login-form {
          padding: 40px 30px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-size: 14px;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }
        .error-message {
          background: #fed7d7;
          color: #9b2c2c;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          border-left: 4px solid #fc8181;
        }
        .login-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .login-footer {
          text-align: center;
          margin-top: 24px;
          color: #718096;
          font-size: 14px;
        }
        .login-footer a {
          color: #667eea;
          text-decoration: none;
        }
        @media (max-width: 480px) {
          .login-container {
            border-radius: 12px;
          }
          .login-header, .login-form {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <div class="login-header">
          <h1>Dao-Hang 导航系统</h1>
          <p>请登录管理后台</p>
        </div>
        <form method="POST" class="login-form">
          ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" name="username" required autofocus>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="login-button">登录</button>
        </form>
        <div class="login-footer">
          <p>返回 <a href="/">首页</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 生成错误页面
 */
export function generateErrorPage(message, status = 500) {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${status} 错误</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 20px;
        }
        .error-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 50px 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          max-width: 500px;
          width: 100%;
        }
        h1 {
          font-size: 6rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 3px 3px 0 rgba(0,0,0,0.1);
        }
        h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          font-weight: 500;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 30px;
          opacity: 0.9;
          line-height: 1.6;
        }
        .home-link {
          display: inline-block;
          background: white;
          color: #667eea;
          padding: 14px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .home-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255,255,255,0.3);
        }
        @media (max-width: 480px) {
          h1 { font-size: 4rem; }
          .error-container { padding: 40px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1>${status}</h1>
        <h2>${getErrorMessage(status)}</h2>
        <p>${message}</p>
        <a href="/" class="home-link">返回首页</a>
      </div>
    </body>
    </html>
  `;
}

/**
 * 获取错误消息
 */
function getErrorMessage(status) {
  const messages = {
    400: '请求错误',
    401: '未经授权',
    403: '禁止访问',
    404: '页面未找到',
    500: '服务器内部错误',
    503: '服务暂时不可用'
  };
  return messages[status] || '发生错误';
}