import styled from "styled-components";

export const DetailsCard = styled(FloatingCard)`
    padding: 24px;

    min-height: 220px;
`;


export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 24px;
`;

export const DetailsDate = styled.div`
    font-size: 22px;
    font-weight: 600;
`;

export const HoursBadge = styled.div`
    padding: 8px 14px;

    border-radius: 14px;

    background: rgba(59, 130, 246, 0.14);

    border: 1px solid rgba(59, 130, 246, 0.3);

    color: #60a5fa;

    font-weight: 600;
`;

export const DescriptionCard = styled.div`
    padding: 18px;

    border-radius: 18px;

    background: rgba(255, 255, 255, 0.03);

    border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const DescriptionTitle = styled.div`
    margin-bottom: 10px;

    color: #64748b;

    font-size: 14px;
`;

export const DescriptionText = styled.div`
    font-size: 16px;
`;