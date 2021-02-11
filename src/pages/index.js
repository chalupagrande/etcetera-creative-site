import React, { useState } from 'react'
import Contact from '~/components/Contact'
import Synapse from '~/components/Sketches/Synapse'
import styles from '~/styles/Home.module.css'

export default function Home(props) {
  const [contact, setContact] = useState(false)
  return (
    <div className={styles.home}>
      <div className={styles.intro}>
        <Synapse />
        <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Etcetera Creative</h1>
          <p>AI, Development &amp; Entertainment. Endless Possibilities.</p>
        </header>
          {contact ? (
            <button
              className={styles.contactButton}
              onClick={() => setContact(!contact)}
              aria-label="show contact form"
            >
              Hide form
            </button>
          ) : (
            <button
              className={styles.contactButton}
              onClick={() => setContact(!contact)}
              aria-label="show contact form"
            >
                Contact Us
            </button>
          )}
        </div>
      </div>
      {contact && <Contact />}
    </div >
  )
}
