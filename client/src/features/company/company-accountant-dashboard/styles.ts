import styled from 'styled-components'

import type { AppTheme } from '$shared/theme.ts'

export const SAccountantLayout = styled.div`
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 20px;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
    }
`

export const SSummaryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`

export const SSummaryCard = styled.section<{ $theme: AppTheme }>`
    padding: 18px;
    border-radius: 8px;
    border: 1px solid
        ${({ $theme }) => ($theme === 'dark' ? '#334155' : '#dbeafe')};
    background: ${({ $theme }) => ($theme === 'dark' ? '#111827' : '#ffffff')};
`

export const SSummaryLabel = styled.div`
    color: #64748b;
    font-size: 14px;
    margin-bottom: 8px;
`

export const SSummaryValue = styled.div`
    font-size: 22px;
    font-weight: 700;
`

export const SSectionHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

export const SSectionTitle = styled.h2`
    margin: 0;
    font-size: 22px;
`

export const SSectionHint = styled.div`
    color: #64748b;
`

export const SEmployeeList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const SEmployeeButton = styled.button<{
    $active: boolean
    $theme: AppTheme
}>`
    width: 100%;
    padding: 12px;
    text-align: left;
    border-radius: 8px;
    border: 1px solid
        ${({ $active }) => ($active ? '#3b82f6' : 'transparent')};
    background: ${({ $active, $theme }) =>
        $active
            ? 'rgba(59, 130, 246, 0.14)'
            : $theme === 'dark'
              ? '#0f172a'
              : '#f8fafc'};
    color: inherit;
    cursor: pointer;
`

export const SEmployeeName = styled.div`
    font-weight: 700;
`

export const SEmployeeMeta = styled.div`
    margin-top: 4px;
    color: #64748b;
    font-size: 13px;
`

export const SWorkspace = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

export const SFormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(120px, 1fr));
    gap: 12px;
    align-items: end;

    @media (max-width: 1100px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`

export const SList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const SListItem = styled.div<{ $theme: AppTheme }>`
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    background: ${({ $theme }) => ($theme === 'dark' ? '#0f172a' : '#f8fafc')};
`

export const SListTitle = styled.div`
    font-weight: 700;
`

export const SListMeta = styled.div`
    margin-top: 4px;
    color: #64748b;
    font-size: 13px;
`
