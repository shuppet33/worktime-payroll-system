import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { SHeader, SLogo } from './styles';

export const Header = () => {
    return (
        <SHeader>
            <SLogo>
                Payroll System
            </SLogo>

            <Button
                icon={<LogoutOutlined />}
            >
                Выйти
            </Button>
        </SHeader>
    );
};
