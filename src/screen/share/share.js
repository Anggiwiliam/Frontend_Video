import React from 'react';
import { FaHome } from "react-icons/fa";
import { Link, Route, Redirect } from 'react-router-dom'
import axios from 'axios'

const API_URL = "http://localhost:3100"

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      isSend: 0
    }
    this.handleChange = this.handleChange.bind(this);
  }


  async getDataYoutube(id) {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/youtube/v3/videos',
        params: {
          part: "snippet",
          key: 'AIzaSyDS0ZquOgcs39edjhuUSbqOrFr0loDwRss',
          id: id
        }
      });

      const data = await response.data.items[0].snippet.localized;
      return (data)
    } catch (error) {

    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  async sendLogout(){
    try{
        let email = localStorage.getItem('email');
        let id = localStorage.getItem('id');
        console.log(email)
        const response = await axios({
            method: 'delete',
            url: API_URL+'/user',
            data: {
              email: email,
              id: id
            }
          });
          localStorage.setItem("Login", '0');
          this.setState({
            isLogin: '0'
          }) 
    }catch(error){

    }
}

async sendLogin() {
    if(this.state.email.length === 0){
        alert("email is empty");
        return;
    }
    else if(this.state.password.length === 0){
        alert("password is empty");
        return;
    }
    try{
      const response = await axios({
        method: 'put',
        url: API_URL+'/user',
        data: {
          email: this.state.email,
          password: this.state.password
        }
      });
      let data = response.data.result.data[0]
      const {
          id,
          email,
          status
      } = data;
      localStorage.setItem("id", id);
      localStorage.setItem("email", email);
      localStorage.setItem("Login", '1');
      this.setState({
        isLogin: '1'
      })
      }catch(error) {
        this.setState({
          isLogin: '0'
        })
        alert("the user was login");
      }
  }
  async newMovie() {
    console.log('masuk')
    try {
      const youtube_id = this.state.url.split("v=")
      console.log(youtube_id);
      let id = localStorage.getItem('id');
      const data = await this.getDataYoutube(youtube_id[1])
      console.log(data);
      const text = data.description.substr(0, 254);
      const response = await axios({
        method: 'post',
        url: API_URL + '/share',
        data: {
          link: youtube_id[1],
          id: id,
          description: text,
          title: data.title
        }
      });
      this.setState({
        isSend: 1
      })
    } catch (error) {
      alert("the youtube URL is invalid");
      console.log(error);
    }
  }

  render() {
    const user = localStorage.getItem('email');
    return (
      <div>
        {(this.state.isSend == '1') && <Redirect push to='/'></Redirect>}
        <header className="App-header">
          <nav className="navbar navbar-light" style={{ backgroundColor: '#7DC9E7' }}>
            <Link to={'/'} style={{ fontSize: 30, flex: 1, color: "black" }}>
              <FaHome style={{ fontSize: 25, marginLeft: 80, color: "white" }} />
              <b style={{ color: "white", marginLeft: 10 }}>Funny Movies</b>
            </Link>
            <p style={{ fontSize: 20, margin: 20, color: "white" }}>Welcome {user}</p>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => this.newMovie()}
              style={{ margin: 5, borderRadius: 20, size: 40 }}> Share movie  
            </button>
            <button
              type="button"
              className="btn btn-red"
              onClick={() => this.sendLogout()}
              style={{ margin: 5, borderRadius: 20, marginRight: 40 }}>Logout
            </button>
          </nav>
        </header>
        <div className="container">
          <div className="row" style={{ marginTop: 100 }}>
            <div className="col-md-4" />
            <div className="col-md-6" style={{ justifyItems: "center" }}>
              <div className="card">
                <div className="card-body">
                  <p>Share a Youtube movie.</p>
                  <div className="row">
                    <div className="col-md-3" style={{ margin: 10 }}>
                      Youtube URL :
                            </div>
                    <div className="col-md-4" style={{ margin: 10 }}>
                      <input
                        type="text"
                        placeholder="URL"
                        name="url"
                        value={this.state.url}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                       style={{ margin: 5, borderRadius: 20, size: 40 }}
                      className="btn btn-dark mx-auto"
                      onClick={() => this.newMovie()}
                    >
                      Share
                            </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 " />
          </div>
        </div>
      </div>
    );
  }
}

export default Share;
