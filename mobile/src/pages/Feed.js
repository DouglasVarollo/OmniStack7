import React, { Component } from 'react';
import io from 'socket.io-client';
import api from '../services/api';

import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={camera} />
      </TouchableOpacity>
    ),
  });

  state = {
    feed: [],
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get('/posts');

    this.setState({ feed: response.data });
  }

  registerToSocket = () => {
    const socket = io('http://192.168.1.6:3333');

    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on('like', likedPost => {
      this.setState({
        feed: this.state.feed.map(post => post._id === likedPost._id ? likedPost : post)
      });
    });
  }

  handleLike = id => {
    api.post(`/posts/${id}/like`);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>

                <Image source={more} />
              </View>

              <Image style={styles.preview} source={{ uri: `http://192.168.1.6:3333/files/${item.image}` }} />

              <View style={styles.feedItemFooter}>
                <View stlye={styles.actions}>
                  <TouchableOpacity style={styles.action} onPress={() => { this.handleLike(item._id) }}>
                    <Image source={like} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => { }}>
                    <Image source={comment} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => { }}>
                    <Image source={send} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.like}>{item.likes}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});
