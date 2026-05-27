import {Button, Card} from 'antd';

import styled from 'styled-components';

export const SPage = styled.div`
    width: 100%;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background: #f5f7fb;
`;

export const SLoginCard = styled(Card)`
    width: 520px;

    border-radius: 24px !important;

    .ant-card-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;

export const STitle = styled.h1`
    margin: 0;

    text-align: center;

    font-size: 32px;
`;

export const SSubtitle = styled.p`
    margin-top: 8px;

    text-align: center;

    color: #6b7280;
`;

export const SRoles = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const SRoleCard = styled.label<{ active: boolean }>`
    position: relative;

    padding: 20px;

    border-radius: 20px;

    border: 2px solid
        ${({ active }) =>
    active ? '#1677ff' : '#e5e7eb'};

    background:
        ${({ active }) =>
    active ? '#eff6ff' : 'white'};

    display: flex;
    align-items: center;
    gap: 16px;

    cursor: pointer;

    transition: 0.2s;

    &:hover {
        border-color: #1677ff;
    }

    .ant-radio-wrapper {
        display: none;
    }

    .ant-radio {
        display: none;
    }

    span[role='img'] {
        font-size: 28px;
        color: #1677ff;
    }
`;

export const SRoleTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
`;

export const SRoleDescription = styled.div`
    margin-top: 4px;

    color: #6b7280;

    font-size: 14px;
`;

export const SActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const SBackButton = styled(Button)`
    width: fit-content;

    padding: 0;
`;