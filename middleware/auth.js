import { firebase } from '@/lib/firebase';
import { waitForAuth } from '@/lib/auth';
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;
  try {
    const user = await waitForAuth(firebase.auth());
    if (!user) return navigateTo('/login');
  } catch {
    return navigateTo('/login?reason=verification');
  }
});
