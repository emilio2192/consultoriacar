import {ActionReducerMap} from '@ngrx/store';
import { userReducer, UserState } from './user.reducer';

interface AppState {
  userState: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  userState: userReducer,
}
