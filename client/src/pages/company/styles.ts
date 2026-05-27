import styled from 'styled-components';

export const SCompanyPageWrapper =
    styled.div`
        min-height: 100vh;

        background: #0f172a;

        color: white;

        display: flex;
        flex-direction: column;
    `;


export const SCompanyContent =
    styled.main`
        flex: 1;

        padding: 28px 32px;
    `;

export const SPageTitle = styled.h1`
    margin-bottom: 24px;
`;

export const SFilters = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    margin-bottom: 24px;

    flex-wrap: wrap;
`;

export const SCompanyGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(260px, 1fr)
    );

    gap: 20px;
`;

export const SSearchWrapper = styled.div`
    width: 240px;
`;