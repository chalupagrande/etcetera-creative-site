import React, { useState } from 'react'
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3'
import axios from 'axios'
import styles from './Contact.module.css'

export default function Contact() {
  let initialState = {
    email: '',
    name: '',
    message: '',
    subject: 'Etcetera Creative Site',
    error: false
  }

  const {executeRecaptcha} = useGoogleReCaptcha();

  let [formData, setFormData] = useState(initialState)
  let [sendingState, setSendingState] = useState({
    loading: false,
    messageSent: false
  })

  function setData(id, e) {
    setFormData({...formData, [id]: e.target.value})
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      setSendingState({loading: true, messageSent: false})
      let token = await executeRecaptcha("contact")
      let r = await axios({
          method:'post',
          url: '/api/email',
          data: {...formData, recaptcha: token}
        })
      console.log(r)
      setSendingState({loading: false, messageSent: true})
    } catch (err) {
      setFormData({...formData, error: 'Oops. There was an error posting your form'})
      console.log("ERROR", err)
    }
  }

  const {messageSent, loading} = sendingState

  return (
    <form className={styles.contactForm} onSubmit={onSubmit}>
      <div className={`row ${styles.errorMessage} ${!formData.error && 'hide'}`}>
        {formData.error}
      </div>
      <div className={`row ${styles.successMessage} ${!messageSent && 'hide'}`}>
        Your message has been sent
      </div>
      <div className="row">
        <div className="six columns">
          <label htmlFor="email">Your email</label>
          <input
            required
            className="u-full-width"
            type="email"
            placeholder="test@mailbox.com"
            id="email"
            value={formData.email}
            onChange={v => setData('email', v)}
          />
        </div>
        <div className="six columns">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="u-full-width"
            placeholder="John Doe"
            id="name"
            value={formData.name}
            onChange={v => setData('name', v)}
          />
        </div>
      </div>
      <label htmlFor="message">Message</label>
      <textarea
        required
        className="u-full-width"
        placeholder="Hi Jamie …"
        id="message"
        onChange={v => setData('message', v)}
        value={formData.message}
      ></textarea>
      <input
        className={`button-primary ${(loading || messageSent) && 'disabled'}`}
        disabled={(loading || messageSent)}
        type="submit"
        value="Submit"/>
    </form>
  )
}
