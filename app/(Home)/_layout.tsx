import { Slot, router, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable,
    ToastAndroid,
    Alert,
} from "react-native";
import { colors } from "../../constants/colors";
import { useState, useEffect, useRef } from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Layout() {
    interface note {
        name: string;
        id: string;
    }
    const swipeableRefs = useRef<{ [key: number]: Swipeable | null }>({});
    const [notes, setNotes] = useState<note[]>([]);
    const pathName = usePathname();
    const getNotes = async () => {
        const res = await fetch("http:/10.0.2.2:3000/api/get-notes-names", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        setNotes(data.Notes);
    };
    useEffect(() => {
        getNotes();
    }, [pathName]);

    const handleDeleteNote = async (note: note, index: number) => {
        swipeableRefs.current[index]?.close();
        const res = await fetch("http://10.0.2.2:3000/api/delete-note", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({ title: note.name }),
        });
        const data = await res.json();
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        if (res.status === 200) {
            getNotes();
        }
    };
    const handleEditNote = async (note: note, index: number) => {
        swipeableRefs.current[index]?.close();
        router.navigate(`/editTitle/?oldName=${note.name}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>MemoMingle</Text>
            </View>
            {/* Main Body */}
            <View style={styles.mainBody}>
                <GestureHandlerRootView>
                    <ScrollView contentContainerStyle={{ gap: 10 }}>
                        {notes ? (
                            notes?.map((note, index) => {
                                return (
                                    <Pressable
                                        key={index}
                                        onPress={() =>
                                            router.navigate(
                                                `/Note/?noteTitle=${note.name}`
                                            )
                                        }
                                    >
                                        <Swipeable
                                            ref={(ref) =>
                                                (swipeableRefs.current[index] =
                                                    ref)
                                            }
                                            overshootLeft={false}
                                            renderLeftActions={() => (
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        gap: 20,
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        flex: 0.3,
                                                        padding: 10,
                                                    }}
                                                >
                                                    <Pressable
                                                        onPress={() =>
                                                            handleDeleteNote(
                                                                note,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="trash-bin-sharp"
                                                            size={40}
                                                            color={
                                                                colors.Silver
                                                            }
                                                        />
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() =>
                                                            handleEditNote(
                                                                note,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FontAwesome5
                                                            name="edit"
                                                            size={40}
                                                            color={
                                                                colors.Silver
                                                            }
                                                        />
                                                    </Pressable>
                                                </View>
                                            )}
                                        >
                                            <View style={styles.bodyItem}>
                                                <Text style={styles.bodyText}>
                                                    {note.name}
                                                </Text>
                                            </View>
                                        </Swipeable>
                                    </Pressable>
                                );
                            })
                        ) : (
                            <View>
                                <Text>No Notes</Text>
                            </View>
                        )}
                    </ScrollView>
                </GestureHandlerRootView>
            </View>
            <Slot />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Night,
    },
    mainBody: {
        flex: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomColor: colors["Eerie black"],
        borderBottomWidth: 2,
    },
    bodyItem: {
        borderColor: colors.Silver,
        borderWidth: 2,
        paddingVertical: 16,
        paddingHorizontal: 8,
        // borderRadius: 10,
    },
    bodyText: {
        color: colors.White,
        fontSize: 20,
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
});
