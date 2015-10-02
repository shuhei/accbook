export const TOGGLE_MENU = 'TOGGLE_MENU';
export const NEW_ITEM = 'NEW_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const SAVE_ITEM = 'SAVE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const CLOSE_FORM = 'CLOSE_FORM';

export function newItem() {
  return { type: NEW_ITEM };
}

export function editItem(item) {
  return { type: EDIT_ITEM, item };
}

export function deleteItem(item) {
  return { type: DELETE_ITEM, item };
}

export function saveItem(item) {
  return { type: SAVE_ITEM, item };
}

export function closeForm() {
  return { type: CLOSE_FORM };
}

export function toggleMenu() {
  return { type: TOGGLE_MENU };
}
