import { Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query(() => String) // Query returns a string
  hello() {
    return 'Hello Guys!';
  }
}
