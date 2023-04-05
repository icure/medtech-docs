import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import CodeBlock from '@theme/CodeBlock'

import styles from './index.module.css'

type AppItem = {
  title: string
  imgPath: string
  description: string
  button: {
    title: string
    link: string
  }
  IllustrationNode: JSX.Element
}

type DocItem = {
  title: string
  description: string
  button: {
    title: string
    link: string
  }
}

const Code = () => (
  <CodeBlock language="bash" title="Boilerplate app quick start" className={styles.homePage__appsCard__codeBlock}>
    {`npx create-react-native-app --template https://github.com/icure/icure-medical-device-react-native-boilerplate-app-template

✔ What is your app named? … my-icure-app
✔ Downloaded and extracted project files.

Using Yarn to install packages. You can pass --use-npm to use npm instead.

✔ Installed JavaScript dependencies.

✅ Your project is ready!

To run your project, navigate to the directory and run one of the following yarn commands.

- cd my-icure-app
- yarn android
- yarn ios
- yarn web`}
  </CodeBlock>
)

const Image = () => (
  <div className={styles.homePage__appsCard__illustration}>
    <img src="/img/petra-screens.png" alt="Sample App illustration" />
  </div>
)

const AppsList: AppItem[] = [
  {
    title: 'Boilerplate App',
    imgPath: '/img/code.jpg',
    description: 'Use our template to start up your project integrating our MedTech SDK. You will be ready to try the functionalities of our APIs in a matter of minutes.',
    button: {
      title: 'Quick start',
      link: '#',
    },
    IllustrationNode: Code(),
  },
  {
    title: 'Sample App',
    imgPath: '/img/petra-screens.png',
    description: 'Explore Petra, our sample app, to discover all the functionalities offered by iCure. Learn from a working example of a patient-oriented medical app.',
    button: {
      title: 'Discover Petra',
      link: '#',
    },
    IllustrationNode: Image(),
  },
]

const DocsList: DocItem[] = [
  {
    title: 'Medical Device SDK Docs',
    description:
      'The MedTech SDK provides you a series of services and functionalities focused on managing medical information gathered from medical devices or provided by the patient himself, and store it encrypted in our cloud or on your premises.',
    button: {
      title: 'Explore the SDK Docs',
      link: '/sdks/intro',
    },
  },
  {
    title: 'Cockpit Docs',
    description: 'The cockpit is a web platform that allows you to manage easily the apps, users and databases that you need to work with the iCure SDK.',
    button: {
      title: 'Explore the Cockpit Docs',
      link: '/cockpit/intro',
    },
  },
]

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main className={styles.homePage}>
        <section className={`${styles.homePage__intro} ${styles.container}`}>
          <h1>{`${siteConfig.title}`}</h1>
          <p>
            iCure is a <strong>trustable</strong> service ensuring the <strong>privacy</strong> of your patient <strong>medical data</strong> thanks to{' '}
            <strong>end-to-end encryption</strong>, that empowers your users to decide who can access their data.
          </p>
        </section>

        {AppsList.map((element, index) => {
          const { title, imgPath, description, button, IllustrationNode } = element
          return (
            <section className={`${styles.homePage__appsCardContainer} ${index % 2 !== 0 && styles.homePage__appsCardContainerReverse}`}>
              <div className={`${styles.homePage__appsCard} ${styles.container}`}>
                {IllustrationNode}
                <div className={styles.homePage__appsCard__contentWrap}>
                  <div className={styles.homePage__appsCard__content}>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                  <Link to={button.link} className={styles.primaryBtn}>
                    {button.title}
                  </Link>
                </div>
              </div>
            </section>
          )
        })}
        {DocsList.map((element) => {
          const { title, description, button } = element
          return (
            <section className={`${styles.homePage__docsCard} ${styles.container}`}>
              <div className={styles.homePage__docsCard__content}>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <Link to={button.link} className={styles.primaryBtn}>
                {button.title}
              </Link>
            </section>
          )
        })}
      </main>
    </Layout>
  )
}
