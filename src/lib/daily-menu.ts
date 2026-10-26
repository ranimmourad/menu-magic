import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DailyItem = { id: string; name: string; description: string | null; price: number; position: number };

export const dailyMenuQuery = queryOptions({
  queryKey: ['daily-menu'],
  queryFn: async (): Promise<DailyItem[]> => {
    const { data, error } = await supabase
      .from('daily_menu_items')
      .select('id, name, description, price, position')
      .order('position')
      .order('created_at');
    if (error) throw error;
    return (data ?? []).map(d => ({ ...d, price: Number(d.price) }));
  },
});
