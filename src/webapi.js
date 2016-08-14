/* @flow */
import Parse, { User as ParseUser, Query } from 'parse';
import type {
  Auth,
  User,
  Budget,
  BudgetItem,
} from './types';

const ParseBudget = Parse.Object.extend('Budget');
const ParseBudgetItem = Parse.Object.extend('BudgetItem');

export function currentUser(): Promise<User> {
  const user: ?User = ParseUser.current();
  if (!user) {
    return Promise.reject(new Error('No current user'));
  }
  return Promise.resolve(user);
}

export function signup({ username, password }: Auth): Promise<User> {
  return new Promise((resolve, reject) => {
    // TODO: Automatically login or show message.
    const parseUser = new ParseUser();
    parseUser.set('username', username);
    parseUser.set('password', password);
    parseUser.signUp(null, {
      success(user: User) {
        resolve(user);
      },
      error(user, error) {
        reject(error);
      },
    });
  });
}

export function login({ username, password }: Auth): Promise<User> {
  return new Promise((resolve, reject) => {
    ParseUser.logIn(username, password, {
      success(user) {
        resolve(user);
      },
      error(user, error) {
        reject(error);
      },
    });
  });
}

export function logout(): Promise<void> {
  ParseUser.logOut();
  return Promise.resolve();
}

/* eslint-disable no-param-reassign */
function flattenAttributes({ attributes }) {
  return Object.keys(attributes).reduce((acc, key) => {
    const value = attributes[key];
    if (value && value.id) {
      acc[`${key}Id`] = value.id;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}
/* eslint-enable no-param-reassign */

function extractAttributes(parseObject) {
  return { ...flattenAttributes(parseObject), id: parseObject.id };
}

export function fetchBudgets(): Promise<Budget[]> {
  return new Promise((resolve, reject) => {
    const query = new Query(ParseBudget);
    query.find({
      success(fetchedBudgets) {
        resolve(fetchedBudgets.map(extractAttributes));
      },
      error(e) {
        reject(e);
      },
    });
  });
}

export function fetchItems(): Promise<BudgetItem[]> {
  return new Promise((resolve, reject) => {
    const query = new Query(ParseBudgetItem);
    query.find({
      success(fetchedItems) {
        resolve(fetchedItems.map(extractAttributes));
      },
      error(e) {
        reject(e);
      },
    });
  });
}

function setACL(obj) {
  obj.setACL(new Parse.ACL(ParseUser.current()));
}

export function saveItem(item: BudgetItem): Promise<BudgetItem> {
  return new Promise((resolve, reject) => {
    const budgetItem = new ParseBudgetItem({ ...item });
    setACL(budgetItem);
    budgetItem.save(null, {
      success(saved) {
        const newItem: BudgetItem = extractAttributes(saved);
        resolve(newItem);
      },
      error(failed, error) {
        reject(error);
      },
    });
  });
}

export function deleteItem(item: BudgetItem): Promise<BudgetItem> {
  return new Promise((resolve, reject) => {
    if (item.id) {
      const obj = new ParseBudgetItem({ ...item, id: undefined });
      obj.id = item.id;
      obj.destroy({
        success() {
          resolve(item);
        },
        error(failed, error) {
          reject(error);
        },
      });
    } else {
      reject(new Error('No id on BudgetItem'));
    }
  });
}

export function deleteBudget(budget: Budget): Promise<Budget> {
  return new Promise((resolve, reject) => {
    if (budget.id) {
      const obj = new ParseBudget({ ...budget, id: undefined });
      obj.id = budget.id;
      obj.destroy({
        success() {
          resolve(budget);
        },
        error(failed, error) {
          reject(error);
        },
      });
    } else {
      reject(new Error('No id on Budget'));
    }
  });
}

export function saveBudget(budget: Budget): Promise<Budget> {
  return new Promise((resolve, reject) => {
    const parseBudget = new ParseBudget({ ...budget });
    setACL(parseBudget);
    parseBudget.save(null, {
      success(saved) {
        resolve(extractAttributes(saved));
      },
      error(failed, error) {
        reject(error);
      },
    });
  });
}
