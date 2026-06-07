import styled from 'styled-components'

type CompanyTheme = 'light' | 'dark'

export const SCompanyPageWrapper = styled.div<{ $theme: CompanyTheme }>`
    min-height: 100vh;

    background: ${({ $theme }) => ($theme === 'dark' ? '#0f172a' : '#f5f9ff')};

    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#0f172a')};

    display: flex;
    flex-direction: column;
`

export const SCompanyContent = styled.main`
    flex: 1;

    padding: 28px 32px;
`

export const SPageTitle = styled.h1`
    margin: 0;
`

export const SCompanyHeader = styled.div`
    margin-bottom: 24px;
`

export const SCompanyRole = styled.div`
    margin-top: 8px;
    color: #64748b;
`

export const SFilters = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    margin-bottom: 24px;

    flex-wrap: wrap;
`

export const SFilterActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const SSearchWrapper = styled.div`
    width: 240px;
`
