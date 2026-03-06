'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isPremium: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                ensureProfile(session.user);
                checkPremiumStatus(session.user.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                ensureProfile(session.user);
                checkPremiumStatus(session.user.id);
            } else {
                setIsPremium(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

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
                    isPremium: false,
                    role: 'user',
                });
            }
        } catch {
            // Profile might already exist
        }
    }

    async function checkPremiumStatus(userId: string) {
        try {
            const { data, error } = await supabase
                .from('Profile')
                .select('isPremium, premiumUntil')
                .eq('userId', userId)
                .single();

            if (data && !error) {
                const isActive = data.isPremium &&
                    (!data.premiumUntil || new Date(data.premiumUntil) > new Date());
                setIsPremium(isActive);
            }
        } catch {
            setIsPremium(false);
        }
    }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined'
                    ? `${window.location.origin}/auth/callback`
                    : undefined,
            },
        });
    }

    async function signOut() {
        await supabase.auth.signOut();
        setIsPremium(false);
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, isPremium, signInWithGoogle, signOut }}>
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
