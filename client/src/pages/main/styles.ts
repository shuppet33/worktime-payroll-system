import styled from 'styled-components'

export const SPage = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f9ff;
`

export const SHeader = styled.header`
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    border-bottom: 1px solid #e6f4ff;
    background: #fff;
`

export const SLogo = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: #1677ff;
`

export const SHeaderActions = styled.div`
    display: flex;
    gap: 12px;
`

export const SContent = styled.main`
    flex: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;

    padding: 32px;
`

export const STitle = styled.h1`
    margin: 0;

    font-size: 72px;
    font-weight: 700;

    color: #0f172a;
`

export const SDescription = styled.p`
    max-width: 700px;

    margin-top: 24px;

    font-size: 20px;
    line-height: 1.6;

    color: #64748b;
`

export const SFooter = styled.footer`
    height: 56px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #fff;

    border-top: 1px solid #e6f4ff;

    color: #64748b;
`
