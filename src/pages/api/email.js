// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import sgMail from '@sendgrid/mail'
import Response from '~/lib/response'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default async (req, res) => {
  const {name, email, message} = req.body
  if(req.method === 'POST') {
    let {data: {success, score}} = await verifyCaptcha(req, res)
    console.log("SCORE", score)
    if(success && score > 0.5) {
      const msg = {
        to: 'jamie@etcetera.cr', // Change to your recipient
        from: 'CONTACT_FORM@chalupagrande.com', // Change to your verified sender
        templateId: "d-9116130cbc85476697d6185faaafe67c",
        dynamicTemplateData: {
          name, email, message
        }
      }
      let r = await sgMail.send(msg)
      console.log(r)
      res.send({success: true, data: r})
    } else {
      res.send(new Response({success: false}))
    }
  }
}

/**
 * Verifies the vaptcha sent from the client. This ensures the route is
 * not accessed by BOTS
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function verifyCaptcha(req, res) {
  const { recaptcha } = req.body
  console.log("SECRET", process.env.RECAPTCHA_SECRET_KEY)
  try {
    let {status, data} = await axios({
      method: 'post',
      url: `https://www.google.com/recaptcha/api/siteverify`,
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptcha,
        remoteip: req.connection.remoteAddress,
      },
    })
    if (status === 200 && data.success) return {data, status}
    else {
      res.status(403).send(new Response({ success: false, message: 'invalid captcha', data }))
    }
  } catch (err) {
    res.status(403).send(new Response({success: false, message: 'invalid captcha: no captcha present', data: err}))
  }
}