/**
 * Dao-Hang 导航系统主入口
 * 版本: 1.0.0 - 修复版
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
            // 调试：记录访问路径
            console.log(`[${new Date().toISOString()}] ${request.method} ${path}`);

            // 路由分发
            switch (true) {
                case path === '/':
                    return await handleHome(request, env);

                case path === '/login':
                    return await handleLogin(request, env);

                case path === '/logout':
                    return await handleLogout(request, env);

                case path === '/admin':
                    const isAdmin = await verifySession(request, env);
                    if (!isAdmin) {
                        return Response.redirect(new URL('/login', request.url), 302);
                    }
                    return await handleAdmin(request, env);

                case path.startsWith('/api/'):
                    return await handleApi(request, env, path);

                default:
                    return new Response('404 - Page Not Found', {
                        status: 404,
                        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
                    });
            }
        } catch (error) {
            console.error('Error handling request:', error);
            // 确保错误页面也返回HTML
            return new Response(generateErrorPage(error.message, 500), {
                status: 500,
                headers: { 'Content-Type': 'text/html; charset=UTF-8' }
            });
        }
    }
};

/**
 * 处理主页 (已添加关键调试和修复)
 */
async function handleHome(request, env) {
    try {
        // 1. 加载数据
        const navData = await loadNavData(env);
        console.log('[DEBUG handleHome] 数据加载完成，siteName:', navData?.siteName);

        // 2. 生成HTML
        const html = generateHomePage(navData, env);

        // 3. 关键调试：检查generateHomePage的返回值
        if (typeof html !== 'string') {
            console.error('[ERROR handleHome] generateHomePage 返回的不是字符串！类型:', typeof html, '值:', html);
            // 如果生成失败，返回一个简单的错误HTML页面，而不是JSON
            const fallbackHtml = `<!DOCTYPE html><html><body><h1>页面生成错误</h1><p>请检查服务器日志。</p></body></html>`;
            return new Response(fallbackHtml, {
                headers: { 'Content-Type': 'text/html; charset=UTF-8' }
            });
        }

        // 检查HTML是否以正确的文档类型开头
        if (!html.trim().startsWith('<!DOCTYPE html>')) {
            console.warn('[WARN handleHome] 生成的HTML可能不是有效的文档。开头部分:', html.substring(0, 200));
        }

        console.log('[DEBUG handleHome] 准备返回HTML响应，长度:', html.length);

        // 4. 返回响应
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
                'Cache-Control': 'no-cache' // 调试期间禁用缓存
            }
        });
    } catch (error) {
        console.error('[ERROR handleHome] 处理主页时发生错误:', error);
        // 即使出错，也返回一个HTML格式的错误信息
        const errorHtml = `<!DOCTYPE html><html><body><h1>服务器内部错误</h1><p>${error.message}</p></body></html>`;
        return new Response(errorHtml, {
            status: 500,
            headers: { 'Content-Type': 'text/html; charset=UTF-8' }
        });
    }
}

/**
 * 处理登录
 */
async function handleLogin(request, env) {
    // (此函数内容与你提供的原版一致，已省略以节省篇幅，请保持原样)
    // 确保它最后返回的是： new Response(generateLoginPage(...), { headers: { 'Content-Type': 'text/html; ...' } });
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
                        'Set-Cookie': `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${env.ENVIRONMENT === 'production' ? '; Secure' : ''}`
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
    // (此函数内容与你提供的原版一致，已省略以节省篇幅)
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
    // (此函数内容与你提供的原版一致，已省略以节省篇幅)
    // 请确保你原有的 handleAdmin 函数最后返回的是：
    // return new Response(html, { headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
    const navData = await loadNavData(env);
    // ... 你原有的很长的HTML模板字符串 ...
    const html = `<!DOCTYPE html>...`; // 这是你原有的管理后台HTML字符串

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
            return await handleApiSave(request, env);

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