const { repository, version } = require('./package.json');

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        // eslint-disable-next-line quotes
        // GATrackingId: `UA-148148901-2`,
      },
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    isAntVSite: false,
    title: 'GUI',
    description: 'UI made with G of AntV',
    siteUrl: 'https://gui.antv.vision',
    githubUrl: repository.url,
    showAPIDoc: true, // 是否在demo页展示API文档
    playground: {
      extraLib: '',
      devDependencies: {
        typescript: 'latest',
      },
    },
    mdPlayground: {
      // markdown 文档中的 playground 若干设置
      splitPaneMainSize: '50%',
    },
    versions: {
      [version]: 'https://gui.antv.vision',
    },
    navs: [
      {
        slug: 'docs/api',
        title: {
          zh: 'API',
          en: 'API',
        },
        order: 1,
      },
      {
        slug: 'examples',
        title: {
          zh: '组件示例',
          en: 'Examples',
        },
        order: 0,
      },
    ],
    docs: [
      {
        slug: 'api/ui',
        title: {
          zh: '基础 UI',
          en: 'Basic UI',
        },
        order: 2,
      },
    ],
    examples: [
      {
        slug: 'gallery',
        icon: 'gallery',
        title: {
          zh: '',
          en: '',
        },
      },
      {
        slug: 'chart-ui',
        icon: 'gallery',
        title: {
          zh: '图表组件',
          en: 'Chart UI',
        },
      },
      {
        slug: 'basic-ui',
        icon: 'gallery',
        title: {
          zh: '基础 UI',
          en: 'Basic UI',
        },
      },
      {
        slug: 'others',
        icon: 'other',
        title: {
          zh: '其它 UI',
          en: 'Other UI',
        },
      },
      {
        slug: 'wip',
        icon: 'other',
        title: {
          zh: '建设中',
          en: 'Working in progress',
        },
      },
    ],
    docsearchOptions: {
      // apiKey: '0d19588d7661a81faa8b75f6ade80321',
      indexName: 'antv_gui',
    },
  },
};
