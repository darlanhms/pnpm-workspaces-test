/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, Text, useColorScheme } from 'react-native';

import { sum } from '@pnpm-workspaces-test/utils';

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaView>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Text>Hello world! {sum(1, 1)}</Text>
        </SafeAreaView>
    );
}

export default App;
