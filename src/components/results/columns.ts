import { Column } from '@/types/results';

export const initialColumns: Column[] = [
    {
        id: 'email',
        label: 'Email',
        accessor: (user) => user.$email,
        width: 250,
        minWidth: 150,
    },
    {
        id: 'name',
        label: 'Name',
        accessor: (user) => user.$name,
        width: 200,
        minWidth: 150,
    },
    {
        id: 'distinctId',
        label: 'Distinct ID',
        accessor: (user) => user.distinctId,
        width: 300,
        minWidth: 200,
    },
    {
        id: 'updated',
        label: 'Updated at',
        accessor: (user) => user.customAttributes.updated_at || user.$created,
        width: 150,
        minWidth: 120,
    },
    {
        id: 'country',
        label: 'Country Code',
        accessor: (user) => user.$country_code,
        width: 150,
        minWidth: 120,
    },
    {
        id: 'region',
        label: 'Region',
        accessor: (user) => user.$region,
        width: 150,
        minWidth: 120,
    },
    {
        id: 'city',
        label: 'City',
        accessor: (user) => user.$city,
        width: 150,
        minWidth: 120,
    },
];
