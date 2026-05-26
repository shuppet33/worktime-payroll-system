import styled from 'styled-components';

import { FloatingCard } from '$entities/styles';

export const EmployeeCard =
    styled(FloatingCard)`
        padding: 20px;

        cursor: pointer;

        transition: 0.15s ease;

        &:hover {
            transform: translateY(-4px);
        }
    `;

export const EmployeeName =
    styled.div`
        font-size: 20px;
        font-weight: 600;

        margin-bottom: 12px;
    `;

export const EmployeePosition =
    styled.div`
        color: #94a3b8;

        margin-bottom: 8px;
    `;

export const EmployeeType =
    styled.div`
        color: #60a5fa;
    `;
