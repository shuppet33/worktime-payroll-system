import {Button} from "antd";
import {LogoutOutlined} from "@ant-design/icons";

import {Header as SHeader, Logo} from './styles.ts'

export const Header = () => {
    return(
        <SHeader>
            <Logo>
                Payroll System
            </Logo>

            <Button
                icon={<LogoutOutlined/>}
            >
                Выйти
            </Button>
        </SHeader>

    )
}