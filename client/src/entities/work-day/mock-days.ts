import type { FixedWorkDay, HourlyWorkDay } from './types';

export const MOCK_DAYS: HourlyWorkDay[] = [
    {
        day: 1,
        hours: '4ч',
        description: 'Рабочая смена',
    },
    {
        day: 5,
        hours: '5ч',
        description: 'Сокращенный день',
    },
    {
        day: 12,
        hours: '8ч',
        description: 'Полная смена',
    },
    {
        day: 19,
        hours: '7ч',
        description: 'Работа в офисе',
    },
    {
        day: 20,
        hours: '6ч 15м',
        description: 'Рабочая смена',
    },
    {
        day: 26,
        hours: '1ч 30м',
        description: 'Созвон с командой',
    },
];

export const MOCK_FIXED_DAYS: FixedWorkDay[] = [
    {
        day: 1,
        worked: true,
    },
    {
        day: 2,
        worked: false,
        reason: 'Выходной',
    },
    {
        day: 3,
        worked: false,
        reason: 'Больничный',
    },
];
