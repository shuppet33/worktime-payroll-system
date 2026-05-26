import styled from "styled-components";

import {FloatingCard} from "$entities/styles";

export const CalendarCard = styled(FloatingCard)`
    padding: 24px;
`;

export const CalendarTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 24px;
`;

export const CardTitle = styled.h2`
    margin: 0;

    font-size: 28px;
    font-weight: 700;
`;

export const WeekDays = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    gap: 8px;

    margin-bottom: 8px;
`;

export const WeekDay = styled.div`
    text-align: center;

    color: #64748b;

    font-size: 14px;
    font-weight: 600;
`;

export const DaysGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    gap: 8px;
`;

export const DayCard = styled.div<{
    selected: boolean;
}>`
    height: 72px;

    padding: 10px;

    border-radius: 16px;

    cursor: pointer;

    background: ${({selected}) =>
    selected
        ? 'rgba(59,130,246,0.14)'
        : 'rgba(15,23,42,0.5)'};

    border: 1px solid ${({selected}) =>
    selected
        ? 'rgba(59,130,246,0.5)'
        : 'rgba(255,255,255,0.08)'};

    transition: 0.15s ease;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
        border-color: rgba(
                59,
                130,
                246,
                0.5
        );
    }
`;

export const DayNumber = styled.div`
    font-size: 22px;
    font-weight: 600;
`;

export const DayHours = styled.div`
    font-size: 14px;

    color: #64748b;
`;

export const Hint = styled.div`
    margin-top: 18px;

    color: #64748b;

    font-size: 14px;
`;

export const EmptyCell = styled.div`
    height: 72px;
`;


