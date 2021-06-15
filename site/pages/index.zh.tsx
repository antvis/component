// eslint-disable-next-line
import React from 'react';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import { useTranslation } from 'react-i18next';
import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import './index.less';

const IndexPage = () => {
  const { t, i18n } = useTranslation();

  const features = [];

  const bannerButtons = [
    {
      text: t('图表示例'),
      link: `/${i18n.language}/examples/gallery`,
      type: 'primary',
    },
    {
      text: t('开始使用'),
      link: `/${i18n.language}/docs/manual/introduction`,
    },
  ];

  const cases = [];

  return (
    <>
      <SEO title={t('GUI')} titleSuffix="AntV" lang={i18n.language} />
      <Banner
        coverImage={
          <img
            width="100%"
            style={{ marginLeft: '125px', marginTop: '50px' }}
            src="https://gw.alipayobjects.com/mdn/rms_d314dd/afts/img/A*f_gcSbpq-6kAAAAAAAAAAABkARQnAQ"
          />
        }
        title={t('GUI')}
        description={t('')}
        className="banner"
        buttons={bannerButtons}
      />
      <Features features={features} style={{ width: '100%' }} />
      <Cases cases={cases} />
    </>
  );
};

export default IndexPage;
