export type PaymentType =
    | 'hourly'
    | 'fixed';

export type WorkDay = {
    day: number;
    worked?: boolean;
    hours?: string;
    reason?: string;
    description?: string;
}

export type HourlyWorkDay = WorkDay & {
    hours: string;
    description: string;
};

export type FixedWorkDay = WorkDay & {
    worked: boolean;
};
