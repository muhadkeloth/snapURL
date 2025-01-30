import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import logger from "../utils/logger";
import UrlService from "../services/UrlService";
import UrlRepository from "../repositories/UrlRepository";
import Url from "../models/Url";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../utils/interface";
import { generateRandomString, otpgerateFn, validatePassword } from "../utils/functions";
import { generateToken } from "../utils/jwt";


const otplog: Record<string, string> = {};

export default class UserController {
  private service: UserService;
  protected urlService: UrlService;

  constructor(service: UserService) {
    this.service = service;
    this.urlService = new UrlService(new UrlRepository(Url));
  }

 
  login = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const { email, password} = req.body;
      const user = await this.service.findOne({email});
      if(!user) {
        logger.warn("user not found");
        throw new AppError("user not found", 404);
      }
      await validatePassword(password, user.password);
      const accessToken = generateToken(user._id)
    
      res.status(200).json({ accessToken, message: "Login successful" });
    } catch (error) {
        const err = error as Error;
        logger.error(`error login: ${err.message}`);
        next(err);    }
  };
 
  register = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const { name, email, password } = req.body;
        if(!name || !email || !password) {
            logger.warn("missing fields");
            throw new AppError("missing fields", 400);
        }
        let existingUser = await this.service.findOne({email});
        if(existingUser) {
            logger.warn("email already exists");
            throw new AppError("email already exists", 400);
        }   
        const createdUser = await this.service.create({name, email, password});
        if(!createdUser){
            logger.warn("registration failed");
            throw new AppError("registration failed", 400);
        }
        const accessToken = generateToken(createdUser._id);
        res.status(200).json({ accessToken, message: "registration successful" });
    } catch (error) {
        const err = error as Error;
        logger.error(`error registeration: ${err.message}`);
        next(err);
    }
  };

 
  getOTP = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const { email } = req.body;
      if(!email) {
        logger.warn("email not found");
        throw new AppError("email not found", 400);
      }
      const existingUser = await this.service.findOne({email});
        if(existingUser) {
            logger.warn("email already exists");
            throw new AppError("email already exists", 400);
        }

      const response = await otpgerateFn(email)
      if(!response) {
        logger.error("error generating otp");
        throw new AppError("error generating otp", 500);
      }
      const timeout:number = 1000 * 60 * 5;
      otplog[email] = response.otp;
      setTimeout(() => {
        delete otplog[email]
      }, timeout);

      res.status(response.status).json({ message: response.message });
    } catch (error) {
        const err = error as Error;
        logger.error(`error generate otp: ${err.message}`);
        next(err);
    }
  };

 
  validateOTP = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const { email, otp } = req.body;
      if(!email) {
        logger.warn("email not found");
        throw new AppError("email not found", 400);
      }
      if(!otp) {
        logger.warn("otp not found");
        throw new AppError("otp not found", 400);
      }
      const otpInLog = otplog[email];
      if(!otpInLog) {
        logger.warn("otp expired");
        throw new AppError("otp expired", 400);
      }
        if(otpInLog !== otp) {
            logger.warn("otp mismatch");
            throw new AppError("otp mismatch", 400);
        };
        delete otplog[email]
        res.status(200).json({ message: "OTP validated successfully" });
    } catch (error) {
        const err = error as Error;
        logger.error(`error validate otp: ${err.message}`);
        next(err);
    }
  };

  redirectUrl = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const shortUrl = req.params.shortUrl;
      if(!shortUrl) {
        logger.warn("short url not found");
        throw new AppError("short url not found", 404);
      }

      const urlRecord = await this.urlService.findByShortUrl(shortUrl);
      if(!urlRecord) {
        logger.warn("url not found");
        throw new AppError("url not found", 404);
      }
      urlRecord.clicks +=1 ;
      await urlRecord.save();
      res.redirect(urlRecord.originalUrl);
    } catch (error) {
        const err = error as Error;
        logger.error(`error redirect urls: ${err.message}`);
        next(err);
    }
  };

  shortenURL = async (req: AuthenticatedRequest, res: Response, next:NextFunction) => {
    try {
      if (!req.userId) {
        logger.warn("userid not found");
        throw new AppError("userid not found", 400);
      };
      const userId = req.userId as string;
      const { url } = req.body;
      if(!url) {
        logger.warn("url not found");
        throw new AppError("url not found", 400);
      }

      let shortUrl = generateRandomString();
      let existingUrl = await this.urlService.findOne({shortUrl});

      while(existingUrl) {
        shortUrl = generateRandomString();
        existingUrl = await this.urlService.findOne({shortUrl});
      }

      const newUrl = await this.urlService.create({userId, originalUrl: url, shortUrl});

      res.status(200).json({newUrl});
    } catch (error) {
        const err = error as Error;
        logger.error(`error create urls: ${err.message}`);
        next(err);
    }
  };

  getAllShortenURLs = async ( req: AuthenticatedRequest, res: Response, next: NextFunction ) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
      if (!req.userId) {
        logger.warn("userid not found");
        throw new AppError("userid not found", 400);
      }
      const userId = req.userId as string;
      const URLs = await this.urlService.findURLs(userId, skip, limit);
      const totalURLs = (await this.urlService.findCountURLs({ userId })) ?? 0;
      
      if(URLs){
        const domain = process.env.DOMAIN + '/link/'
        URLs.forEach(url => url.shortUrl = domain + url.shortUrl)
      }
      res
        .status(200)
        .json({
          URLs,
          totalPages: Math.ceil(totalURLs / limit),
          currentPage: page,
        });
    } catch (error) {
      const err = error as Error;
      logger.error(`error fetch all urls: ${err.message}`);
      next(err);
    }
  };

  deleteURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.shortUrl;
      if (!id) {
        logger.warn("url id not found");
        throw new AppError("url id not found in backend", 404);
      }

      const result = await this.urlService.delete({ _id:id });

      if (!result) {
        throw new AppError("URL not found", 404);
      }

      res.status(200).json({ message: "successfully deleted url" });
    } catch (error) {
      const err = error as Error;
      logger.error(`error delete urls: ${err.message}`);
      next(err);
    }
  };
}