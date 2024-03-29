import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Pressable,
    ToastAndroid,
} from "react-native";
import { colors } from "../../constants/colors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
    GestureHandlerRootView,
    ScrollView,
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Note() {
    const { noteTitle } = useLocalSearchParams();
    const noteName = typeof noteTitle === "string" ? noteTitle : "";
    interface Message {
        id: string;
        text: string;
        updatedAt: string;
    }
    const [messages, setMessages] = useState<Message[] | []>([]);
    const getMessages = async (noteName: string) => {
        const response = await fetch("http://10.0.2.2:3000/api/get-messages", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ note: noteName }),
        });
        const data = await response.json();
        setMessages(data.messages);
    };
    useEffect(() => {
        // fetch messages from server
        getMessages(noteName);
    }, []);
    const inputField = useRef<TextInput>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const [inputFieldText, setInputFieldText] = useState<string>("");
    const handleAddMessage = async () => {
        const response = await fetch("http://10.0.2.2:3000/api/add-message", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ note: noteName, message: inputFieldText }),
        });
        const data = await response.json();
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        if (response.status === 201) {
            inputField.current?.blur();
            getMessages(noteName);
            setInputFieldText("");
        }
    };
    const [selectMode, setSelectMode] = useState<{
        activated: boolean;
        id: string;
    }>({ activated: false, id: "" });
    const createLongPressGesture = (message: Message) => {
        return Gesture.LongPress().onEnd(() => {
            setSelectMode({ activated: true, id: message.id });
        });
    };
    const handleDeleteMessage = async () => {
        const response = await fetch("http:10.0.2.2:3000/api/delete-message", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({ note: noteName, id: selectMode.id }),
        });
        const data = await response.json();
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        if (response.status === 200) {
            setSelectMode({ activated: false, id: "" });
            getMessages(noteName);
        }
    };
    const [editing, setEditing] = useState<boolean>(false);
    const startEditingMessage = () => {
        setEditing(true);
        setSelectMode((prev) => ({ ...prev, activated: false }));
        const message = messages.find(
            (message) => message.id === selectMode.id
        );
        if (message) {
            setInputFieldText(message.text);
            setTimeout(() => {
                inputField.current?.focus();
            }, 100);
        }
    };
    const handleEditMessage = async () => {
        const response = await fetch("http:10.0.2.2:3000/api/edit-message", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                note: noteName,
                id: selectMode.id,
                message: inputFieldText,
            }),
        });
        const data = await response.json();
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        if (response.status === 200) {
            setEditing(false);
            setInputFieldText("");
            getMessages(noteName);
            inputField.current?.blur();
        }
    };
    return (
        <>
            {/* Top bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>{noteName}</Text>
            </View>
            <View style={styles.mainBody}>
                <GestureHandlerRootView>
                    <ScrollView
                        contentContainerStyle={styles.scrollView}
                        ref={scrollViewRef}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({
                                animated: true,
                            })
                        }
                    >
                        {messages.map((message, index) => {
                            const longPressGesture =
                                createLongPressGesture(message);
                            return (
                                <GestureDetector
                                    key={index}
                                    gesture={longPressGesture}
                                >
                                    <View style={styles.messageContainer}>
                                        <Text style={styles.messageText}>
                                            {message.text}
                                        </Text>

                                        <Text style={styles.messageSubText}>
                                            {message.updatedAt}
                                        </Text>
                                    </View>
                                </GestureDetector>
                            );
                        })}
                    </ScrollView>
                </GestureHandlerRootView>
            </View>

            {/* Bottom bar */}
            {selectMode.activated ? (
                <View style={styles.bottomBar}>
                    <Pressable
                        onPress={() =>
                            setSelectMode({ activated: false, id: "" })
                        }
                    >
                        <Ionicons
                            name="close"
                            size={35}
                            color={colors.Silver}
                        />
                    </Pressable>
                    <View style={{ flexDirection: "row", gap: 25 }}>
                        <Pressable onPress={handleDeleteMessage}>
                            <Ionicons
                                name="trash-bin-sharp"
                                size={35}
                                color={colors.Silver}
                            />
                        </Pressable>
                        <Pressable onPress={startEditingMessage}>
                            <FontAwesome5
                                name="edit"
                                size={35}
                                color={colors.Silver}
                            />
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={styles.bottomBar}>
                    <TextInput
                        ref={inputField}
                        value={inputFieldText}
                        onChange={(e) => setInputFieldText(e.nativeEvent.text)}
                        multiline
                        onContentSizeChange={(e) =>
                            (innerHeight = e.nativeEvent.contentSize.height)
                        }
                        style={styles.inputText}
                        placeholder="What's on your mind?"
                        placeholderTextColor={colors.White}
                    />
                    {editing ? (
                        <Pressable onPress={handleEditMessage}>
                            <Ionicons
                                name="checkmark-circle"
                                size={40}
                                color={colors.Silver}
                            />
                        </Pressable>
                    ) : (
                        <Pressable onPress={handleAddMessage}>
                            <Ionicons
                                name="send-sharp"
                                size={40}
                                color={colors.Silver}
                            />
                        </Pressable>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    mainBody: {
        flex: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomColor: colors["Eerie black"],
        borderBottomWidth: 2,
        justifyContent: "flex-end",
    },
    scrollView: {
        gap: 8,
        alignItems: "flex-end",
        paddingVertical: 5,
    },
    messageContainer: {
        backgroundColor: colors["Eerie black"],
        padding: 10,
        borderRadius: 10,
        minWidth: "30%",
        gap: 8,
    },
    messageText: {
        color: colors.White,
        fontSize: 20,
        textAlign: "left",
    },
    messageSubText: {
        color: colors.White,
        fontSize: 16,
        textAlign: "right",
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
