import { View, Text, StyleSheet, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>MemoMingle</Text>
            </View>
            {/* Main Body */}
            <View style={styles.mainBody}></View>
            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Search"
                    placeholderTextColor={colors.White}
                />
                <Ionicons
                    name="add-circle-sharp"
                    size={60}
                    color={colors.Silver}
                />
            </View>
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
        // backgroundColor: colors.Silver,
    },
    bottomBar: {
        paddingHorizontal: 15,
        flex: 1,
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-between",
        alignItems: "center",
    },
    inputText: {
        fontSize: 20,
        borderWidth: 2,
        borderColor: colors.Silver,
        paddingVertical: 5,
        paddingHorizontal: 10,
        textAlign: "auto",
        flex: 1,
        borderRadius: 10,
    },
});
