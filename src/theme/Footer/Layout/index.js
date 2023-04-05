import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './index.module.css'

export default function FooterLayout({ style }) {

  const footerLinks = [
    {
      title: 'Want to know more about iCure?',
      link: {
        title: 'Visit our website',
        url: 'https://icure.com/'
      }
    },
    {
      title: 'Having a problem?',
      link: {
        title: 'Contact us',
        url: 'https://icure.com/'
      }
    }
  ]

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">
        <div className={styles.links}>

          {
            footerLinks.map(el => <div className={styles.links__item}>
              <p>{el.title}</p>
              <svg width="31" height="6" viewBox="0 0 31 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1 3H31Z" fill="#D7D7D7" />
                <path d="M1 2.5H0.5V3.5H1V2.5ZM31 3L26 0.113249V5.88675L31 3ZM1 3.5H26.5V2.5H1V3.5Z" fill="#D7D7D7" />
              </svg>
              <Link to={el.link.url}>{el.link.title}</Link>
            </div>)
          }

        </div>
      </div>
    </footer>
  );
}
