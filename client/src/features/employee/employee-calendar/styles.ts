import styled from "styled-components";

import {SFloatingCard} from "$shared/styles";

export const SCalendarCard = styled(SFloatingCard)`
    padding: 24px;
`;

export const SCalendarTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 24px;
`;

export const SCardTitle = styled.h2`
    margin: 0;

    font-size: 28px;
    font-weight: 700;
`;

export const SWeekDays = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    gap: 8px;

    margin-bottom: 8px;
`;

export const SWeekDay = styled.div`
    text-align: center;

    color: #64748b;

    font-size: 14px;
    font-weight: 600;
`;

export const SDaysGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    gap: 8px;
`;

export const SDayCard = styled.div<{
    selected: boolean;
    inactive?: boolean;
}>`
    height: 72px;

    padding: 10px;

    border-radius: 16px;

    cursor: pointer;

    opacity:
            ${({ inactive }) =>
                    inactive ? 0.45 : 1};

    background:
            ${({ selected }) =>
                    selected
                            ? 'rgba(59,130,246,0.14)'
                            : 'rgba(15,23,42,0.5)'};

    border: 1px solid
    ${({ selected }) =>
            selected
                    ? 'rgba(59,130,246,0.5)'
                    : 'rgba(255,255,255,0.08)'};

    transition: 0.15s ease;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
        border-color:
                rgba(
                        59,
                        130,
                        246,
                        0.5
                );
    }
`;

export const SDayNumber = styled.div`
    font-size: 22px;
    font-weight: 600;
`;

export const SDayHours = styled.div`
    font-size: 14px;

    color: #64748b;
`;

export const SHint = styled.div`
    margin-top: 18px;

    color: #64748b;

    font-size: 14px;
`;

export const SEmptyCell = styled.div`
    height: 72px;
`;


