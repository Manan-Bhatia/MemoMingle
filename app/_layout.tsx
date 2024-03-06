import { Slot, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { colors } from "../constants/colors";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";

export default function Layout() {
    const [notes, setNotes] = useState<string[]>([]);
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
    return (
        <SafeAreaView style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>MemoMingle</Text>
            </View>
            {/* Main Body */}
            <View style={styles.mainBody}>
                <ScrollView contentContainerStyle={{ gap: 10 }}>
                    {notes ? (
                        notes?.map((note, index) => {
                            return (
                                <View style={styles.bodyItem} key={index}>
                                    <Text style={styles.bodyText}>{note}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <View>
                            <Text>No Notes</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
            <StatusBar style="light" />
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
        borderRadius: 10,
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
