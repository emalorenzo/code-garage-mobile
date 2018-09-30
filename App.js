import React from 'react';
import { View, Text } from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    firebase.auth().signInAnonymously()
      .then(() => {
        this.setState({
          isAuthenticated: true,
        });
      });
  }

  render() {
    // If the user has not authenticated
    if (!this.state.isAuthenticated) {
      return null;
    }

    return (
      <View>
        <Text>Welcome to my awesome app!</Text>
        <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn}
          disabled={this.state.isSigninInProgress}
        />
      </View>
    );
  }

}

export default App;