import React from "react";
import pf from "petfinder-client";
import { navigate } from "@reach/router";
import Carousel from "./Carousel";
import Loadable from "react-loadable";
import Modal from "./Modal";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

// above Details
const loading = () => <h1>loading split code...</h1>;

const LoadableContent = Loadable({
  loader: () => import("./AdoptModalContent"),
  loading
});

class Details extends React.Component {
  state = {
    loading: true,
    showModal: false
  };
  componentDidMount() {
    petfinder.pet
      .get({
        output: "full",
        id: this.props.id
      })
      .then(data => {
        const pet = data.petfinder.pet;
        let breed;
        if (Array.isArray(pet.breeds.breed)) {
          breed = pet.breeds.breed.join(", ");
        } else {
          breed = pet.breeds.breed;
        }
        this.setState({
          name: pet.name,
          animal: pet.animal,
          breed,
          location: `${pet.contact.city}, ${pet.contact.state}`,
          description: pet.description,
          media: pet.media,
          loading: false
        });
      })
      .catch(() => {
        navigate("/");
      });
  }
  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  render() {
    if (this.state.loading) {
      return <h1> loading... </h1>;
    }
    const {
      name,
      animal,
      breed,
      location,
      description,
      media,
      showModal
    } = this.state;
    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>
            {animal} - {breed} - {location}
          </h2>
          <button onClick={this.toggleModal}>Adopt {name}</button>
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <LoadableContent toggleModal={this.toggleModal} name={name} />
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Details;
