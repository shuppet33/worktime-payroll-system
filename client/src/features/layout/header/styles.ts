import styled from "styled-components";

export const Header = styled.header`
    height: 80px;

    padding: 0 32px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    background: rgba(15, 23, 42, 0.7);

    backdrop-filter: blur(12px);
`;

export const Logo = styled.div`
    font-size: 22px;
    font-weight: 700;
`;
