import { Button } from 'antd';

import type { PaymentType, WorkDay } from '$entities/work-day';

import {
    SCardHeader,
    SDescriptionCard,
    SDescriptionText,
    SDescriptionTitle,
    SDetailsCard,
    SDetailsDate,
    SHoursBadge,
} from './styles';

type Props = {
    selectedDay: number;
    paymentType: PaymentType;

    dayData?: WorkDay;
}

export const EmployeeDetailsCard =
    ({
        selectedDay,
        paymentType,
        dayData,
    }: Props) => {
        const worked =
            dayData?.worked ?? true;

        return (
            <SDetailsCard>
                    <SCardHeader>
                        <SDetailsDate>
                            {selectedDay}{' '}
                            мая 2026
                        </SDetailsDate>

                        {paymentType ===
                            'hourly' && (
                                <SHoursBadge>
                                    {dayData?.hours ||
                                        '0ч'}
                                </SHoursBadge>
                            )}
                    </SCardHeader>

                    <SDescriptionCard>
                        <SDescriptionTitle>
                            {paymentType ===
                            'hourly'
                                ? 'Описание'
                                : 'Статус'}
                        </SDescriptionTitle>

                        <SDescriptionText>
                            {paymentType ===
                            'hourly'
                                ? dayData?.description
                                : worked
                                    ? 'Рабочий день'
                                    : dayData?.reason}
                        </SDescriptionText>
                    </SDescriptionCard>

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
            </SDetailsCard>
        );
    };
