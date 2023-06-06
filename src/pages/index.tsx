import React, { useEffect, useMemo } from 'react'
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

const Code = (code: string) => (
  <CodeBlock language="bash" title="Boilerplate app quick start" className={styles.homePage__appsCard__codeBlock}>
    {code}
  </CodeBlock>
)

const Image = () => (
  <div className={styles.homePage__appsCard__illustration}>
    <img src="/img/petra-screens.png" alt="Sample App illustration" />
  </div>
)

const AppsList: (code: string) => AppItem[] = (code) => [
  {
    title: 'Boilerplate App',
    imgPath: '/img/code.jpg',
    description: 'Use our template to start up your project integrating our MedTech SDK. You will be ready to try the functionalities of our APIs in a matter of minutes.',
    button: {
      title: 'Quick start',
      link: '/sdks/quick-start',
    },
    IllustrationNode: Code(code),
  },
  {
    title: 'Sample App',
    imgPath: '/img/petra-screens.png',
    description: 'Explore Petra, our sample app, to discover all the functionalities offered by iCure. Learn from a working example of a patient-oriented medical app.',
    button: {
      title: 'Discover Petra',
      link: '/sdks/tutorial/petra/foreword',
    },
    IllustrationNode: Image(),
  },
]

const DocsList: () => DocItem[] = () => [
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

const codeLines = [
  [
    `npx react-native init MedtechApp --template \\\n https://github.com/icure/icure-medtech-react-native-boilerplate
    `,
    5,
    100,
  ],
  [
    `                                                          
                  Welcome to React Native!                
                 Learn once, write anywhere                 
`,
    1,
    300,
  ],
  [
    `✔ Downloading template
✔ Copying template
✔ Processing template
ℹ Executing post init script 
This is post init script
✔ Installing Bundler
✔ Installing CocoaPods dependencies (this may take a few minutes)

...
`,
    0,
    300,
  ],
] as [string, number, number][]

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()

  const [cursor, setCursor] = React.useState([0, 0])

  const codeLine = cursor[0]
  const codeColumn = cursor[1]

  if (codeLine < codeLines.length) {
    if (codeColumn >= codeLines[codeLine][0].length) {
      setTimeout(() => {
        setCursor([codeLine + 1, 0])
      }, codeLines[codeLine][2])
    } else {
      setTimeout(() => {
        setCursor([codeLine, codeColumn + 1])
      }, codeLines[codeLine][1])
    }
  }

  const currentLine = codeLine < codeLines.length ? codeLines[codeLine][0].slice(0, codeColumn) : ''
  const code = (codeLine === 0 ? [] : codeLines.slice(0, codeLine).map((cl) => cl[0])).concat(currentLine).join('\n')

  return useMemo(
    () => (
      <Layout>
        <main className={styles.homePage}>
          <section className={`${styles.homePage__intro} ${styles.container}`}>
            <h1>{`${siteConfig.title}`}</h1>
            <p>
              iCure is a <strong>trustable</strong> service ensuring the <strong>privacy</strong> of your patient <strong>medical data</strong> thanks to{' '}
              <strong>end-to-end encryption</strong>, that empowers your users to decide who can access their data.
            </p>
          </section>

          {AppsList(code).map((element, index) => {
            const { title, imgPath, description, button, IllustrationNode } = element
            return (
              <section key={`apps-section-${index}`} className={`${styles.homePage__appsCardContainer} ${index % 2 !== 0 && styles.homePage__appsCardContainerReverse}`}>
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
          {DocsList().map((element, index) => {
            const { title, description, button } = element
            return (
              <section key={`docs-section-${index}`} className={`${styles.homePage__docsCard} ${styles.container}`}>
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
    ),
    [code],
  )
}
