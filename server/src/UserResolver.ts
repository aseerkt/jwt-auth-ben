import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { hash, genSalt } from 'bcryptjs';
import { User } from './entity/User';

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
