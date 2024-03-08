import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Slot, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function NoteLayout() {
    const { noteTitle } = useLocalSearchParams();
    return (
        <SafeAreaView style={styles.container}>
            <Slot />
            {/* Bottom bar */}
            <View style={styles.bottomBar}>
                <TextInput
                    multiline
                    style={styles.inputText}
                    placeholder="What's on your mind?"
                    placeholderTextColor={colors.White}
                />
                <Ionicons name="send-sharp" size={40} color={colors.Silver} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Night,
    },
    bottomBar: {
        paddingHorizontal: 15,
        flex: 1,
        flexDirection: "row",
        gap: 15,
        justifyContent: "space-between",
        alignItems: "center",
    },
    inputText: {
        fontSize: 20,
        marginVertical: 10,
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
