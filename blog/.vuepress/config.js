module.exports = {
  base: "/",//部署站点的基础路径
  title: '初心',
  description: 'Just sharing!',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  theme: '@vuepress/blog',
  plugins: [
    '@vuepress/active-header-links', {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    },
    '@vuepress/back-to-top',
    [
      '@vuepress/blog', {
        directories: [
          {
            id: 'web',
            dirname: '_web',
            path: '/web/',
            // keys: ['tag','web'],
            title: '前端文章',
            frontmatter: { //Front matter for entry page.
              tag: 'web',
            },
            itemPermalink: '/web/:year/:month/:day/:slug',
            pagination: { // Pagination behavior
              lengthPerPage: 5,
            },
          },
          {
            id: 'serve',
            dirname: '_serve',
            path: '/serve/',
            // keys: ['tag','serve'],
            title: '服务端文章',
            frontmatter: { //Front matter for entry page.
              tag: 'serve',
            },
            itemPermalink: '/serve/:year/:month/:day/:slug',
            pagination: { // Pagination behavior
              lengthPerPage: 5,
            },
          },
          {
            id: 'miscellanies',
            dirname: '_miscellanies',
            path: '/miscellanies/',
            // keys: ['tag','miscellanies'],
            title: '杂论',
            frontmatter: { //Front matter for entry page.
              tag: 'miscellanies',
            },
            itemPermalink: '/miscellanies/:year/:month/:day/:slug',
            pagination: { // Pagination behavior
              lengthPerPage: 5,
            },
          },
        ],
        frontmatters: [
          {
            // Unique ID of current classification
            id: 'tag',
            // Decide that the frontmatter keys will be grouped under this classification
            keys: ['tag','tags'],
            // Path of the `entry page` (or `list page`)
            path: '/tag/',//设置为‘/tag/’时，tag目录必须时两成，否则检测不到。
            // Layout of the `entry page`
            layout: 'Tags',
            // Layout of the `scope page`
            scopeLayout: 'Tag'
          }
        ],
      }
    ],
  ],
  themeConfig: {
    logo: '/logo.png',
    // lastUpdated: 'Last Updated',//配置文档更新时间，来之git的提交记录
    navbar: true,//设置为false时禁用导航，默认为true
    search: false,
    searchMaxSuggestions: 10,
    activeHeaderLinks: true, // 默认值：true
    dateFormat: 'YYYY-MM-DD',
    smoothScroll: true,//主题配置平滑滚动选项允许您启用平滑滚动。
    nav: [
      {
        text: '前端',
        link: '/web/',
      },
      {
        text: '服务端',
        link: '/serve/',
      },
      {
        text: '杂论',
        link: '/miscellanies/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
      {
        text: 'Gitlab',
        link: 'https://github.com/ysg-lijinwen/cx'
      }
    ],
    //站点底部注脚
    footer: {
      contact: [
        {
          type: 'gitlab',
          link: 'https://github.com/ysg-lijinwen',
        },
        {
          type: 'web',
          link: 'http://www.lexinyao.com/',
        },
      ],
      copyright: [
        {
          text: 'Copyright © 2020-present 乐心瑶',
          link: 'http://www.lexinyao.com/',
        },
      ]
    },
  }
}
