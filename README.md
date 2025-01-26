


# 📧 Email Sender Service

A simple Node.js application that sends emails using the `nodemailer` package. This service ensures smooth email delivery with customizable options for creating folders and managing attachments.

---

## 🚀 Features

- Lightweight and customizable codebase.
- Designed to be beginner-friendly.
- Easy to configure.
- Helpful for job seekers to send emails to hiring managers and recruiters with bulk/batch for free!

---

## 🛠️ Prerequisites

Before starting, make sure you have the following installed on your system:

- **Node.js** (v18 or higher)
- **npm** or **yarn**

---

## 📦 Installation

1. Clone the repository:
   ```bash
   npm install email-sender
   ```
   ```bash
   yarn add email-sender
   ```
   
## Usage

### Step 1 - Configure
Add this code to your program file-
```
export const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'your-email@example.com', // your email address (sender/from)
    pass: 'your-email-password', // your app password for your email account
  },
  name: 'your-display-name'
};
```
---

### Notes:
1. Replace placeholders like `your-email@example.com`, `your-display-name`, with your actual details.
2. Use `gmail`, `yahoo` etc. in `service` placeholder. Whereever is your actual email account in.
3. For `pass`, this is not your email login password. It is a app password which can be collected from your email account. For details follow-

#### Enable App Passwords:
#### Yahoo
Log in to your [Yahoo Account](https://login.yahoo.com/).\
Click top-right avatar -> Login (if not logged in already)
Click on Security on nav bar > App Passwords.\
Generate a new app password for "Mail".\
Copy the password and use it as your `pass` value.\

#### Gmail
Follow [Google App Password](https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237) to get app password.\

#### Other Services
Follow their own instructions to get app password.


For JavaScript Users:
```javascript
const { add } = require('email-sender');
```

For TypeScript Users:
```typescript
import { add } from 'email-sender';
```

```js
const emailSender = new EmailSender(emailConfig)

const contacts = [{ email: 'receiver-name@example.com', name: 'Don' }]
const message = 'Hello ${name}, this is your email content!' // you can add html here. Example - 'Hello ${name}, <p><b>this</b> is a test email!</p>'
const subject = 'This is Your Email subject'

emailSender
  .sendEmails(contacts, message, subject)
  .then((message) => {
    console.log(message)
  })
  .catch((error) => {
    console.error(error)
  })
```