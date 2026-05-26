import styled from "styled-components";

import {FloatingCard} from "$entities/styles";

export const ProfileCard = styled(FloatingCard)`
    padding: 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 24px;
`;

export const ProfileLeft = styled.div`
    flex: 1;
`;

export const SalaryTitle = styled.div`
    margin-bottom: 8px;

    color: #94a3b8;
`;

export const SalaryValue = styled.div`
    font-size: 42px;
    font-weight: 700;

    margin-bottom: 6px;
`;

export const SalaryDescription = styled.div`
    margin-bottom: 24px;

    color: #64748b;
`;

export const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const InfoItem = styled.div`
    padding: 14px 16px;

    border-radius: 14px;

    background: rgba(255, 255, 255, 0.04);

    border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ProfileRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 16px;
`;

export const AvatarCircle = styled.div`
    width: 120px;
    height: 120px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 255, 255, 0.05);

    border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const EmployeeName = styled.div`
    font-size: 18px;
    font-weight: 600;
`;