import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Secured by crypto',
    Svg: require('@site/static/img/undraw_mobile_encryption.svg').default,
    description: (
      <>
          iCure implements end-to-end encryption
          to make sure the privacy of the data is guaranteed
      </>
    ),
  },
  {
    title: 'Ready to scale',
    Svg: require('@site/static/img/undraw_building_blocks.svg').default,
    description: (
      <>
          Our solutions scale elastically to accommodate millions of
          patients and tens of thousands of healthcare providers
      </>
    ),
  },
  {
    title: 'Interoperable',
    Svg: require('@site/static/img/undraw_thought_process.svg').default,
    description: (
      <>
          Exchange information seamlessly: we speak the language
          of healthcare so that you do not have to.
          Fhir and IHE profiles support.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
