import styled from "styled-components";

export const FloatingCard = styled.div`
    background: rgba(15, 23, 42, 0.65);

    border: 1px solid rgba(255, 255, 255, 0.08);

    border-radius: 28px;

    backdrop-filter: blur(12px);

    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

    transition: transform 0.2s ease,
    border-color 0.2s ease;

    &:hover {
        transform: translateY(-2px);

        border-color: rgba(
                255,
                255,
                255,
                0.16
        );
    }
`;