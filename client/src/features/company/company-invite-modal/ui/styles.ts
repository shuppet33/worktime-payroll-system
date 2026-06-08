import styled from 'styled-components'

type InviteTheme = 'light' | 'dark'

export const SInviteContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const SSearchBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const SSearchLabel = styled.label<{ $theme: InviteTheme }>`
    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#0f172a')};
    font-size: 16px;
    line-height: 1.35;
    font-weight: 600;
`

export const SSearchInputWrapper = styled.div<{ $theme: InviteTheme }>`
    .ant-input-affix-wrapper {
        height: 44px;
    }

    .ant-input {
        font-size: 16px;
    }

    .ant-input-prefix {
        color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
        font-size: 18px;
    }
`

export const SResultsPanel = styled.div<{ $theme: InviteTheme }>`
    overflow: hidden;

    border: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'};
    border-radius: 8px;
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(15, 23, 42, 0.72)' : '#ffffff'};
    box-shadow: ${({ $theme }) =>
        $theme === 'dark'
            ? '0 10px 32px rgba(0, 0, 0, 0.22)'
            : '0 6px 20px rgba(15, 23, 42, 0.06)'};
`

export const SResultButton = styled.button<{ $theme: InviteTheme }>`
    width: 100%;
    height: 76px;
    padding: 14px 16px;

    display: grid;
    grid-template-columns: auto 1fr;
    gap: 18px;
    align-items: center;

    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;

    &:hover,
    &:focus-visible {
        outline: none;
        background: ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc'};
    }
`

export const SUserAvatar = styled.div<{ $color: string }>`
    width: 44px;
    height: 44px;

    display: grid;
    place-items: center;

    border: 2px solid #ffffff;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
`

export const SUserInfo = styled.div`
    min-width: 0;
`

export const SUserName = styled.div<{ $theme: InviteTheme }>`
    overflow: hidden;

    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#0f172a')};
    font-size: 16px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const SUserMeta = styled.div<{ $theme: InviteTheme }>`
    overflow: hidden;

    margin-top: 4px;

    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const SSelectedUser = styled.div<{ $theme: InviteTheme }>`
    min-height: 86px;
    padding: 18px 20px;

    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 18px;
    align-items: center;

    border: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(22, 119, 255, 0.56)' : '#91caff'};
    border-radius: 8px;
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(22, 119, 255, 0.14)' : '#e6f4ff'};
`

export const SClearSelectedButton = styled.button`
    width: 36px;
    height: 36px;

    display: grid;
    place-items: center;

    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #1677ff;
    cursor: pointer;
    font-size: 20px;

    &:hover,
    &:focus-visible {
        outline: none;
        background: rgb(22 119 255 / 10%);
    }
`

export const SStatusText = styled.div<{ $theme: InviteTheme }>`
    padding: 28px;

    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
    font-size: 16px;
`

export const SActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    .ant-btn {
        min-width: 100px;
    }
`
