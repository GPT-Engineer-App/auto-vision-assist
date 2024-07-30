import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### diagnostic_trouble_codes

| name            | type    | format | required |
|-----------------|---------|--------|----------|
| dtc_code        | varchar | string | true     |
| description     | text    | string | false    |
| possible_causes | text    | string | false    |
| causes          | text    | string | false    |
| diagnostic_aids | text    | string | false    |
| application     | text    | string | false    |

*/

// Hooks for diagnostic_trouble_codes table

export const useDiagnosticTroubleCodes = () => useQuery({
    queryKey: ['diagnostic_trouble_codes'],
    queryFn: () => fromSupabase(supabase.from('diagnostic_trouble_codes').select('*')),
});

export const useDiagnosticTroubleCode = (dtc_code) => useQuery({
    queryKey: ['diagnostic_trouble_codes', dtc_code],
    queryFn: () => fromSupabase(supabase.from('diagnostic_trouble_codes').select('*').eq('dtc_code', dtc_code).single()),
    enabled: !!dtc_code,
});

export const useAddDiagnosticTroubleCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCode) => fromSupabase(supabase.from('diagnostic_trouble_codes').insert([newCode])),
        onSuccess: () => {
            queryClient.invalidateQueries(['diagnostic_trouble_codes']);
        },
    });
};

export const useUpdateDiagnosticTroubleCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dtc_code, ...updates }) => fromSupabase(supabase.from('diagnostic_trouble_codes').update(updates).eq('dtc_code', dtc_code)),
        onSuccess: (_, { dtc_code }) => {
            queryClient.invalidateQueries(['diagnostic_trouble_codes']);
            queryClient.invalidateQueries(['diagnostic_trouble_codes', dtc_code]);
        },
    });
};

export const useDeleteDiagnosticTroubleCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dtc_code) => fromSupabase(supabase.from('diagnostic_trouble_codes').delete().eq('dtc_code', dtc_code)),
        onSuccess: () => {
            queryClient.invalidateQueries(['diagnostic_trouble_codes']);
        },
    });
};