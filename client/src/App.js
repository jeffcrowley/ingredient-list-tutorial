import React, { Component } from "react";
import {
  Container,
  Header,
  Icon,
  Divider,
  Button,
  Segment,
  Dimmer,
  Loader
} from "semantic-ui-react";

class App extends Component {
  state = {
    drinkList: {},
    drinkInstructions: {}
  };

  componentDidMount() {
    console.log("mounted!");
    this.getDrinkList();
  }

  fetch(endpoint) {
    return window
      .fetch(endpoint)
      .then(response => response.json())
      .catch(error => console.log(error));
  }

  getDrinkList() {
    this.fetch("/api/drinks").then(list => {
      if (list.length) {
        console.log(`List!: ${JSON.stringify(list)}`);
        this.setState({ drinkList: list });
        this.getDrinkInstructions(list[0].id);
      } else {
        console.log("No list :(");
      }
    });
  }

  getDrinkInstructions(drinkId) {
    this.fetch(`/api/drinks/${drinkId}`).then(drink =>
      this.setState({ drinkInstructions: drink })
    );
  }

  render() {
    let drinkList = this.state.drinkList;
    let drinkInstructions = this.state.drinkInstructions;
    return drinkList ? (
      <Container text>
        <Header as="h2" icon textAlign="center" color="blue">
          <Icon name="unordered list" circular />
          <Header.Content>Ingredient List</Header.Content>
        </Header>
        <Divider hidden section />
        {drinkList && drinkList.length ? (
          <Button.Group color="blue" fluid widths={drinkList.length}>
            {Object.keys(drinkList).map(key => {
              return (
                <Button
                  active={
                    drinkInstructions &&
                    drinkInstructions.id === drinkList[key].id
                  }
                  fluid
                  key={key}
                  onClick={() => this.getDrinkInstructions(drinkList[key].id)}
                >
                  {drinkList[key].title}
                </Button>
              );
            })}
          </Button.Group>
        ) : (
          <Container textAlign="center">No drinks found</Container>
        )}
        <Divider section />
        {drinkInstructions && ( //Not sure what this does
          <Container>
            <Header as="h2">{drinkInstructions.title}</Header>
            <p>{drinkInstructions.description}</p>
            {drinkInstructions.ingredients && ( //Not sure what this does, but if I don't have it, it doesn't work
              <Segment.Group>
                {drinkInstructions.ingredients.map((ingredient, i) => (
                  <Segment key={i}>{ingredient.description}</Segment>
                ))}
              </Segment.Group>
            )}
            {drinkInstructions.steps && <p>{drinkInstructions.steps}</p>}
            {drinkInstructions.source && (
              <Button
                basic
                size="tiny"
                color="blue"
                href={drinkInstructions.source}
              >
                Source
              </Button>
            )}
          </Container>
        )}
      </Container>
    ) : (
      <Container text>
        <Dimmer active inverted>
          <Loader content="Loading..." />
        </Dimmer>
      </Container>
    );
  }
}

export default App;
