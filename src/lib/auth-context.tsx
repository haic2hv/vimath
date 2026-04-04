'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    tokenBalance: number;
    refreshTokenBalance: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [tokenBalance, setTokenBalance] = useState(0);

    const fetchTokenBalance = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('Profile')
                .select('tokenBalance')
                .eq('userId', userId)
                .single();

            if (data && !error) {
                setTokenBalance(data.tokenBalance || 0);
            }
        } catch {
            setTokenBalance(0);
        }
    }, []);

    const refreshTokenBalance = useCallback(async () => {
        if (user) {
            await fetchTokenBalance(user.id);
        }
    }, [user, fetchTokenBalance]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                ensureProfile(session.user);
                fetchTokenBalance(session.user.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                ensureProfile(session.user);
                fetchTokenBalance(session.user.id);
            } else {
                setTokenBalance(0);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchTokenBalance]);

    async function ensureProfile(authUser: User) {
        try {
            const { data } = await supabase
                .from('Profile')
                .select('id')
                .eq('userId', authUser.id)
                .single();

            if (!data) {
                await supabase.from('Profile').insert({
                    userId: authUser.id,
                    email: authUser.email || '',
                    tokenBalance: 0,
                    role: 'user',
                });
            }
        } catch {
            // Profile might already exist
        }
    }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined'
                    ? window.location.origin
                    : undefined,
            },
        });
    }

    async function signOut() {
        await supabase.auth.signOut();
        setTokenBalance(0);
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, tokenBalance, refreshTokenBalance, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
