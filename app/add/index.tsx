import {
    View,
    Pressable,
    TextInput,
    StyleSheet,
    ToastAndroid,
} from "react-native";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";

export default function Add() {
    const router = useRouter();
    const inputField = useRef<TextInput | null>(null);
    const [textFieldContent, setTextFieldContent] = useState<string | "">("");
    useEffect(() => {
        inputField?.current?.focus();
    }, []);
    const handleSave = async () => {
        const res = await fetch("http://10.0.2.2:3000/api/create-new-note", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: textFieldContent }),
        });
        const data = await res.json();
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        if (res.status === 201) {
            setTextFieldContent("");
            inputField?.current?.blur();
            router.navigate("/");
        }
    };
    return (
        <View style={styles.bottomBar}>
            <TextInput
                value={textFieldContent}
                onChange={(e) => setTextFieldContent(e.nativeEvent.text)}
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
        color: colors.White,
    },
});
