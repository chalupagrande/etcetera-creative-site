import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import '~/styles/normalize.css'
import '~/styles/skeleton.css'
import '~/styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="wrapper">
      <GoogleReCaptchaProvider
        reCaptchaKey="6LdY0lIaAAAAABVo1feIENsMrF-QUjSwv4xL2ajB"
      >
        <Component {...pageProps} />
      </GoogleReCaptchaProvider>
    </div>
  )
}

export default MyApp
