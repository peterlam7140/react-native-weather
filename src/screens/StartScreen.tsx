import React, {PropsWithChildren} from 'react';
import { Button, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

import { useTranslation } from "react-i18next";

// export = StartScreen;
// export as namespace StartScreen;
// declare namespace StartScreen {

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
        <Text
            style={[
            styles.sectionTitle,
            {
                color: isDarkMode ? Colors.white : Colors.black,
            },
            ]}>
            {title}
        </Text>
        <Text
            style={[
            styles.sectionDescription,
            {
                color: isDarkMode ? Colors.light : Colors.dark,
            },
            ]}>
            {children}
        </Text>
        </View>
    );
}

export function StartScreen(): React.JSX.Element {
    const { t, i18n } = useTranslation();
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        // <SafeAreaView style={backgroundStyle}>
        // <StatusBar
        //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        //     backgroundColor={backgroundStyle.backgroundColor}
        // />
        // <ScrollView
        //     contentInsetAdjustmentBehavior="automatic"
        //     style={backgroundStyle}>
            <View>
                <Header />
                <View
                style={{
                    backgroundColor: isDarkMode ? Colors.black : Colors.white,
                }}>
                    <Button onPress={() => i18n.changeLanguage('en')} title="英文" />
                    <Button onPress={() => i18n.changeLanguage('tc')} title="中文" />
                    <Text>{i18n.language}</Text>
                    <Text>{t("hello")}</Text>
                    <Text>{t("link")}</Text>
                <Section title="Step One">
                    Edit <Text style={styles.highlight}>App.tsx</Text> to change this
                    screen and then come back to see your edits.
                </Section>
                <Section title="See Your Changes">
                    <ReloadInstructions />
                </Section>
                <Section title="Debug">
                    <DebugInstructions />
                </Section>
                <Section title="Learn More">
                    Read the docs to discover what to do next:
                </Section>
                <LearnMoreLinks />
                </View>
            </View>
        // </ScrollView>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
},
sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
},
sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
},
highlight: {
    fontWeight: '700',
},
});

// }

export default StartScreen;