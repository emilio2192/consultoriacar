import {createAction, props} from '@ngrx/store';

type UserState = {
  currentUser: any;
  users: any[];
}

export const initialState: UserState = {
  currentUser: null,
  users: []
};

export const setCurrentUser = createAction(
  '[User SigIn] SignIn',
  props<{user:any}>()
);