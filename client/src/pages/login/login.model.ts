import {atom} from "@reatom/framework";

export type UserRole = 'employee' | 'company';
export type LoginStep = 'select-role' | 'login';

export const loginAtom = atom<string>('', 'loginAtom');
export const passwordAtom = atom<string>('', 'passwordAtom');

export const roleAtom = atom<UserRole>(
    'employee',
    'roleAtom',
);

export const stepAtom = atom<LoginStep>(
    'select-role',
    'stepAtom',
);
