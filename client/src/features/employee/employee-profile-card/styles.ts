import styled from "styled-components";

import {SFloatingCard} from "$shared/styles";

export const SProfileCard = styled(SFloatingCard)`
    padding: 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 24px;
`;

export const SProfileLeft = styled.div`
    flex: 1;
`;

export const SSalaryTitle = styled.div`
    margin-bottom: 8px;

    color: #94a3b8;
`;

export const SSalaryValue = styled.div`
    font-size: 42px;
    font-weight: 700;

    margin-bottom: 6px;
`;

export const SSalaryDescription = styled.div`
    margin-bottom: 24px;

    color: #64748b;
`;

export const SProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const SInfoItem = styled.div`
    padding: 14px 16px;

    border-radius: 14px;

    background: rgba(255, 255, 255, 0.04);

    border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const SProfileRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 16px;
`;

export const SAvatarCircle = styled.div`
    width: 120px;
    height: 120px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 255, 255, 0.05);

    border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SEmployeeName = styled.div`
    font-size: 18px;
    font-weight: 600;
`;
