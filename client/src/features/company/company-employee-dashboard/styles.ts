import styled from 'styled-components'

import type { AppTheme } from '$shared/theme.ts'

export const SEmployeeLayout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
    gap: 20px;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
    }
`

export const SSideColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

export const SPanel = styled.section<{ $theme: AppTheme }>`
    padding: 20px;
    border-radius: 8px;
    border: 1px solid
        ${({ $theme }) => ($theme === 'dark' ? '#334155' : '#dbeafe')};
    background: ${({ $theme }) => ($theme === 'dark' ? '#111827' : '#ffffff')};
`

export const SPanelTitle = styled.h2`
    margin: 0 0 14px;
    font-size: 22px;
`

export const SMetaList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const SMetaItem = styled.div<{ $theme: AppTheme }>`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    border-radius: 8px;
    background: ${({ $theme }) => ($theme === 'dark' ? '#0f172a' : '#f8fafc')};
`

export const SMetaLabel = styled.span`
    color: #64748b;
`

export const SMetaValue = styled.span`
    font-weight: 600;
    text-align: right;
`

export const SPlaceholderList = styled.div`
    display: grid;
    gap: 10px;
`

export const SPlaceholderItem = styled.div<{ $theme: AppTheme }>`
    padding: 14px;
    border-radius: 8px;
    color: #64748b;
    border: 1px dashed
        ${({ $theme }) => ($theme === 'dark' ? '#475569' : '#cbd5e1')};
`

export const SErrorText = styled.div`
    color: #ef4444;
`
