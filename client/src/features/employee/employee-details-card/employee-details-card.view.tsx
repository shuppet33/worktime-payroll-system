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
        hours: string;
        description: string;
    };
}

export const EmployeeDetailsCard = ({
                                        selectedDay,
                                        dayData,
                                    }: Props) => {
    return (
        <DetailsCard>
            <CardHeader>
                <DetailsDate>
                    {selectedDay} мая 2026
                </DetailsDate>

                <HoursBadge>
                    {dayData?.hours || '0ч'}
                </HoursBadge>
            </CardHeader>

            <DescriptionCard>
                <DescriptionTitle>
                    Описание
                </DescriptionTitle>

                <DescriptionText>
                    {dayData?.description ||
                        'Нет данных'}
                </DescriptionText>
            </DescriptionCard>
        </DetailsCard>
    );
};