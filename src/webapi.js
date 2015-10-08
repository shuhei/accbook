import Parse, { User, Query } from 'parse';

const BudgetItem = Parse.Object.extend('BudgetItem');

export function currentUser() {
  const user = User.current();
  if (user) {
    return Promise.resolve(user);
  } else {
    return Promise.reject(new Error('No current user'));
  }
}

export function signup({ username, password }) {
  return new Promise((resolve, reject) => {
    // TODO: Automatically login or show message.
    const user = new User();
    user.set('username', username);
    user.set('password', password);
    user.signUp(null, {
      success(user) {
        resolve(user);
      },
      error(user, error) {
        reject(error);
      }
    });
  });
}

export function login({ username, password }) {
  return new Promise((resolve, reject) => {
    User.logIn(username, password, {
      success(user) {
        resolve(user);
      },
      error(user, error) {
        reject(error);
      }
    });
  });
}

export function logout() {
  User.logOut();
  return Promise.resolve();
}

function extractAttributes(parseObject) {
  return { ...parseObject.attributes, id: parseObject.id };
}

export function fetchItems() {
  // return Promise.resolve([
    // { id: '1', label: 'hello', amount: 3333, date: new Date() },
    // { id: '2', label: 'hello', amount: 3333, date: new Date() },
    // { id: '3', label: 'hello', amount: 3333, date: new Date() },
    // { id: '4', label: 'hello', amount: 3333, date: new Date() }
  // ]);
  return new Promise((resolve, reject) => {
    const query = new Query(BudgetItem);
    query.equalTo('user', User.current());
    query.find({
      success(fetchedItems) {
        const items = fetchedItems.map(extractAttributes);
        resolve(items);
      },
      error(e) {
        reject(e);
      }
    });
  });
}

export function saveItem(item) {
  return new Promise((resolve, reject) => {
    const budgetItem = new BudgetItem({ ...item });
    budgetItem.set('user', User.current());
    budgetItem.setACL(new Parse.ACL(User.current()));
    budgetItem.save(null, {
      success(saved) {
        resolve(extractAttributes(saved));
      },
      error(failed, error) {
        reject(error);
      }
    });
  });
}

export function deleteItem(item) {
  return new Promise((resolve, reject) => {
    if (item.id) {
      const obj = new BudgetItem({ ...item, id: undefined });
      obj.id = item.id;
      obj.destroy({
        success() {
          resolve(item);
        },
        error(failed, error) {
          reject(error);
        }
      });
    } else {
      resolve();
    }
  });
}
