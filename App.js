import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
var FBLoginButton = require('./FBLoginButton')

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      isSigninInProgress: false,
      user: undefined
    };
  }

  componentDidMount() {
    firebase.auth().signInAnonymously()
      .then(() => {
        this.setState({
          isAuthenticated: true,
        })
      })
  }

  signIn = async () => {
    try {
      this.setState({ isSigninInProgress: true })
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ user: userInfo.user, isSigninInProgress: false })

      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
      // login with credential
      const currentUser = await firebase.auth().signInWithCredential(credential)

      console.info(JSON.stringify(currentUser.user.toJSON()));

    } catch (error) {
      this.setState({ isSigninInProgress: false })
      console.log('error', error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      this.setState({ user: null }) // Remember to remove the user from your app's state as well
    } catch (error) {
      console.log(error)
    }
  }

  _signIn () {
    GoogleSignin.configure()
    this.signIn()
  }

  render() {
    // If the user has not authenticated
    if (!this.state.isAuthenticated) {
      return null
    }

    return (
      <View style={{ padding: 50 }}>
        <Text>{`Hola${this.state.user ? ' ' + this.state.user.givenName + '!' : '!'}`}</Text>
        <GoogleSigninButton
          style={{ width: '100%', height: 60 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => this._signIn()}
          disabled={this.state.isSigninInProgress}
        />
        <FBLoginButton />
        <TouchableOpacity
          onPress={() => this.signOut()}
          style={{ margin: 20, padding: 20 }}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

export default App;