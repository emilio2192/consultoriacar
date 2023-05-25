import {createReducer, on} from '@ngrx/store';

import * as userActions from '../actions/users.action';

export interface UserState {
  currentUser: any;
  users: any[];
}

export const initialState: UserState  ={
  currentUser: null,
  users:[]
};

const _userReducer = createReducer(
  initialState,
  on(userActions.setCurrentUser, (state, {user}) => ({
    ...state,
    currentUser: user,
  }))
);

export const userReducer = (state: any, action:any) => _userReducer(state, action);