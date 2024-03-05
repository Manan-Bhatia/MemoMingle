import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function App() {
    return (
        <View style={styles.container}>
            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Search"
                    placeholderTextColor={colors.White}
                />
                <Link href="/add">
                    <Ionicons
                        name="add-circle-sharp"
                        size={60}
                        color={colors.Silver}
                    />
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: colors.White,
    },
});
