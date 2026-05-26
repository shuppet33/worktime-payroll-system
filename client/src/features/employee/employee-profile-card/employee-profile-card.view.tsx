import { Avatar } from 'antd';

import {
    AvatarCircle,
    EmployeeName,
    InfoItem,
    ProfileCard,
    ProfileInfo,
    ProfileLeft,
    ProfileRight,
    SalaryDescription,
    SalaryTitle,
    SalaryValue,
} from './styles';

export const EmployeeProfileCard = () => {
    return (
        <ProfileCard>
            <ProfileLeft>
                <SalaryTitle>
                    К выплате
                </SalaryTitle>

                <SalaryValue>
                    72 500 ₽
                </SalaryValue>

                <SalaryDescription>
                    Выплачено 0
                    из 72 500 ₽
                </SalaryDescription>

                <ProfileInfo>
                    <InfoItem>
                        Frontend Developer
                    </InfoItem>

                    <InfoItem>
                        Почасовая ставка
                    </InfoItem>
                </ProfileInfo>
            </ProfileLeft>

            <ProfileRight>
                <AvatarCircle>
                    <Avatar size={90} />
                </AvatarCircle>

                <EmployeeName>
                    Иванов Иван
                </EmployeeName>
            </ProfileRight>
        </ProfileCard>
    );
};