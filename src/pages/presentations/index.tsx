import React from 'react'
import Layout from '@theme/Layout'

type Presentation = {
  title: string
  description: string
  file: string
}

const presentations: Presentation[] = [
  {
    title: 'Cardinal Backend for Developers',
    description: 'Why use Cardinal instead of building a healthcare backend from scratch. AI-assisted development, E2E encryption, compliance, and interoperability.',
    file: '/presentations/cardinal-backend-for-developers.html',
  },
  {
    title: 'Cardinal Data Model',
    description: 'Deep dive into the Cardinal SDK data model: Patient, Contact, Service hierarchy, shared structures, and end-to-end encryption.',
    file: '/presentations/cardinal-data-model.html',
  },
  {
    title: 'Cardinal Messaging',
    description: 'Encrypted messaging capabilities in the Cardinal SDK: Topics, Messages, and real-time communication.',
    file: '/presentations/cardinal-messaging.html',
  },
]

export default function Presentations(): React.JSX.Element {
  return (
    <Layout title="Presentations" description="Cardinal SDK presentations and slide decks">
      <main style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '90%' }}>
          <h1 style={{ marginBottom: 8 }}>Presentations</h1>
          <p style={{ color: 'var(--ifm-color-content)', opacity: 0.7, marginBottom: 40, fontSize: 18 }}>
            Slide decks about the Cardinal SDK and backend.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {presentations.map((p) => (
              <a
                key={p.file}
                href={p.file}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid var(--ifm-card-border-color)',
                  background: 'var(--ifm-card-background-color)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ifm-color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ifm-card-border-color)')}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: '#0f172a',
                    borderRadius: 8,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <iframe
                    src={p.file}
                    title={p.title}
                    style={{
                      width: 1280,
                      height: 720,
                      border: 'none',
                      transform: 'scale(0.25)',
                      transformOrigin: 'top left',
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    tabIndex={-1}
                  />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>{p.description}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  )
}
