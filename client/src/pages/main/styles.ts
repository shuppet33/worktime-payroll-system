import styled from 'styled-components'

type MainTheme = 'light' | 'dark'

export const SPage = styled.div<{ $theme: MainTheme }>`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: ${({ $theme }) =>
        $theme === 'dark' ? '#0f172a' : '#f5f9ff'};
    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#0f172a')};
`

export const SHeader = styled.header<{ $theme: MainTheme }>`
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    border-bottom: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e6f4ff'};
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : '#ffffff'};

    ${({ $theme }) =>
        $theme === 'dark' &&
        `
            backdrop-filter: blur(12px);
        `}
`

export const SLogo = styled.div<{ $theme: MainTheme }>`
    font-size: 22px;
    font-weight: 700;
    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#1677ff')};
`

export const SHeaderActions = styled.div`
    display: flex;
    align-items: center;
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
`

export const SDescription = styled.p<{ $theme: MainTheme }>`
    max-width: 700px;

    margin-top: 24px;

    font-size: 20px;
    line-height: 1.6;

    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
`

export const SFooter = styled.footer<{ $theme: MainTheme }>`
    height: 56px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : '#ffffff'};

    border-top: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e6f4ff'};

    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
`
