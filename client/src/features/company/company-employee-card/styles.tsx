import styled from 'styled-components'

type EmployeeCardTheme = 'light' | 'dark'

export const SEmployeeCard = styled.div<{ $theme: EmployeeCardTheme }>`
    padding: 20px;
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

export const SEmployeeName = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
`

export const SEmployeePosition = styled.div<{ $theme: EmployeeCardTheme }>`
    color: ${({ $theme }) => ($theme === 'dark' ? '#cbd5e1' : '#64748b')};
    margin-bottom: 8px;
`

export const SEmployeeType = styled.div`
    color: #1677ff;
`
