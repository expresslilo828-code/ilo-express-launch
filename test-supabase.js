// Test Supabase Connection
// Open browser console and run this to test if Supabase is working

import { supabase } from './src/integrations/supabase/client';

console.log('🧪 Testing Supabase Connection...');

// Test 1: Simple query
supabase
    .from('admin_users')
    .select('count')
    .then(({ data, error }) => {
        if (error) {
            console.error('❌ Test FAILED:', error);
        } else {
            console.log('✅ Test PASSED - Supabase is working!', data);
        }
    });

// Test 2: Auth session
supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('❌ Session test FAILED:', error);
    } else {
        console.log('✅ Session test PASSED:', data.session ? 'Logged in' : 'Not logged in');
    }
});
