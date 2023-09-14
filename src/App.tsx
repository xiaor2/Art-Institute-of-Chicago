import './App.css'
import * as React from "react";
import axios from 'axios';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'

library.add(fas)

export default function App() {

  const [url, setUrl] = React.useState();
  
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ListView setUrl={setUrl}/>} />
          <Route path="/detail" element={<DetailView id={url} setUrl={setUrl}/>} />
          <Route path="/gallery" element={<Gallery setUrl={setUrl}/>} />
        </Route>
      </Routes>
    </div>
  )
}

function Layout() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg myNav">
        <div className="container-fluid myNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Search</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/gallery">Gallery</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

type myState = {
  artworks: any[],
  query: string,
  sort: string,
  url: string,
}

class ListView extends React.Component<any> {

  state: myState = {
    artworks: [],
    query: '',
    sort: '',
    url: ''
  }

  componentDidMount() {
    axios.get('https://api.artic.edu/api/v1/artworks?limit=100').then(response => {
      let filteredArtworks = response.data.data.filter((post:any) => {
        if (post.image_id != null) {
          return post;
        }
        return null;
      })
      return this.setState({artworks: filteredArtworks, url: response.data.config.iiif_url})
    })
    .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <div className="heading">
          <h1>Art Institute of Chicago</h1>
        </div>
        <div className="wrap">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="What are you looking for?" onChange={event => this.setState({query : event.target.value })} />
            <div className="input-group-text" id="basic-addon2">
              <FontAwesomeIcon icon={findIconDefinition({ prefix: 'fas', iconName: 'search' })} />
            </div>
          </div>
          <select className="form-select" onChange={event => this.setState({ sort : event.target.value })}>
              <option value="" disabled selected>Sort By</option>
              <option value="sortById1">Id: Ascending</option>
              <option value="sortById2">Id: Descending</option>
              <option value="sortByAlphabet1">Title: Ascending</option>
              <option value="sortByAlphabet2">Title: Descending</option>
            </select>
        </div>
        <div className="searchResult">
          {
            this.state.artworks.filter(post => {
              let id:string = String(post.id);
              if (this.state.query === '') {
                return post;
              } else if (post.title.toLowerCase().includes(this.state.query.toLowerCase())
              || id.toLowerCase().includes(this.state.query.toLowerCase())) {
                return post; 
              }
              return null;
            }).sort((a, b) => {
              if (this.state.sort === 'sortById1') {
                if (a.id < b.id) {
                  return -1;
                } else if (a.id > b.id) {
                  return 1;
                } else {
                  return 0;
                }
              } else if (this.state.sort === 'sortById2') {
                if (a.id < b.id) {
                  return 1;
                } else if (a.id > b.id) {
                  return -1;
                } else {
                  return 0;
                }
              } else if (this.state.sort === 'sortByAlphabet1') {
                if (a.title.toLowerCase() < b.title.toLowerCase()) {
                  return -1;
                } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                  return 1;
                } else {
                  return 0;
                }
              } else if (this.state.sort === 'sortByAlphabet2') {
                if (a.title.toLowerCase() < b.title.toLowerCase()) {
                  return 1;
                } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                  return -1;
                } else {
                  return 0;
                }
              }
              return 0
            }).map((post, index) => (
              <Link to="/detail" className="my-box card mb-3" key={index} onClick={() => this.props.setUrl(post.id)}>
                <div className="row g-0">
                  <div className="col-md-5">
                    <img src={this.state.url + '/' + post.image_id + '/full/843,/0/default.jpg'} className=" rounded-start pic" alt="..." />
                  </div>
                  <div className="col-md-7 row">
                    <div className="list-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text t">ID: {post.id}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    )
  }
}

type myState2 = {
  artworks: any[],
  url: string,
  type: string,
}

class Gallery extends React.Component<any> {
  state: myState2 = {
    artworks: [],
    url: '',
    type: 'All',
  }

  componentDidMount() {
    axios.get('https://api.artic.edu/api/v1/artworks?limit=100').then(response => {
      let filteredArtworks = response.data.data.filter((post:any) => {
        if (post.image_id != null) {
          return post;
        }
        return null;
      })
      return this.setState({artworks: filteredArtworks, url: response.data.config.iiif_url})
    })
    .catch(error => console.log(error));
  }

  render() {
    return (      
    <div className="panel">
      <div className="type">
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "All"})}>All</button>
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "Print"})}>Print</button>
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "Painting"})}>Painting</button>
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "Textile"})}>Textile</button>
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "Photograph"})}>Photograph</button>
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "Sculpture"})}>Sculpture</button>
        <button type="submit" className="btn btn-light" onClick={() => this.setState({type: "Drawing and Watercolor"})}>Drawing and Watercolor</button>
      </div>
      <div className="gallery">
      {
        this.state.artworks.filter((post) => {
          if (this.state.type === "All") {
            return post
          } else if (this.state.type === post.artwork_type_title) {
            return post;
          }
          return null;
        })
        .map((post, index) => (
          <Link to="/detail" state={index} className="grid" key={index} onClick={() => this.props.setUrl(post.id)}>
            <img className="pic" src={this.state.url + '/' + post.image_id + '/full/843,/0/default.jpg'} alt="gallery images"/>
          </Link>
        ))
      }
      </div>
    </div>)
  }
}

type myState3 = {
  artworks: any[],
  id: string,
  type: string,
  url: string
  ids: any[],
}

class DetailView extends React.Component<any> {
  state: myState3 = {
    artworks: [],
    id: this.props.id,
    type: 'All',
    url: '',
    ids: []
  }

  componentDidMount() {
    axios.get('https://api.artic.edu/api/v1/artworks?limit=100').then(response => {
      let filteredArtworks = response.data.data.filter((post:any) => {
        if (post.image_id != null) {
          return post;
        }
        return null;
      })
      let ids = filteredArtworks.map((post:any) => post.id)
      this.setState({artworks: response.data.data, url: response.data.config.iiif_url, ids: ids});
  })
    .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="detail-card">
        <h1 className="detail-title">Artwork Detail</h1>
        <div className="btns">
          <button className="btn btn-light" onClick={() => {
            let prevId
            if (this.state.ids.indexOf(this.state.id) - 1 < 0)
              prevId = this.state.ids[this.state.ids.length - 1]
            else {
              prevId = this.state.ids[this.state.ids.indexOf(this.state.id) - 1]
            }
            console.log(prevId)
            this.setState({id: prevId})} }>Prev</button>
          <button className="btn btn-light" onClick={() => {
            let prevId
            if (this.state.ids.indexOf(this.state.id) + 1 > this.state.ids.length - 1)
              prevId = this.state.ids[0]
            else {
              prevId = this.state.ids[this.state.ids.indexOf(this.state.id) + 1]
            }
            console.log(prevId)
            this.setState({id: prevId})} }>Next</button>
        </div>
        {
          this.state.artworks.filter(post => (post.id === this.state.id)).map((post, index) => (
            <div className="details" key={index} >
              <img className="pic" src={this.state.url + '/' + post.image_id + '/full/843,/0/default.jpg'} alt="gallery images"/>
              <p>Id: {post.id}</p>
              <p>Artist: {post.artist_title}</p>
              <p>Type: {post.artwork_type_title}</p>
              <p>Credit: {post.credit_line}</p>
            </div>
          ))
        }
      </div>
    )
  }
}
