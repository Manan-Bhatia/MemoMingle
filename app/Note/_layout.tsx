import {StyleSheet} from "react-native";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function NoteLayout() {
    return (
        <SafeAreaView style={styles.container}>
            <Slot />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Night,
    },
});
