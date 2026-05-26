import { Button } from 'antd';

import { reatomComponent } from '@reatom/npm-react';

import { paymentTypeAtom } from '$pages/employee/employee.model';

import {
    CardHeader,
    DescriptionCard,
    DescriptionText,
    DescriptionTitle,
    DetailsCard,
    DetailsDate,
    HoursBadge,
} from './styles';

interface Props {
    selectedDay: number;

    dayData?: {
        day: number;
        worked?: boolean;
        hours?: string;
        reason?: string;
        description?: string;
    };
}

export const EmployeeDetailsCard =
    reatomComponent<Props>(
        ({
             ctx,
             selectedDay,
             dayData,
         }) => {
            const paymentType =
                ctx.spy(
                    paymentTypeAtom,
                );

            const worked =
                dayData?.worked ?? true;

            return (
                <DetailsCard>
                    <CardHeader>
                        <DetailsDate>
                            {selectedDay}{' '}
                            мая 2026
                        </DetailsDate>

                        {paymentType ===
                            'hourly' && (
                                <HoursBadge>
                                    {dayData?.hours ||
                                        '0ч'}
                                </HoursBadge>
                            )}
                    </CardHeader>

                    <DescriptionCard>
                        <DescriptionTitle>
                            {paymentType ===
                            'hourly'
                                ? 'Описание'
                                : 'Статус'}
                        </DescriptionTitle>

                        <DescriptionText>
                            {paymentType ===
                            'hourly'
                                ? dayData?.description
                                : worked
                                    ? 'Рабочий день'
                                    : dayData?.reason}
                        </DescriptionText>
                    </DescriptionCard>

                    {paymentType ===
                        'fixed' &&
                        worked && (
                            <Button
                                type="primary"
                                block
                                style={{
                                    marginTop:
                                        16,
                                }}
                            >
                                Не работал
                                в этот
                                день
                            </Button>
                        )}
                </DetailsCard>
            );
        },
    );