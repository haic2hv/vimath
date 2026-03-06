'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isPremium: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ error: Error | null; needsConfirmation: boolean }>;
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
                checkPremiumStatus(session.user.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkPremiumStatus(session.user.id);
            } else {
                setIsPremium(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

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

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error as Error | null };
    }

    async function signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (!error && data.user) {
            // Create profile in database
            await supabase.from('Profile').insert({
                userId: data.user.id,
                email: email,
                isPremium: false,
            });
        }

        const needsConfirmation = !error && data.user && !data.session;
        return { error: error as Error | null, needsConfirmation: !!needsConfirmation };
    }

    async function signOut() {
        await supabase.auth.signOut();
        setIsPremium(false);
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, isPremium, signIn, signUp, signOut }}>
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
