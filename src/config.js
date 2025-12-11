cat > src/config.js << 'EOF'
/**
 * Dao-Hang 配置
 */

export const DEFAULT_NAV_DATA = {
  siteName: "我的导航",
  description: "精心整理的实用网站导航",
  config: {
    bgColor: '#f8fafc',
    bgImage: '',
    theme: 'light',
    showCategories: true,
    showSearch: true,
    layout: 'grid',
    itemsPerRow: 4
  },
  categories: [
    {
      id: 1,
      name: '常用工具',
      description: '日常使用的工具网站',
      icon: '🔧',
      hidden: false,
      order: 1,
      sites: [
        {
          id: 1,
          name: 'Google',
          url: 'https://www.google.com',
          description: '全球搜索引擎',
          icon: 'G',
          tags: ['搜索', '工具'],
          order: 1
        },
        {
          id: 2,
          name: 'GitHub',
          url: 'https://github.com',
          description: '代码托管平台',
          icon: 'GH',
          tags: ['开发', '代码'],
          order: 2
        }
      ]
    },
    {
      id: 2,
      name: '社交平台',
      description: '社交网络平台',
      icon: '💬',
      hidden: false,
      order: 2,
      sites: [
        {
          id: 3,
          name: 'Twitter',
          url: 'https://twitter.com',
          description: '微博客平台',
          icon: 'T',
          tags: ['社交', '新闻'],
          order: 1
        }
      ]
    },
    {
      id: 3,
      name: '学习资源',
      description: '在线学习平台',
      icon: '📚',
      hidden: true,
      order: 3,
      sites: [
        {
          id: 4,
          name: 'MDN',
          url: 'https://developer.mozilla.org',
          description: 'Web开发文档',
          icon: 'M',
          tags: ['文档', '开发'],
          order: 1
        }
      ]
    }
  ],
  customLinks: [],
  statistics: {
    totalVisits: 0,
    lastReset: new Date().toISOString(),
    categoryCount: 3,
    siteCount: 4
  },
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 安全配置
export const SECURITY_CONFIG = {
  sessionTimeout: 86400, // 24小时
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp']
};
EOF