import styled from "styled-components";

import {SFloatingCard} from "$shared/styles";
import type { AppTheme } from '$shared/theme.ts'

export const SCalendarCard = styled(SFloatingCard)<{ $theme: AppTheme }>`
    padding: 24px;

    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(15, 23, 42, 0.65)' : '#ffffff'};

    border-color: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#dbeafe'};
`;

export const SCalendarTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 24px;
`;

export const SPeriodControls = styled.div`
    display: flex;
    gap: 8px;
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
    $theme: AppTheme;
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
            ${({ $theme, selected }) =>
                    selected
                            ? 'rgba(59,130,246,0.14)'
                            : $theme === 'dark'
                                ? 'rgba(15,23,42,0.5)'
                                : '#f8fafc'};

    border: 1px solid
    ${({ $theme, selected }) =>
            selected
                    ? 'rgba(59,130,246,0.5)'
                    : $theme === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : '#e2e8f0'};

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


