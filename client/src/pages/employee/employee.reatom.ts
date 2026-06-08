import { atom } from '@reatom/framework';

import type { PaymentType } from '$entities/work-day';

export const paymentTypeAtom =
    atom<PaymentType>(
        'fixed',
        'paymentTypeAtom',
    );

export const selectedDayAtom = atom(
    26,
    'selectedDayAtom',
);

export const calendarMonthAtom = atom(
    5,
    'calendarMonthAtom',
);

export const calendarYearAtom = atom(
    2026,
    'calendarYearAtom',
);
