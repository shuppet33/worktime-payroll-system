import { Alert, Button, Input, Modal } from 'antd'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'

import { reatomComponent } from '@reatom/npm-react'

import {
    deleteAsync,
    updateNameAsync,
} from '$features/company/company.service.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

import {
    closeSettingsModalAction,
    companyNameDraftAtom,
    companyNameEditingAtom,
    deleteCompanyModalOpenAtom,
    settingsModalOpenAtom,
} from '../company-settings-modal.reatom.ts'

import { AccessSection } from './access-section.view.tsx'
import { SCompanyNameEditor, SModalContent } from './styles.ts'

export const CompanySettingsModal = reatomComponent(({ ctx }) => {
    const companyId = ctx.spy(selectedCompanyIdAtom)
    const companyNameDraft = ctx.spy(companyNameDraftAtom)
    const editing = ctx.spy(companyNameEditingAtom)
    const open = ctx.spy(settingsModalOpenAtom)
    const { isPending: loading, isRejected: showError } = ctx.spy(
        updateNameAsync.statusesAtom,
    )
    const error = ctx.spy(updateNameAsync.errorAtom)

    const handleClose = () => {
        updateNameAsync.errorAtom.reset(ctx)
        deleteAsync.errorAtom.reset(ctx)
        closeSettingsModalAction(ctx)
    }

    const handleSubmit = async () => {
        if (!companyId) {
            return
        }

        try {
            updateNameAsync.errorAtom.reset(ctx)
            await updateNameAsync(ctx, companyId)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            title="Настройки компании"
            open={open}
            footer={null}
            width={860}
            onCancel={handleClose}
        >
            <SModalContent>
                {showError && error && (
                    <Alert type="error" title={error.message} />
                )}

                <SCompanyNameEditor>
                    <Input
                        size="large"
                        disabled={!editing}
                        value={companyNameDraft}
                        onChange={(event) =>
                            companyNameDraftAtom(ctx, event.target.value)
                        }
                        onPressEnter={() => {
                            if (editing) {
                                handleSubmit()
                            }
                        }}
                    />

                    <Button
                        size="large"
                        type={editing ? 'primary' : 'default'}
                        icon={editing ? <CheckOutlined /> : <EditOutlined />}
                        loading={loading}
                        onClick={
                            editing
                                ? handleSubmit
                                : () => companyNameEditingAtom(ctx, true)
                        }
                    />
                </SCompanyNameEditor>

                <AccessSection />

                <Button
                    danger
                    block
                    size="large"
                    onClick={() => {
                        deleteAsync.errorAtom.reset(ctx)
                        deleteCompanyModalOpenAtom(ctx, true)
                    }}
                >
                    Удалить компанию
                </Button>
            </SModalContent>
        </Modal>
    )
})
