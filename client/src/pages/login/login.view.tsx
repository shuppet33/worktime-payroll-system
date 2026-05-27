import {Button, Input,} from 'antd';
import {ArrowLeftOutlined, LockOutlined, TeamOutlined, UserOutlined,} from '@ant-design/icons';

import {reatomComponent} from '@reatom/npm-react';

import {useNavigate} from 'react-router'

import {loginAtom, passwordAtom, roleAtom, stepAtom,} from './login.model';
import {
    SActions,
    SBackButton,
    SLoginCard,
    SPage,
    SRoleCard,
    SRoleDescription,
    SRoles,
    SRoleTitle,
    SSubtitle,
    STitle,
} from './styles';

export const LoginPage = reatomComponent(({ctx}) => {
    const role = ctx.spy(roleAtom);
    const step = ctx.spy(stepAtom);

    const login = ctx.spy(loginAtom);
    const password = ctx.spy(passwordAtom);

    const navigate = useNavigate();

    const selectedRoleTitle =
        role === 'employee'
            ? 'Сотрудник'
            : 'Работодатель';

    const handleContinue = () => {
        if (!role) {
            return;
        }

        stepAtom(ctx, 'login');
    };

    const handleBack = () => {
        stepAtom(ctx, 'select-role');

        loginAtom(ctx, '');
        passwordAtom(ctx, '');
    };

    const handleSubmit = () => {
        console.log({
            role,
            login,
            password,
        });

        if (role === 'employee') {
            navigate('/employee');

            return;
        }

        navigate('/company');
    };

    return (
        <SPage>
            <SLoginCard>
                {step === 'select-role' && (
                    <>
                        <div>
                            <STitle>
                                Payroll System
                            </STitle>

                            <SSubtitle>
                                Система расчета заработной платы
                            </SSubtitle>
                        </div>

                        <SRoles>
                            <SRoleCard
                                active={role === 'employee'}
                                onClick={() =>
                                    roleAtom(ctx, 'employee')
                                }
                            >
                                <UserOutlined/>

                                <div>
                                    <SRoleTitle>
                                        Сотрудник
                                    </SRoleTitle>

                                    <SRoleDescription>
                                        Просмотр зарплаты
                                    </SRoleDescription>
                                </div>
                            </SRoleCard>

                            <SRoleCard
                                active={role === 'company'}
                                onClick={() =>
                                    roleAtom(ctx, 'company')
                                }
                            >
                                <TeamOutlined/>

                                <div>
                                    <SRoleTitle>
                                        Работодатель
                                    </SRoleTitle>

                                    <SRoleDescription>
                                        Управление компанией
                                    </SRoleDescription>
                                </div>
                            </SRoleCard>
                        </SRoles>

                        <SActions>
                            <Button
                                type="primary"
                                size="large"
                                block
                                disabled={!role}
                                onClick={handleContinue}
                            >
                                Вход
                            </Button>

                            <Button
                                size="large"
                                block
                            >
                                Зарегистрироваться
                            </Button>
                        </SActions>
                    </>
                )}

                {step === 'login' && (
                    <>
                        <SBackButton
                            type="text"
                            icon={<ArrowLeftOutlined/>}
                            onClick={handleBack}
                        />

                        <div>
                            <STitle>
                                Вход
                            </STitle>

                            <SSubtitle>
                                {selectedRoleTitle}
                            </SSubtitle>
                        </div>

                        <Input
                            size="large"
                            placeholder="Логин"
                            prefix={<UserOutlined/>}
                            value={login}
                            onChange={(e) =>
                                loginAtom(
                                    ctx,
                                    e.target.value,
                                )
                            }
                        />

                        <Input.Password
                            size="large"
                            placeholder="Пароль"
                            prefix={<LockOutlined/>}
                            value={password}
                            onChange={(e) =>
                                passwordAtom(
                                    ctx,
                                    e.target.value,
                                )
                            }
                        />

                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleSubmit}
                        >
                            Войти
                        </Button>
                    </>
                )}
            </SLoginCard>
        </SPage>
    );
});