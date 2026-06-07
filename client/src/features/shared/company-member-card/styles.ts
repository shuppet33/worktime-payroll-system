import styled from 'styled-components'

type MemberCardTheme = 'light' | 'dark'

export const SMemberCard = styled.div<{ $theme: MemberCardTheme }>`
    position: relative;
    padding: 20px;
    padding-right: 48px;
    min-height: 132px;
    border: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'};
    border-radius: 8px;
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(15, 23, 42, 0.72)' : '#ffffff'};
    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#0f172a')};
    cursor: pointer;
    box-shadow: ${({ $theme }) =>
        $theme === 'dark'
            ? '0 10px 32px rgba(0, 0, 0, 0.22)'
            : '0 6px 20px rgba(15, 23, 42, 0.06)'};
    transition:
        transform 0.2s ease,
        background-color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-6px);
        border-color: #1677ff;
        box-shadow: 0 12px 28px rgba(22, 119, 255, 0.16);
    }
`

export const SMemberDeleteButton = styled.button<{
    $theme: MemberCardTheme
}>`
    position: absolute;
    top: 10px;
    right: 10px;

    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc'};
    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    transition:
        color 0.2s ease,
        background-color 0.2s ease;

    &:hover {
        background: #fff1f0;
        color: #ff4d4f;
    }
`

export const SMemberLogin = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
`

export const SMemberMeta = styled.div<{ $theme: MemberCardTheme }>`
    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
    margin-bottom: 8px;
`

export const SMemberRole = styled.div`
    color: #1677ff;
`
