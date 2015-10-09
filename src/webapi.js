import Parse, { User, Query } from 'parse';

const Budget = Parse.Object.extend('Budget');
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

export function fetchBudgets() {
  return new Promise((resolve, reject) => {
    const query = new Query(Budget);
    query.find({
      success(fetchedBudgets) {
        resolve(fetchedBudgets.map(extractAttributes));
      },
      error(e) {
        reject(e);
      }
    });
  });
}

export function fetchItems(budget) {
  return new Promise((resolve, reject) => {
    const query = new Query(BudgetItem);
    // TODO: Any clearner way?
    query.equalTo('budget', {
      __type: 'Pointer',
      className: 'Budget',
      objectId: budget.id
    });
    query.find({
      success(fetchedItems) {
        resolve(fetchedItems.map(extractAttributes));
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
