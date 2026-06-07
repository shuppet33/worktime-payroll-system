import styled from 'styled-components'

export const SCompanyGrid = styled.div`
    flex: 1;
    min-height: 0;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    align-content: start;

    gap: 20px;

    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 10px 4px 0 0;
`
