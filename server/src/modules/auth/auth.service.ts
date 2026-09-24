import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../user/user.model.js';
import { RegisterAuthDto, LoginAuthDto } from './dto/auth.dto.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../common/errors/app-error.js';
import { env } from '../../config/env.js';
import { AuthUserPayload } from '../../common/types/express.js';

export class AuthService {
  private generateReferralCode(name: string): string {
    const cleanPrefix = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'USER';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${cleanPrefix}${randomSuffix}`;
  }

  private generateToken(user: IUser): string {
    const payload: AuthUserPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
  }

  public async register(dto: RegisterAuthDto): Promise<{ user: Partial<IUser>; token: string }> {
    const existing = await UserModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictError('A user with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const referralCode = this.generateReferralCode(dto.name);

    const user = await UserModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      avatarUrl: dto.avatarUrl || '',
      referralCode,
      referralEarnings: 0,
    });

    const token = this.generateToken(user);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        referralCode: user.referralCode,
        referralEarnings: user.referralEarnings,
      },
      token,
    };
  }

  public async login(dto: LoginAuthDto): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await UserModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const token = this.generateToken(user);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        referralCode: user.referralCode,
        referralEarnings: user.referralEarnings,
      },
      token,
    };
  }

  public async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await UserModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw new NotFoundError('User profile not found.');
    }
    return user;
  }
}

export const authService = new AuthService();

