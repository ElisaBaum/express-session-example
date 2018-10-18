import * as passport from "passport";
import {Strategy} from "passport-local";

import {User} from "./model/User";

const users = [
  new User(1, 'Bob', 'test')
];

const localStrategy: Strategy = new Strategy(
    {session: true},
    (username: string, password: string, done) => {
      const currentUser = users.find(user => user.username === username);

      if (!currentUser) {
        return done(null, false, {message: 'Incorrect username.'});
      }

      if (currentUser.password !== password) {
        return done(null, false, {message: 'Incorrect password.'});
      }

      return done(null, currentUser);
    }
);

export function initAuthentication() {
  passport.use(localStrategy);
  passport.serializeUser<User, number>((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser<User, number>((id: number, done) => {
    const user = users.find(user => user.id === id);

    if (user) {
      done(null, user);
    } else {
      done(null);
    }
  })
}

