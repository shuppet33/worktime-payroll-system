import type { Employee } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 1,
        firstName: 'Алена',
        lastName: 'Никишова',
        position: 'Frontend Developer',
        paymentType: 'Почасовая',
    },
    {
        id: 2,
        firstName: 'Иван',
        lastName: 'Иванов',
        position: 'Backend Developer',
        paymentType: 'Фиксированная',
    },
    {
        id: 3,
        firstName: 'Мария',
        lastName: 'Петрова',
        position: 'Designer',
        paymentType: 'Почасовая',
    },
];
