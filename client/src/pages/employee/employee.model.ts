import { atom } from '@reatom/framework';

export type PaymentType =
    | 'hourly'
    | 'fixed';

export const paymentTypeAtom =
    atom<PaymentType>(
        'fixed',
        'paymentTypeAtom',
    );

export const selectedDayAtom = atom(
    26,
    'selectedDayAtom',
);