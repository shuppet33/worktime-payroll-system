import styled from "styled-components";

import {SFloatingCard} from "$shared/styles";

export const SDetailsCard = styled(SFloatingCard)`
    padding: 24px;

    min-height: 220px;
`;


export const SCardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 24px;
`;

export const SDetailsDate = styled.div`
    font-size: 22px;
    font-weight: 600;
`;

export const SHoursBadge = styled.div`
    padding: 8px 14px;

    border-radius: 14px;

    background: rgba(59, 130, 246, 0.14);

    border: 1px solid rgba(59, 130, 246, 0.3);

    color: #60a5fa;

    font-weight: 600;
`;

export const SDescriptionCard = styled.div`
    padding: 18px;

    border-radius: 18px;

    background: rgba(255, 255, 255, 0.03);

    border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const SDescriptionTitle = styled.div`
    margin-bottom: 10px;

    color: #64748b;

    font-size: 14px;
`;

export const SDescriptionText = styled.div`
    font-size: 16px;
`;
