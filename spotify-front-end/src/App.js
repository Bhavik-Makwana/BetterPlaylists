import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import Modal from 'react-modal';
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width:'50%',
    height:'50%',
    backgroundColor:'#181919',
    color:'#ffffff'
  }
};
Modal.setAppElement('#modal');
const spotifyApi = new SpotifyWebApi();
var ReactDOM = require('react-dom');
class App extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    console.log(params.access_token);
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);

    }
    console.log("Access token"+spotifyApi.getAccessToken());
    this.state = {
      loggedIn: token ? true: false,
      modalIsOpen: false,
      // newPlaylistSettings: {
        playlistName:'',
        playlistDesc:'',
      // },
      user: {
        id: '21f2tcvbq7gw3t6owuxul4wci',
      },
      playlistsListing: {
        playlistName: 's',
        id: 's',
      },
      nowPlaying: {
        name: 'Not Checked:',
        image: ''
      },
      
    }
    this.createHandler = this.createHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
    this.viewPlaylists();
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
   ///  callback();
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {
      console.log(response);
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: response.item.album.images[0].url
        }
      });
      console.log("ee");
    }).catch(e => {
      console.log("Error" );
      console.log(e);
  });
  }
  getUser() {
    spotifyApi.getUser()
    .then((response) => {
      console.log(response);
    })
  }
  viewPlaylists() {
    // This in a standard function is defined by how its called, not where the function was created
    // therefore this in the callback function is different to where it was created
    // arrow functions close over this of their context so no issue
    spotifyApi.getUserPlaylists()
    .then(data => {
      let arr = [];
      var i;
      let arr2 = data.items;
      const rootElement = document.getElementById('test');
      const element = <div class="select is-multiple is-primary is-small is-rounded">
                        <form>
                          <select id='usersPlaylists' name='playlists'>
                            <option value='default'>Defaults</option>;
                          </select>
                        </form>
                      </div>

      console.log(element);
      ReactDOM.render(element, rootElement);
      let contents=[];
      const optionsInner = document.getElementById('usersPlaylists')
      for (i = 0; i < arr2.length; i++) {
       // contents+=<option value='xx'>ddd</option>
        contents.push(<option value={data.items[i].name}>{data.items[i].name}</option>);
        console.log(data.items[0].name);
      }
      console.log("contents:: "+contents);
      ReactDOM.render(contents, optionsInner);
   //   console.log(arr);
      console.log('User playlists', data);
      console.log('User playlists', data.items[0].name, data.items[0].id);
      //document.getElementById("playlist").innerHTML=(data.items[0].name);
      this.setState({
        playlistsListing: {
          //name: data.items[0].name,
          name:arr,
          id: data.items[0].id,
        }
      })
    }).catch(e => {
      console.log(e);
  });
/*********************  ******************/

/********************** *****************/
  console.log(this.state.playlistsListing);
  }
  addSongToPlaylist(user) {
    spotifyApi.addTracksToPlaylist(user , '0144EWFjoOfR2DsAS97RhI', ['spotify:track:3Q3myFA7q4Op95DOpHplaY','spotify:track:6MKEi0veD4qCXf8cUeRxam'])
    .then(function(data) {
      console.log(data);
    }).catch(e => {
      console.log(e);
  });
  }
  createPlaylist() {
    const rootElement = document.getElementById('playlistCreator');
    const element = <div class='playlistCreatorBox field'> 
    < form class='playlistDetails' onSubmit={this.handleSubmit}>
        <label class='label'>Playlist Name</label>
        <div class='control'>
          <input name='playlistName' type='text' onChange={this.createHandler}></input>
        </div>
        <p class='help'> Enter what you'd like to call your new playlist </p>
        <input name='playlistDesc' type='text' onChange={this.createHandler}></input><br></br>
        
        <input type='submit' class="button is-primary is-inverted is-medium is-outlined"></input>
      </form>
    </div>;
    ReactDOM.render(element,rootElement);
    console.log(this.state.user.id);
                               

  }
  
  createHandler(event) {
    console.log('createhandler function '+event.target.name+' '+event.target.value);
    this.setState({
      // newPlaylistSettings: {
        [event.target.name]:event.target.value
      // }
    });
  }
   handleSubmit(event) {
    console.log(this.state.playlistName);
    console.log(this.state.playlistDesc);
    spotifyApi.createPlaylist('21f2tcvbq7gw3t6owuxul4wci',{
      "name": this.state.playlistName,
      "description": this.state.playlistDesc,
      "public": false
    })
    .then(data => {
      console.log(data);
    }).catch(e => {
      console.log(e);
  });
    event.preventDefault();
  }
  searchTracks() {
    spotifyApi.searchTracks('I Like Me Better')
    .then(function(data) {
      console.log('Search by "Paranoid"', data);
      alert(data.tracks.items[0].name);
    }, function(err) {
      console.error(err);
    });
  }
  userLoggedIn() {
    if(!this.state.loggedIn) {
      console.log(this.state.loggedIn);
      document.getElementById("loggedInBox").innerHTML=(
        '<a class="button is-primary is-inverted is-medium is-outlined" href="http://localhost:8888/login">Login with spotify </a>' 
      );

    }
    else {
      document.getElementById("loggedInBox").innerHTML=(
 "       logged in");

    }
  } 
 
  render() {
    return (

      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <a href='http://localhost:8888'>
          <button> Login with spotify </button>
        </a> */}
        <a class="button is-primary is-inverted is-medium is-outlined" href="http://localhost:8888/login">Login with spotify </a>
        {/* {this.userLoggedIn()} */}
      
        <div>
        <Modal 
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h1>Select playlist</h1>
          <div id='test'></div>
          <div class='playlistCreatorBox field'> 
            
              <h2>Track Name</h2>
              <div class='control'>
                <input class="input is-primary" name='songName' type='text'></input>
              </div>
              <p class='help'> Enter song to add to playlist </p>
              {/* Create a separate container file for adding songs to a playlist which maintains its own state otherwise this file will get too cluttered */}
              <input value='Add Song' type='button' class="button is-primary is-inverted is-small is-outlined" onClick={() => this.addSongToPlaylist()}></input>
            
            
          </div>
          
          
          
        </Modal>
        </div>

      
        <div> Now Playing: {this.state.nowPlaying.name} </div>
        <div>
          <img id="playingImage" src= {this.state.nowPlaying.image} />
        </div>
        
    {/* <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.newPlaylistSettings} onchange={this.creatIt} />
        </label>
        <input type="submit" value="Submit" />
      </form> */}
        <button class="button is-primary is-inverted is-medium is-outlined" onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </button>
        <button class="button is-primary is-inverted is-medium is-outlined" onClick={() => this.openModal()}>
        Get playlists
        </button>
        <button class="button is-primary is-inverted is-medium is-outlined" onClick={() => this.addSongToPlaylist(this.state.user.id)}>
        add song to playlist
        </button>
        <button class="button is-primary is-inverted is-medium is-outlined" onClick={() => this.getUser()}>
        Get user
        </button>
        <button class="button is-primary is-inverted is-medium is-outlined" onClick={() => this.createPlaylist()}>
        Create playlist
        </button>
        <button class="button is-primary is-inverted is-medium is-outlined" onClick={() => this.searchTracks()}>
        Search tracks
        </button>
          <div id='playlist'> Playlists {this.state.playlistsListing.name} </div>

      </div>
    );
  }
}

export default App;
