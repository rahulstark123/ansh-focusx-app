import { apiFetch } from './api';
import { storageMultiRemove, storageSetItem } from './storage';
import { supabase } from './supabase';

export async function syncSupabaseSessionToBackend({ fullName, accessToken: accessTokenOverride } = {}) {
  let accessToken = accessTokenOverride;
  if (!accessToken) {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    accessToken = data?.session?.access_token;
  }
  if (!accessToken) {
    throw new Error('missing_session');
  }

  const user = await apiFetch('/auth/supabase-sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fullName ? JSON.stringify({ fullName }) : undefined,
  });

  await storageSetItem('fx_user_id', user.id);
  await storageSetItem('fx_user_name', user.fullName || 'USER');
  return user;
}

export async function clearAppSession() {
  await storageMultiRemove(['fx_user_id', 'fx_user_name']);
}
