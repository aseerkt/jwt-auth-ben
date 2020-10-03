import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { hash, genSalt, compare } from 'bcryptjs';
import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';
import { sendRefreshToken } from './sendRefreshToken';
import { getConnection } from 'typeorm';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: String;
}

@Resolver()
export class UserResolver {
  @Query(() => String) // Query returns a string
  hello() {
    return 'Hello Guys!';
  }

  @Query(() => [User])
  async users() {
    return await User.find();
  }
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `you user id is ${payload?.userId}`;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokenForUSer(@Arg('userId', () => Int) userId: number) {
    try {
      await getConnection()
        .getRepository(User)
        .increment({ id: userId }, 'tokenVersion', 1);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Could not find user');
      }
      const valid = await compare(password, user.password);
      if (!valid) {
        throw new Error('Bad password');
      }

      // login successfull

      // Add refreshToken to cookie
      sendRefreshToken(res, createRefreshToken(user));

      return {
        accessToken: createAccessToken(user),
      };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    try {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
