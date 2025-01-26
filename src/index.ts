import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
const ExcelJS = require('exceljs')

interface EmailConfig {
  service: string
  name?: string
  user: string
  pass: string
}

interface Contact {
  email: string
  name?: string
}

export class EmailSender {
  private transporter: nodemailer.Transporter
  private failedFilePath: string = ''
  private failedFileName: string =
    'failed_emails-' + new Date().toISOString() + '.xlsx'

  constructor(private config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      service: this.config.service,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    })
  }

  private prepareMessage(message: string, contact: Contact): string {
    return message.replace('${name}', contact.name || '')
  }

  public async sendEmails(
    contacts: Contact[],
    message: string,
    subject: string,
  ) {
    if (contacts.length === 0) {
      throw new Error("Contacts can't be empty")
    }

    if (!message || !subject) {
      throw new Error("Message and Subject can't be empty")
    }

    let fails: Contact[] = []

    for (let contact of contacts) {
      const htmlContent = this.prepareMessage(message, contact)

      const mailOptions = {
        from: this.config.name
          ? `${this.config.name} <${this.config.user}>`
          : this.config.user,
        to: contact.email,
        subject,
        html: htmlContent,
        attachments: [],
      }

      const sendEmail = async () => {
        return new Promise((resolve) => {
          this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              resolve({ success: false, contact })
            } else {
              resolve({ success: true, contact })
            }
          })
        })
      }

      const result: any = await sendEmail()
      if (!result.success) {
        fails.push(result.contact)
      }
    }

    if (fails.length > 0) {
      this.createFailedEmailsExcel(fails)
      throw new Error(
        `Failed to send emails to: ${fails.map((c) => c.email).join(', ')}`,
      )
    }

    return `All emails sent successfully`
  }

  private createFailedEmailsExcel(failedEmails: Contact[]) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('My Sheet')
    worksheet.columns = [
      { header: 'EmailAddress', key: 'email' },
      { header: 'FirstName', key: 'firstName' },
    ]
    failedEmails.forEach((contact) => {
      worksheet.addRow({ email: contact.email, firstName: contact.name })
    })
    const filePath = path.join(
      __dirname,
      this.failedFilePath +
        (this.failedFilePath ? '/' : '') +
        this.failedFileName,
    )

    workbook.xlsx.writeFile(filePath).then(() => {
      console.log('File saved successfully.')
    })
  }
}

const emailConfig = {
  name: 'Yadab',
  service: 'yahoo',
  user: 'yadab.sutradhar@yahoo.com',
  pass: 'dpbuybruyhuaigxu',
}

const emailSender = new EmailSender(emailConfig)

const contacts = [{ email: 'yadab.sd2013@gmail.com', name: 'Yadab' }]
const message = 'Hello ${name}, <p><b>this</b> is a test email!</p>'
const subject = 'Test Email'

emailSender
  .sendEmails(contacts, message, subject)
  .then((message) => {
    console.log(message)
  })
  .catch((error) => {
    console.error(error)
  })
