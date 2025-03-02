import AdminJS, { App } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { dark, light } from '@adminjs/themes';
import User from '../models/user.js';
import Category from '../models/category.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import Transaction from '../models/transaction.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Register the mongoose adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const DEFAULT_ADMIN = {
  email: 'sudeepkumar1920@gmail.com',
  password: '12345',
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

export const buildAdminRouter = async (app) => {
  const adminJs = new AdminJS({
    resources: [
      { resource: User },
      { resource: Category },
      { resource: Product },
      { resource: Order },
      { resource: Transaction }
    ],
    rootPath: '/admin',
    defaultTheme: dark,
    availableThemes: [dark, light],
    branding: {
      companyName: 'Your Store Admin',
      logo: false,
      softwareBrothers: false,
      theme: {
        colors: {
          primary100: '#FF0000',
          primary80: '#FF1A1A',
          primary60: '#FF3333',
          primary40: '#FF4D4D',
          primary20: '#FF6666',
          filterBg: '#252525',
          bg: '#1A1A1A',
        }
      }
    }
  });

  const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'adminSessions'
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_PASSWORD
    },
    null,
    {
      store: mongoStore,
      resave: false,
      saveUninitialized: true,
      secret: process.env.COOKIE_PASSWORD,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      },
      name: 'adminjs'
    }
  );

  app.use(adminJs.options.rootPath, adminRouter);
};

export default buildAdminRouter;