import * as express from "express";
import {Request, Response, NextFunction} from "express";
import * as path from "path";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as session from "express-session";

import {initAuthentication} from "./auth";

const staticResourcesPath = path.join(__dirname, 'public');

export const app = express();

initAuthentication();

app.use(express.static(staticResourcesPath));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', successRedirect:"/" })
);

app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(staticResourcesPath, 'login.html'))
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
});

app.get('/', (req: Request, res: Response) => {
  res.send(`You're authenticated!`);
});

app.get('/test', (req: Request, res: Response) => {
  res.send(`Test page for logged in users.`);
});

app.get('/logout', (req: Request, res: Response) => {
  req.logout();
  res.send("You're logged out.");
});