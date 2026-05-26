import dayjs from 'dayjs';

export const generateCalendarDays = (
    month: number,
    year: number,
) => {
    const startOfMonth = dayjs(
        `${year}-${month}-01`,
    );

    const daysInMonth =
        startOfMonth.daysInMonth();

    let firstDay =
        startOfMonth.day() - 1;

    if (firstDay < 0) {
        firstDay = 6;
    }

    const days: Array<number | null> =
        [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        days.push(day);
    }

    return days;
};