import { Alert, Button, Input, Modal } from 'antd'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'

import { SCompanyNameEditor, SModalContent } from './styles'

type Props = {
    companyNameDraft: string
    editing: boolean
    error?: Error
    loading: boolean
    open: boolean
    showError: boolean
    onClose: () => void
    onDeleteCompany: () => void
    onDraftChange: (value: string) => void
    onEdit: () => void
    onSubmit: () => void
}

export const CompanySettingsModal = ({
    companyNameDraft,
    editing,
    error,
    loading,
    open,
    showError,
    onClose,
    onDeleteCompany,
    onDraftChange,
    onEdit,
    onSubmit,
}: Props) => {
    return (
        <Modal
            title="Настройки компании"
            open={open}
            footer={null}
            onCancel={onClose}
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
                        onChange={(event) => onDraftChange(event.target.value)}
                        onPressEnter={() => {
                            if (editing) {
                                onSubmit()
                            }
                        }}
                    />

                    <Button
                        size="large"
                        type={editing ? 'primary' : 'default'}
                        icon={editing ? <CheckOutlined /> : <EditOutlined />}
                        loading={loading}
                        onClick={editing ? onSubmit : onEdit}
                    />
                </SCompanyNameEditor>

                <Button danger block size="large" onClick={onDeleteCompany}>
                    Удалить компанию
                </Button>
            </SModalContent>
        </Modal>
    )
}
