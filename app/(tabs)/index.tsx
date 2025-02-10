import { useAppKit } from '@reown/appkit-wagmi-react-native';
import { useEffect } from 'react';
import { Platform, Button, SafeAreaView, ScrollView, StatusBar, View, Text } from 'react-native';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectionController, AccountController } from '@reown/appkit-core-react-native';
import { useSignMessage } from 'wagmi'
import { AppKitButton } from '@reown/appkit-wagmi-react-native';

export default function HomeScreen() {

  const { open } = useAppKit()
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { signMessageAsync } = useSignMessage()

  function connectWallet() {
    open();
  }

  async function signMessage() {
    await signMessageAsync({ message: 'test' });
  }

  async function disconnectWallet() {
    // issue 2: disconnect not working properly
    // step to reproduce:
    // - connect to wallet
    // - press "Connect Wallet" button again, you will see a wallet connected view.
    // - close the above wallet connected view
    // - press "Disconnect Wallet" button, which call `disconnect()`
    // - press "Connect Wallet" button again, still see wallet is connected
    // await ConnectionController.disconnect();
    // AccountController.resetAccount();
    await disconnect();
  }

  useEffect(() => {
    // issue 1: address never get updated, it's always undefined
    console.log(`address updated: ${address}`)
  }, [address])

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        <View style={styles.button}>
          <Button title="Connect Wallet" onPress={connectWallet} />
        </View>

        <View style={styles.button}>
          <Button title="Sign Message" onPress={signMessage} />
        </View>

        <View style={styles.button}>
          <Button title="Disconnect Wallet" onPress={disconnectWallet} />
        </View>

        {address && <Text style={styles.text}>connected wallet: {address}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#eee",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  button: {
    paddingTop: 16,
  },
  text: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  }
};