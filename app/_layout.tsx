import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "../constants/colors";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>MemoMingle</Text>
            </View>
            {/* Main Body */}
            <View style={styles.mainBody}></View>
            <Slot />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Night,
    },
    topBar: {
        flex: 0.5,
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    headingText: {
        color: colors.Silver,
        fontWeight: "500",
        fontSize: 24,
    },
    mainBody: {
        flex: 10,
    },
});
