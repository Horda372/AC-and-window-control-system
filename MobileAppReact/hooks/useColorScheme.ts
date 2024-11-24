import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Cookies from 'js-cookie';

export function MyScreen() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    // Set isMounted to true after the first render
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (!isMounted) return; // Skip navigation until mounted

            const isLoggedIn = Cookies.get('isLoggedIn');
            if (isLoggedIn !== 'True') {
                router.replace('/Login');
            }
        }, [isMounted, router])
    );

    if (!isMounted) {
        return;
    }

    return;
}
