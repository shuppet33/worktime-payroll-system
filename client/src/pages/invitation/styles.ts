import { Typography } from 'antd'

import styled from 'styled-components'

export const SInvitationPage = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #f5f9ff;
    color: #0f172a;
`

export const SInvitationContent = styled.main`
    width: min(460px, 100%);
    display: flex;
    flex-direction: column;
    gap: 18px;
`

export const SInvitationTitle = styled(Typography.Title)`
    && {
        margin: 0;
    }
`

export const SInvitationText = styled(Typography.Text)`
    && {
        font-size: 18px;
    }
`

export const SInvitationStatus = styled.div`
    color: #0f172a;
`
