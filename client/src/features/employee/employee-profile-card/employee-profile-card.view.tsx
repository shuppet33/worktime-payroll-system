import { Avatar } from 'antd';

import {
    SAvatarCircle,
    SEmployeeName,
    SInfoItem,
    SProfileCard,
    SProfileInfo,
    SProfileLeft,
    SProfileRight,
    SSalaryDescription,
    SSalaryTitle,
    SSalaryValue,
} from './styles';

export const EmployeeProfileCard = () => {
    return (
        <SProfileCard>
            <SProfileLeft>
                <SSalaryTitle>
                    К выплате
                </SSalaryTitle>

                <SSalaryValue>
                    72 500 ₽
                </SSalaryValue>

                <SSalaryDescription>
                    Выплачено 0
                    из 72 500 ₽
                </SSalaryDescription>

                <SProfileInfo>
                    <SInfoItem>
                        Frontend Developer
                    </SInfoItem>

                    <SInfoItem>
                        Почасовая ставка
                    </SInfoItem>
                </SProfileInfo>
            </SProfileLeft>

            <SProfileRight>
                <SAvatarCircle>
                    <Avatar size={90} />
                </SAvatarCircle>

                <SEmployeeName>
                    Иванов Иван
                </SEmployeeName>
            </SProfileRight>
        </SProfileCard>
    );
};