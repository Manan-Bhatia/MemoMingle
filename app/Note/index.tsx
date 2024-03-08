import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { useLocalSearchParams } from "expo-router";

export default function Note() {
    const { noteTitle } = useLocalSearchParams();
    return (
        <>
            {/* Top bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>{noteTitle}</Text>
            </View>
            <View style={styles.mainBody}>
                <Text>Content</Text>
            </View>
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
