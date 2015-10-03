export function login() {
  return Promise.resolve({
    uid: 123,
    name: 'shuhei'
  });
}

export function fetchItems() {
  return Promise.resolve([
    { amount: 1000, label: 'hello', date: new Date() },
    { amount: -2300, label: 'minus', date: new Date() }
  ]);
}
