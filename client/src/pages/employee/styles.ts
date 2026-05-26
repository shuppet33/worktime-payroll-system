import styled from "styled-components";

export const Page = styled.div`
    min-height: 100vh;

    background: #0f172a;

    color: white;

    display: flex;
    flex-direction: column;
`;

export const Content = styled.main`
    flex: 1;

    padding: 28px 32px;
`;

export const RateType = styled.div`
    margin-bottom: 24px;

    color: #94a3b8;

    strong {
        color: white;
    }
`;

export const MainGrid = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 20px;
`;

export const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;