import { Column } from '@/types/results';

export const allColumnDefinitions: Column[] = [
    // ===== VISIBLE BY DEFAULT =====
    {
        id: 'connected-accounts',
        label: 'Connected Account',
        accessor: (user) => String(user.customAttributes?.connected_accounts ?? ''),
        width: 150,
        minWidth: 120,
    },
    {
        id: 'created',
        label: 'Created',
        accessor: (user) => user.$created,
        width: 150,
        minWidth: 120,
    },
    {
        id: 'first-seen',
        label: 'First Seen',
        accessor: (user) => user.$created, // Assuming same as created for now, or custom attr
        width: 150,
        minWidth: 120,
    },
    {
        id: 'age',
        label: 'Age',
        accessor: (user) => String(user.customAttributes?.age ?? ''),
        width: 100,
        minWidth: 80,
    },
    {
        id: 'credit-score',
        label: 'Credit Score',
        accessor: (user) => String(user.customAttributes?.credit_score ?? ''),
        width: 120,
        minWidth: 100,
    },
    {
        id: 'net-worth',
        label: 'Net worth',
        accessor: (user) => {
            const val = user.customAttributes?.net_worth_usd;
            return val ? `$${Number(val).toLocaleString()}` : '';
        },
        width: 150,
        minWidth: 120,
    },
    {
        id: 'products',
        label: 'Products',
        accessor: (user) => {
            const products = user.customAttributes?.products;
            return Array.isArray(products) ? products.join(', ') : products;
        },
        width: 200,
        minWidth: 150,
    },

    // ===== HIDDEN BY DEFAULT =====
    {
        id: 'name',
        label: 'Name',
        accessor: (user) => user.$name,
        width: 200,
        minWidth: 150,
    },
    {
        id: 'email',
        label: 'Email',
        accessor: (user) => user.$email,
        width: 250,
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
        width: 120,
        minWidth: 100,
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
    {
        id: 'avatar-url',
        label: 'Avatar URL',
        accessor: (user) => user.$avatar,
        width: 200,
        minWidth: 150,
    },
    {
        id: 'geo-source',
        label: 'Geo Source',
        accessor: (user) => user.customAttributes?.geo_source,
        width: 150,
        minWidth: 120,
    },
    {
        id: 'operating-system',
        label: 'Operating System',
        accessor: (user) => user.$os,
        width: 150,
        minWidth: 120,
    },
];

export const defaultVisibleColumnIds = [
    'email',
    'name',
    'distinctId',
    'updated',
    'country',
    'region',
    'city',
];

export const initialColumns: Column[] = allColumnDefinitions.filter(col =>
    defaultVisibleColumnIds.includes(col.id)
);
