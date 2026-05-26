import {Button, Input,} from 'antd';
import {ArrowLeftOutlined, LockOutlined, TeamOutlined, UserOutlined,} from '@ant-design/icons';

import {reatomComponent} from '@reatom/npm-react';

import {useNavigate} from 'react-router'

import {loginAtom, passwordAtom, roleAtom, stepAtom,} from './login.model';
import {
    Actions,
    BackButton,
    LoginCard,
    Page,
    RoleCard,
    RoleDescription,
    Roles,
    RoleTitle,
    Subtitle,
    Title,
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
        <Page>
            <LoginCard>
                {step === 'select-role' && (
                    <>
                        <div>
                            <Title>
                                Payroll System
                            </Title>

                            <Subtitle>
                                Система расчета заработной платы
                            </Subtitle>
                        </div>

                        <Roles>
                            <RoleCard
                                active={role === 'employee'}
                                onClick={() =>
                                    roleAtom(ctx, 'employee')
                                }
                            >
                                <UserOutlined/>

                                <div>
                                    <RoleTitle>
                                        Сотрудник
                                    </RoleTitle>

                                    <RoleDescription>
                                        Просмотр зарплаты
                                    </RoleDescription>
                                </div>
                            </RoleCard>

                            <RoleCard
                                active={role === 'company'}
                                onClick={() =>
                                    roleAtom(ctx, 'company')
                                }
                            >
                                <TeamOutlined/>

                                <div>
                                    <RoleTitle>
                                        Работодатель
                                    </RoleTitle>

                                    <RoleDescription>
                                        Управление компанией
                                    </RoleDescription>
                                </div>
                            </RoleCard>
                        </Roles>

                        <Actions>
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
                        </Actions>
                    </>
                )}

                {step === 'login' && (
                    <>
                        <BackButton
                            type="text"
                            icon={<ArrowLeftOutlined/>}
                            onClick={handleBack}
                        />

                        <div>
                            <Title>
                                Вход
                            </Title>

                            <Subtitle>
                                {selectedRoleTitle}
                            </Subtitle>
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
            </LoginCard>
        </Page>
    );
});