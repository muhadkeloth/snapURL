import { randomBytes, randomInt } from "crypto";
import logger from "./logger";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { AppError } from "../middleware/errorHandler";


export const generateRandomString = (): string => {
    return randomBytes(3).toString('hex');
}

export const otpgerateFn = async(email: string):Promise<{status:number,message:string, otp:string} | null> => {
    try {
        const otp = randomInt(100001,999999).toString();
        await sendOtpEmail(email,otp);
        return {status: 200, message: "OTP sent successfully", otp};
    } catch (error) {
        logger.error(`Error in otpgerateFn: ${error}`);
        return null;
    }
}

const sendOtpEmail = async(email:string, otp:string):Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: 'Registration OTP for SnapURL', 
        text:  `
        Hello,
  

        Your One-Time Password (OTP) for verification is: ${otp}


        For security, do not share your OTP.


        
        Best regards,
        ShortURL Team
        `,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        logger.info(`OTP sent to ${email}`);
      } catch (error) {
        logger.error(`Error sending OTP email: ${error}`);
        throw new Error('Failed to send OTP email');
      }
}

export const validatePassword = async (newPassword:string, password: string) => {
    const isValid = await bcrypt.compare(newPassword, password);
    if (!isValid) {
        logger.error(`Invalid password`)
        throw new AppError(`Invalid password`, 400);
    }
}

export const hashPassword = async (password: string):Promise<string> => {  
    return await bcrypt.hash(password, 10);
}   
