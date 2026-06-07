import styled from 'styled-components'

type HeaderVariant = 'dark' | 'light'

export const SHeader = styled.header<{ $variant: HeaderVariant }>`
    flex: 0 0 72px;
    height: 72px;
    padding: 0 48px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid
        ${({ $variant }) =>
            $variant === 'light' ? '#e6f4ff' : 'rgba(255, 255, 255, 0.08)'};

    background: ${({ $variant }) =>
        $variant === 'light' ? '#ffffff' : 'rgba(15, 23, 42, 0.7)'};
    color: ${({ $variant }) => ($variant === 'light' ? '#0f172a' : '#ffffff')};

    ${({ $variant }) =>
        $variant === 'dark' &&
        `
            backdrop-filter: blur(12px);
        `}
`

export const SLogo = styled.div<{ $variant: HeaderVariant }>`
    font-size: 22px;
    font-weight: 700;
    color: ${({ $variant }) => ($variant === 'light' ? '#1677ff' : '#ffffff')};
`

export const SHeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    .ant-btn,
    .ant-switch {
        flex: 0 0 auto;
    }
`
