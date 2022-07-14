import { NextFunction, Request, Response } from 'express';
import { generateAccessToken } from '../../common/jwt';
import { hashPassword } from '../../common/utils';
import db from '../../db';
import bcrypt from 'bcryptjs';
const { User } = db;

export async function authRegisterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    if (!regexEmail.test(email)) {
      return res.status(400).json({
        message: 'invalid Email',
      });
    }
    const user = {
      email,
      password,
    };

    const oldUser = await User.findOne({
      where: {
        email,
      },
    });

    if (oldUser) {
      return res.status(400).json({
        message: 'user already exists',
      });
    }
    await User.create(user);
    return res.status(201).json({
      message: 'user created',
    });
  } catch (error) {
    next(error);
  }
}

export async function authLoginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!user || !checkPassword) {
      return res.status(400).json({
        message: 'email or password is incorrect',
      });
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}
