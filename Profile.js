import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet,Modal, FlatList } from 'react-native';
import axiosInstance from './services/axiosInstance';

const ProfilePage = ({ navigation }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [username, setUsername] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriendHabits, setSelectedFriendHabits] = useState([]);


    useEffect(() => {
        fetchFriendRequests();
        fetchFriends();
    }, []);

    const fetchFriendRequests = async () => {
        const response = await axiosInstance.get('friends/requests_list/');
        
        setFriendRequests(response.data);
    };

    const fetchFriends = async () => {
        const response = await axiosInstance.get('friends/list/');
        setFriends(response.data);
    };
    const fetchFriendsHabits = async (friendUsername) => {
        try {
            const response = await axiosInstance.get('friends/get_habits_with_streaks/', {
                params: {
                    friend_user: friendUsername
                }
            });
            const habits = response.data.habits
            setSelectedFriendHabits(habits); // Store habits data
            setModalVisible(true); // Show modal
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

    const sendFriendRequest = async () => {
        try {
            await axiosInstance.post('friends/send_request/', { friend_username: username });
            setShowPopup(false);
            fetchFriendRequests();
            fetchFriends(); // Yenile
        } catch (error) {
            // Hata mesajını backend'den al
        const errorMessage = error.response?.data?.error || 'Bir hata oluştu.'; // Varsayılan hata mesajı
        console.error('Error sending friend request: ', errorMessage);
        // Hata mesajını kullanıcıya göster
        alert(errorMessage); // Örneğin bir alert ile gösterim
        }
    };

    const acceptRequest = async (id) => {
        await axiosInstance.post(`friends/accept/${id}/`);
        fetchFriendRequests(); // Yenile
        fetchFriends(); // Arkadaşlar listesini güncelle
    };

    const declineRequest = async (id) => {
        await axiosInstance.post(`friends/decline/${id}/`);
        fetchFriendRequests(); // Yenile
        fetchFriends();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil Sayfası</Text>
            <Text style={styles.sectionTitle}>Arkadaşlık İstekleri</Text>
            {friendRequests.length === 0 ? (
       <Text>Hiç arkadaşlık isteğiniz yok.</Text>
   ) : (
       friendRequests.map(request => (
           <View key={request.id} style={styles.requestItem}>
               <Text>{request.user__username}</Text>
               <Button title="Kabul Et" onPress={() => acceptRequest(request.id)} />
               <Button title="Reddet" onPress={() => declineRequest(request.id)} />
           </View>
       ))
   )}
            <Text style={styles.sectionTitle}>Arkadaşlar</Text>
            {friends.map(friend => (
                <Text 
                    key={friend.friend__username} 
                    style={styles.friendItem}
                    onPress={() => fetchFriendsHabits(friend.friend__username)}
                >
                    {friend.friend__username}
                </Text>
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Friend's Habits</Text>
                    <FlatList
                        data={selectedFriendHabits}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Text style={styles.habitItem}>{item.name} - Streak: {item.streak}</Text>
                        )}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>

            <Button title="Arkadaşlık İsteği Gönder" onPress={() => setShowPopup(true)} />
            {showPopup && (
                <View style={styles.popup}>
                    <Text>Arkadaşlık İsteği Gönder</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Kullanıcı Adı"
                    />
                    <Button title="Gönder" onPress={sendFriendRequest} />
                    <Button title="Kapat" onPress={() => setShowPopup(false)} />
                </View>
            )}
            <Button
                title="Ana Sayfaya Git"
                onPress={() => navigation.navigate('Home')} // Ana sayfaya yönlendirme
                color="#841584"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 8,
    },
    requestItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    friendItem: {
        fontSize: 16,
        marginBottom: 4,
    },
    popup: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginVertical: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
        paddingHorizontal: 8,
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    habitItem: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default ProfilePage;
