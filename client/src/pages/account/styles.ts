import { Layout } from 'antd'

import styled from 'styled-components'

export const SPage = styled(Layout)`
    min-height: 100vh;
    background: #ffffff;
`

export const SSidebar = styled(Layout.Sider)`
    background: #d9d9d9 !important;
    border-right: 1px solid #cfcfcf;
`

export const SSidebarInner = styled.div`
    height: 100%;
    padding: 16px 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const SSidebarToggle = styled.div`
    display: flex;
    justify-content: flex-end;
`

export const SProfileItem = styled.button<{ $collapsed: boolean }>`
    width: 100%;
    min-height: 40px;
    border: 0;
    padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 12px')};
    display: flex;
    align-items: center;
    justify-content: ${({ $collapsed }) =>
        $collapsed ? 'center' : 'flex-start'};
    gap: 10px;
    background: transparent;
    color: #111827;
    font: inherit;
    cursor: pointer;
`

export const SProfileIcon = styled.span`
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    border-radius: 50%;
    background: #5bb7c8;
`

export const SContent = styled(Layout.Content)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #ffffff;
`

export const SEmptyState = styled.section`
    width: min(680px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`

export const SEmptyText = styled.p`
    max-width: 460px;
    margin: 0;
    color: #111827;
    font-size: 16px;
    line-height: 1.45;
`

export const SActions = styled.div`
    width: 100%;
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 248px));
    justify-content: center;
    gap: 104px;

    @media (max-width: 720px) {
        grid-template-columns: minmax(180px, 248px);
        gap: 16px;
    }
`

export const SModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`
