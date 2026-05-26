import styled from 'styled-components';

export const CompanyPageWrapper =
    styled.div`
        min-height: 100vh;

        background: #0f172a;

        color: white;

        display: flex;
        flex-direction: column;
    `;


export const CompanyContent =
    styled.main`
        flex: 1;

        padding: 28px 32px;
    `;

export const PageTitle = styled.h1`
    margin-bottom: 24px;
`;

export const Filters = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    margin-bottom: 24px;

    flex-wrap: wrap;
`;

export const CompanyGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(260px, 1fr)
    );

    gap: 20px;
`;

export const SearchWrapper = styled.div`
    width: 240px;
`;