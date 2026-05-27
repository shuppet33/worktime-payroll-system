import styled from 'styled-components';

import { SFloatingCard } from '$shared/styles';

export const SEmployeeCard =
    styled(SFloatingCard)`
        padding: 20px;

        cursor: pointer;

        transition: 0.15s ease;

        &:hover {
            transform: translateY(-4px);
        }
    `;

export const SEmployeeName =
    styled.div`
        font-size: 20px;
        font-weight: 600;

        margin-bottom: 12px;
    `;

export const SEmployeePosition =
    styled.div`
        color: #94a3b8;

        margin-bottom: 8px;
    `;

export const SEmployeeType =
    styled.div`
        color: #60a5fa;
    `;
