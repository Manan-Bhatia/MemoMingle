import { View, Pressable, TextInput, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef, useEffect } from "react";

export default function Add() {
    const inputField = useRef<TextInput | null>(null);
    useEffect(() => {
        inputField?.current?.focus();
    }, []);
    const handleSave = () => {
        console.log('saved')
    }
    return (
        <View style={styles.bottomBar}>
            <TextInput
                ref={inputField}
                style={styles.inputText}
                placeholder="Note title"
                placeholderTextColor={colors.White}
            />
            <Pressable onPress={handleSave}>
                <Ionicons
                    name="checkmark-circle"
                    size={60}
                    color={colors.Silver}
                />
            </Pressable>
            <Link href="/">
                <Ionicons
                    name="close-circle-sharp"
                    size={60}
                    color={colors["Imperial red"]}
                />
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
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
        color: colors.White
    },
});
