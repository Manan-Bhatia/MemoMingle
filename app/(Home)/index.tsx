import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function App() {
    return (
        <View style={styles.container}>
            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.inputText}>
                    <Ionicons
                        name="search-sharp"
                        size={25}
                        color={colors.Silver}
                    />
                    <TextInput
                        style={styles.inputFieldText}
                        placeholder="Search"
                        placeholderTextColor={colors.White}
                    />
                </View>
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
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 2,
        borderColor: colors.Silver,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flex: 1,
        borderRadius: 10,
    },
    inputFieldText: {
        fontSize: 20,
        color: colors.White,
        textAlign: "auto",
    },
});
