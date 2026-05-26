import { atom } from '@reatom/framework';

export const selectedEmployeeAtom =
    atom<number | null>(
        null,
        'selectedEmployeeAtom',
    );

export const employeeModalOpenAtom =
    atom(
        false,
        'employeeModalOpenAtom',
    );