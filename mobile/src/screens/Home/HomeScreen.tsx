import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const mockVideos = [
    { id: '1', title: 'Ensimmäinen video', thumbnail: 'https://via.placeholder.com/300', author: 'Käyttäjä1' },
    { id: '2', title: 'Toinen video', thumbnail: 'https://via.placeholder.com/300', author: 'Käyttäjä2' },
    { id: '3', title: 'Kolmas video', thumbnail: 'https://via.placeholder.com/300', author: 'Käyttäjä3' },
];

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockVideos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.videoCard}>
                        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                        <View style={styles.videoInfo}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.author}>{item.author}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    videoCard: {
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f8f8f8',
    },
    thumbnail: {
        width: '100%',
        height: 200,
    },
    videoInfo: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 14,
        color: 'gray',
    },
});

export default HomeScreen;
