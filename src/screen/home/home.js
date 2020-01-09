import React from 'react';
import YouTube from 'react-youtube';
import {Link} from 'react-router-dom'
import axios from 'axios'
import { FaHome } from "react-icons/fa";
import {AiOutlineLike, AiOutlineDislike} from "react-icons/ai"

const API_URL = "http://localhost:3100"
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          email: '',
          password: '',
          isLogin: '0',
          movies: [],
          youtube_data: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
    }

    async sendlike(status, id){
        try{
            const response = await axios({
                method: 'put',
                url: API_URL+'/share',
                data:{
                    movie_id: id,
                    data: status
                }
              });
              this.movieList()
        }catch(error){
            console.error(error);
            
        }
    }

    async componentDidMount(){
        this.movieList()
        let login = localStorage.getItem('Login');
        
        if(login == '1'){
            this.setState({
                isLogin: '1'
            });
        }else{
            this.setState({
                isLogin: '0'
            });
        }
      }
    
    async movieList(){
        try{
            const response = await axios({
                method: 'get',
                url: API_URL+'/share'
              });
              await this.setState({
                  movies: response.data.result.movies
              })
        }catch(error){
            console.error(error);
            
        }
    }

    handleChange(event) {
        const target = event.target;
        const value =  target.value;
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

    _onReady(event) {
        event.target.pauseVideo();
      }

      render (){
        const opts = {
            height: '300',
            width: '450',
            playerVars: { 
            autoplay: 0
            }
        };
        const user = localStorage.getItem('email');
        return (
            <div>
            { 
                (this.state.isLogin == '1') ?
                    <header className="App-header">
                    <nav className="navbar navbar-light" style={{backgroundColor:'#7DC9E7'}}>
                        <Link to={'/'} style={{fontSize: 30, flex: 1, color:"black"}}>
                        <FaHome style={{fontSize: 25,marginLeft:80, color: "white" }} /><b style={{color:"white", marginLeft:10}}>Funny Movies</b> 
                        </Link>
                        <b style={{fontSize:15, margin: 3,color: "white"}}>Welcome</b>
                        <b style={{fontSize:15, margin: 3, color: "white", marginRight:40 }}>{user}</b>
                        <Link to={'/share'}>
                            <button 
                                type="button"  
                                className="btn btn-light"
                                style={{margin:5,size:40}}> Share movie
                            </button>
                        </Link>
                        <button 
                            type="button" 
                            className="btn btn-red"
                            onClick={() => this.sendLogout()}
                            style={{margin:5, marginRight:40}}>Logout
                        </button>
                    </nav>
                    </header>
                    :
                    <header className="App-header">
                    <nav className="navbar navbar-light" style={{backgroundColor:'#7DC9E7'}}>
                    <Link to={'/'} style={{fontSize: 30, flex: 1, color:"black"}}>
                        <FaHome style={{fontSize: 25,marginLeft:80, color: "white" }} /><b style={{color:"white", marginLeft:10}}>Funny Movies</b> 
                        </Link>
                        <input 
                            type="text" 
                            placeholder="Email" 
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            style={{margin:20, padding:8}}
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            style={{margin:20, padding:8}}
                        />
                        <button 
                            type="button" 
                            className="btn btn-light"
                            onClick={() => this.sendLogin()}
                        >
                            Login / Register
                        </button>
                    </nav>
                    </header>
            }
            <div className="container mb-10">
               {
                    this.state.movies.map((movie) => {
                        return(
                            <div className="card" style={{margin:30, backgroundColor:'white'}}>
                                <div className="row no-gutters">
                                <div className="col-md-4 ml-3 mt-1" style={{width: 490}}>
                                <YouTube
                                    videoId={movie.link}
                                    opts={opts}
                                    onReady={this._onReady}
                                />
                                </div>
                                <div className="col-md-4" style={{position:"absolute", marginLeft: 500}}>
                                    <div className="card-body">
                                    <h5 className="card-title" style={{color:"white"}}>{movie.title}</h5>
                                    <p className="card-text" style={{height:400}}>
                                        Shared by: {movie.email}
                                        <br/> 
                                        <span style={{fontSize:16}}>{movie.likes}</span> 
                                        <button 
                                            onClick={() => {this.sendlike("likes", movie.id)}}
                                            style={{marginLeft:5}}
                                        >
                                                <AiOutlineLike style={{fontSize:25}}/>
                                        </button>
                                        <span style={{fontSize:16, marginLeft:20}}>{movie.unlikes}</span> 
                                        <button 
                                            onClick={() => {this.sendlike("unlikes", movie.id)}}
                                            style={{marginLeft:5}}
                                        >
                                            <AiOutlineDislike style={{fontSize:25}}/>
                                        </button>
                                        <br/><b>Description:</b>
                                        <br/>{movie.description}</p>
                                    </div>
                                </div>
                                </div>
                            </div>            
                        )
                    }
                )}
            </div>
            </div>
        );
  }
  
}

export default Home;
