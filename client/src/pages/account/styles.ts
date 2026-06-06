import styled from 'styled-components'

export const SPage = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #ffffff;
`

export const SContent = styled.main`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #ffffff;
`

export const SEmptyState = styled.section`
    width: min(680px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`

export const SEmptyText = styled.p`
    max-width: 460px;
    margin: 0;
    color: #111827;
    font-size: 16px;
    line-height: 1.45;
`

export const SActions = styled.div`
    width: 100%;
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 248px));
    justify-content: center;
    gap: 104px;

    @media (max-width: 720px) {
        grid-template-columns: minmax(180px, 248px);
        gap: 16px;
    }
`

export const SModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`
