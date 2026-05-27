import styled from "styled-components";

export const SPage = styled.div`
    min-height: 100vh;

    background: #0f172a;

    color: white;

    display: flex;
    flex-direction: column;
`;

export const SContent = styled.main`
    flex: 1;

    padding: 28px 32px;
`;

export const SRateType = styled.div`
    margin-bottom: 24px;

    color: #94a3b8;

    strong {
        color: white;
    }
`;

export const SMainGrid = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 20px;
`;

export const SRightColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;