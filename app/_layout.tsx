import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '@walletconnect/react-native-compat'
import { Linking } from 'react-native';

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit, defaultWagmiConfig, AppKit } from '@reown/appkit-wagmi-react-native'
import { handleResponse } from '@coinbase/wallet-mobile-sdk';
import { coinbaseConnector } from '@reown/appkit-coinbase-wagmi-react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

import { chains } from '../config/WagmiUtils';
import { siweConfig } from '../config/SiweUtils';
import { getCustomWallets } from '../config/misc';
import { authConnector } from '@reown/appkit-auth-wagmi-react-native';
import Clipboard from '@react-native-clipboard/clipboard';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const projectId = '0c25a617a6a3a174e22f7bbadc9c3a1d'

const metadata = {
  name: 'Authtest',
  description: 'AppKit RN Example',
  url: 'https://authtest.co.nz',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'auth.test://',
  }
}

const clipboardClient = {
  setString: async (value: string) => {
    Clipboard.setString(value);
  },
};

const _coinbaseConnector = coinbaseConnector({
  redirect: metadata?.redirect?.native || '',
});

const _authConnector = authConnector({
  projectId,
  metadata,
});

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  extraConnectors: [_coinbaseConnector, _authConnector],
})

const customWallets = getCustomWallets();

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  metadata,
  siweConfig,
  clipboardClient,
  customWallets,
  features: {
    email: true,
    socials: ['x', 'discord', 'apple'],
    emailShowWallets: true,
    swaps: true,
  },
});

export default function RootLayout() {

  // Handle deeplinks for Coinbase SDK
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const handledBySdk = handleResponse(new URL(url));
    });

    return () => sub.remove();
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>

        <AppKit />

      </QueryClientProvider>
    </WagmiProvider>
  );
}
