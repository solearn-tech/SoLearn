import nodemailer, { TestAccount, Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email using configured mail service
 * @param options Email options including recipient, subject, text and optional HTML content
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create transporter based on environment
  let transporter: Transporter;
  
  if (process.env.NODE_ENV === 'production') {
    // Use configured mail service in production
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Use Ethereal for development/testing (https://ethereal.email/)
    const testAccount: TestAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Email options
  const mailOptions = {
    from: `SoLearn <${process.env.EMAIL_FROM || 'noreply@solearn.co'}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  
  // Log preview URL for development environment
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Email preview: ${nodemailer.getTestMessageUrl(info)}`);
  }
}; 