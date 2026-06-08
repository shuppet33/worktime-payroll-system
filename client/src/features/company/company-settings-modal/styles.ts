import styled from 'styled-components'

type SettingsTheme = 'light' | 'dark'

export const SModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

export const SCompanyNameEditor = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
`

export const SAccessSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 14px;
`

export const SAccessHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`

export const SAccessTitle = styled.div`
    margin: 0;

    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
`

export const SAccessPanel = styled.div<{ $theme: SettingsTheme }>`
    overflow: hidden;

    border: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'};
    border-radius: 8px;
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(15, 23, 42, 0.72)' : '#ffffff'};
    box-shadow: ${({ $theme }) =>
        $theme === 'dark'
            ? '0 10px 32px rgba(0, 0, 0, 0.22)'
            : '0 6px 20px rgba(15, 23, 42, 0.06)'};
`

export const SAccessToolbar = styled.div<{ $theme: SettingsTheme }>`
    padding: 14px 16px;

    display: grid;
    grid-template-columns: 1fr minmax(220px, 280px);
    gap: 12px;
    align-items: center;

    border-bottom: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'};

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
`

export const SSelectAll = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 10px;

    font-size: 16px;
    font-weight: 600;
`

export const SInvitedList = styled.div`
    display: flex;
    flex-direction: column;
`

export const SInvitedUserRow = styled.div<{ $theme: SettingsTheme }>`
    min-height: 40px;
    padding: 14px;

    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr) 180px auto;
    gap: 14px;
    align-items: center;

    color: ${({ $theme }) => ($theme === 'dark' ? '#ffffff' : '#0f172a')};

    & + & {
        border-top: 1px solid
            ${({ $theme }) =>
                $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9'};
    }

    @media (max-width: 520px) {
        grid-template-columns: auto auto 1fr;
    }
`

export const SInvitedUserInfo = styled.div`
    min-width: 0;
`

export const SInvitedUserName = styled.div`
    overflow: hidden;

    color: #1677ff;
    font-size: 16px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const SInvitedUserRole = styled.div<{ $theme: SettingsTheme }>`
    overflow: hidden;

    margin-top: 4px;

    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const SRoleSelectWrapper = styled.div`
    min-width: 0;

    .ant-select {
        width: 100%;
    }

    @media (max-width: 520px) {
        grid-column: 2 / 4;
    }
`

export const SDeleteInviteButton = styled.button<{ $theme: SettingsTheme }>`
    width: 40px;
    height: 40px;

    display: grid;
    place-items: center;

    border: 1px solid
        ${({ $theme }) =>
            $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'};
    border-radius: 8px;
    background: ${({ $theme }) =>
        $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f8fafc'};
    color: #ff4d4f;
    cursor: pointer;
    font-size: 18px;

    &:hover,
    &:focus-visible {
        outline: none;
        background: #fff1f0;
    }

    @media (max-width: 520px) {
        grid-column: 3;
        justify-self: end;
    }
`

export const SEmptyAccessText = styled.div<{ $theme: SettingsTheme }>`
    padding: 22px 16px;

    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
`
