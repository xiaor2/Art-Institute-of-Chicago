import "./App.css";
import * as React from "react";
import axios from "axios";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

library.add(fas);

export default function App() {
  const [url, setUrl] = React.useState();

  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ListView setUrl={setUrl} />} />
          <Route
            path="/detail"
            element={<DetailView id={url} setUrl={setUrl} />}
          />
          <Route path="/gallery" element={<Gallery setUrl={setUrl} />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Navbar
        fixed="top"
        expand="lg"
        className="myNav"
        style={{ color: "white" }}
      >
        <Container>
          <Navbar.Brand
            style={{
              color: "white",
            }}
          >
            Art Institute of Chicago
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Search
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  to="/gallery"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Gallery
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

type myState = {
  artworks: any[];
  query: string;
  sort: string;
  url: string;
};

class ListView extends React.Component<any> {
  state: myState = {
    artworks: [],
    query: "",
    sort: "",
    url: "",
  };

  componentDidMount() {
    axios
      .get("https://api.artic.edu/api/v1/artworks?limit=100")
      .then((response) => {
        let filteredArtworks = response.data.data.filter((post: any) => {
          if (post.image_id != null) {
            console.log(post)
            return post;
          }
          return null;
        });
        return this.setState({
          artworks: filteredArtworks,
          url: response.data.config.iiif_url,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <Container fluid>
          <Row style={{ marginTop: "70px" }}>
            <Col xs={0} sm={4} xl={5} />
            <Col xs={12} sm={4} xl={2}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Art_Institute_of_Chicago_logo.svg/1200px-Art_Institute_of_Chicago_logo.svg.png"
                fluid
              />
            </Col>
            <Col xs={0} sm={4} xl={5} />
          </Row>
          <div
            style={{ marginLeft: "10%", marginRight: "10%", marginTop: "1rem" }}
          >
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                aria-label="Search bar"
                placeholder="What are you looking for?"
                onChange={(event) =>
                  this.setState({ query: event.target.value })
                }
              />
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon={findIconDefinition({
                    prefix: "fas",
                    iconName: "search",
                  })}
                />
              </InputGroup.Text>
            </InputGroup>
            <Form.Select
              aria-label="Default select example"
              onChange={(event) => this.setState({ sort: event.target.value })}
            >
              <option value="" disabled selected>
                Sort By
              </option>
              <option value="sortById1">Id: Ascending</option>
              <option value="sortById2">Id: Descending</option>
              <option value="sortByAlphabet1">Title: Ascending</option>
              <option value="sortByAlphabet2">Title: Descending</option>
            </Form.Select>

            {this.state.artworks
              .filter((post) => {
                let id: string = String(post.id);
                if (this.state.query === "") {
                  return post;
                } else if (
                  post.title
                    .toLowerCase()
                    .includes(this.state.query.toLowerCase()) ||
                  id.toLowerCase().includes(this.state.query.toLowerCase())
                ) {
                  return post;
                }
                return null;
              })
              .sort((a, b) => {
                if (this.state.sort === "sortById1") {
                  if (a.id < b.id) {
                    return -1;
                  } else if (a.id > b.id) {
                    return 1;
                  } else {
                    return 0;
                  }
                } else if (this.state.sort === "sortById2") {
                  if (a.id < b.id) {
                    return 1;
                  } else if (a.id > b.id) {
                    return -1;
                  } else {
                    return 0;
                  }
                } else if (this.state.sort === "sortByAlphabet1") {
                  if (a.title.toLowerCase() < b.title.toLowerCase()) {
                    return -1;
                  } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                    return 1;
                  } else {
                    return 0;
                  }
                } else if (this.state.sort === "sortByAlphabet2") {
                  if (a.title.toLowerCase() < b.title.toLowerCase()) {
                    return 1;
                  } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                    return -1;
                  } else {
                    return 0;
                  }
                }
                return 0;
              })
              .map((post, index) => (
                <Link
                  to="/detail"
                  key={index}
                  onClick={() => this.props.setUrl(post.id)}
                >
                  <Row>
                    <Col xs={0} md={3} lg={4} />
                    <Col xs={12} md={6} lg={4} >
                      <Card
                        style={{
                          maxWidth: "100%",
                          marginTop: "1rem",
                        }}
                      >
                        <Card.Img
                          src={
                            this.state.url +
                            "/" +
                            post.image_id +
                            "/full/843,/0/default.jpg"
                          }
                        />
                        <Card.Body>
                          <Card.Title>{post.title}</Card.Title>
                          <Card.Text>ID: {post.id}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xs={0} md={3} lg={4}/>
                  </Row>
                </Link>
              ))}
          </div>
        </Container>
      </div>
    );
  }
}

type myState2 = {
  artworks: any[];
  url: string;
  type: string;
};

class Gallery extends React.Component<any> {
  state: myState2 = {
    artworks: [],
    url: "",
    type: "All",
  };

  componentDidMount() {
    axios
      .get("https://api.artic.edu/api/v1/artworks?limit=100")
      .then((response) => {
        let filteredArtworks = response.data.data.filter((post: any) => {
          if (post.image_id != null) {
            return post;
          }
          return null;
        });
        return this.setState({
          artworks: filteredArtworks,
          url: response.data.config.iiif_url,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <Container style={{ marginTop: "70px" }}>
        <Row>
          <Col xs={0} sm={3} />
          <Col xs={12} sm={6}>
            <Form.Select
              aria-label="Default select example"
              onChange={(event) => this.setState({ type: event.target.value })}
            >
              <option value="All">All</option>
              <option value="Print">Print</option>
              <option value="Painting">Painting</option>
              <option value="Textile">Textile</option>
              <option value="Photograph">Photograph</option>
              <option value="Sculpture">Sculpture</option>
              <option value="Drawing and Watercolor">
                Drawing and Watercolor
              </option>
            </Form.Select>
          </Col>
          <Col xs={0} sm={3} />
        </Row>
        <div className="gallery">
          {this.state.artworks
            .filter((post) => {
              if (this.state.type === "All") {
                return post;
              } else if (this.state.type === post.artwork_type_title) {
                return post;
              }
              return null;
            })
            .map((post, index) => (
              <Link
                to="/detail"
                state={index}
                className="grid"
                key={index}
                onClick={() => this.props.setUrl(post.id)}
              >
                <img
                  className="pic"
                  src={
                    this.state.url +
                    "/" +
                    post.image_id +
                    "/full/843,/0/default.jpg"
                  }
                  alt="gallery images"
                />
              </Link>
            ))}
        </div>
      </Container>
    );
  }
}

type myState3 = {
  artworks: any[];
  id: string;
  type: string;
  url: string;
  ids: any[];
};

class DetailView extends React.Component<any> {
  state: myState3 = {
    artworks: [],
    id: this.props.id,
    type: "All",
    url: "",
    ids: [],
  };

  componentDidMount() {
    axios
      .get("https://api.artic.edu/api/v1/artworks?limit=100")
      .then((response) => {
        let filteredArtworks = response.data.data.filter((post: any) => {
          if (post.image_id != null) {
            return post;
          }
          return null;
        });
        let ids = filteredArtworks.map((post: any) => post.id);
        this.setState({
          artworks: response.data.data,
          url: response.data.config.iiif_url,
          ids: ids,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="detail-card">
        <h1 className="detail-title">Artwork Detail</h1>
        <div className="btns">
          <button
            className="btn btn-light"
            onClick={() => {
              let prevId;
              if (this.state.ids.indexOf(this.state.id) - 1 < 0)
                prevId = this.state.ids[this.state.ids.length - 1];
              else {
                prevId =
                  this.state.ids[this.state.ids.indexOf(this.state.id) - 1];
              }
              console.log(prevId);
              this.setState({ id: prevId });
            }}
          >
            Prev
          </button>
          <button
            className="btn btn-light"
            onClick={() => {
              let prevId;
              if (
                this.state.ids.indexOf(this.state.id) + 1 >
                this.state.ids.length - 1
              )
                prevId = this.state.ids[0];
              else {
                prevId =
                  this.state.ids[this.state.ids.indexOf(this.state.id) + 1];
              }
              console.log(prevId);
              this.setState({ id: prevId });
            }}
          >
            Next
          </button>
        </div>
        {this.state.artworks
          .filter((post) => post.id === this.state.id)
          .map((post, index) => (
            <div className="details" key={index}>
              <img
                className="pic"
                src={
                  this.state.url +
                  "/" +
                  post.image_id +
                  "/full/843,/0/default.jpg"
                }
                alt="gallery images"
              />
              <p>Id: {post.id}</p>
              <p>Artist: {post.artist_title}</p>
              <p>Type: {post.artwork_type_title}</p>
              <p>Credit: {post.credit_line}</p>
            </div>
          ))}
      </div>
    );
  }
}
