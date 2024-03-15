import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, Send, SystemMessage, Avatar } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const ChatComponent = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load messages, fetch from API, database, etc.
    // For now, let's set some example messages
    setMessages([
      {
        _id: 1,
        text: 'Hello!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            ...styles.bubbleStyle,
            backgroundColor: 'pink', 
          },
          right: {
            ...styles.bubbleStyle,
            backgroundColor: 'grey', 
          },
        }}
      />
    );
  };
  

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarStyle}
    />
  );

  const renderComposer = (props) => (
    <Composer
      {...props}
      placeholder="Type a message..."
      textInputStyle={styles.textInputStyle}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendButtonContainer}>
        <AntDesign name="arrowup" size={24} color="#007AFF" />
      </View>
    </Send>
  );

  const renderSystemMessage = (props) => (
    <SystemMessage
      {...props}
      textStyle={{ color: '#ffffff', fontWeight: 'bold' }}
    />
  );

 

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={29} color="black" />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderSystemMessage={renderSystemMessage}
       
        scrollToBottom
        alwaysShowSend
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleStyle: {
    backgroundColor: 'blue',
    borderRadius: 10,
    marginBottom: 10,
  },
  inputToolbarStyle: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  textInputStyle: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
});

export default ChatComponent;
