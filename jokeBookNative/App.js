import React, { Component } from 'react';
import { Text, View, Content } from 'react-native';
export default class JokeBook extends Component {

  getJoke(){
    return fetch('https://api.sheety.co/0a81bcbb-d20f-4f5f-83f6-403ffd7e4b59')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({data: responseJson});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  constructor(){
    super()
    this.state ={
      data: []
    }
  }

  componentDidMount() {
    this.getJoke();
  }

  render() {
    let jokes = this.state.data;
    let specJoke = jokes[Math.floor(Math.random() * jokes.length)]{
      return(
        <View style={{}}>
          <Text>
            {specJoke.title}
          </Text>
          <Text>
          {specJoke.joke}
          </Text>
        </View>
      );
    }
      let randJoke = jokes.map(function(jokeData, index){
        return(
          <View style={{}}>
            <Text>
              {jokeData.title}
            </Text>
            <Text>
            {jokeData.joke}
            </Text>
          </View>
        );
      });
    return (
      <View>
        {specJoke}
      </View>
    );
  }
}
