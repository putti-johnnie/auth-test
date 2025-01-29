# Welcome to your Expo app 👋

This is a simple example app that demostrates the issues found in `Appkit`.

- issue 1: `const { address } = useAccount();` `address` is not updated after wallet is connected.
- issue 2: `const { disconnect } = useDisconnect();` `disconnect()` is not working properly.

details can be found in file `app/(tabs)/index.tsx`

## Get started

1. Install dependencies

   ```bash
   yarn && cd ios && pod install && cd ..
   ```

2. Update app config to allow run on the real device (Optional)

   - select your develop team in Xcode
   - update app bundle id that can use with your team in Xcode and `app.json`
   - update `projectId` in `app/_layout.tsx` that whitelists your new bundle id

3. Start the iOS app

   ```bash
    npx expo run:ios --device
   ```
