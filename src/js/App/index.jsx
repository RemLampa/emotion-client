import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {
    constructor () {
        super();

        this.state = {
            isApiAwake: false,
            isPingingApi: false
        };

        this.apiUrl = 'https://spooky-plague-26435.herokuapp.com/';

        this.renderButton = this.renderButton.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    renderUI () {
        const { isApiAwake } = this.state;

        return isApiAwake
            ? ''
            : this.renderButton();
    }

    renderButton () {
        const isDisabled = this.state.isPingingApi;

        return (
            <button onClick={this.handleButtonClick} disabled={isDisabled}>
                { isDisabled ? 'Contacting Server...' : 'Activate Emotion Server' }
            </button>
        );
    }

    handleButtonClick (e) {
        e.preventDefault();

        console.log('yes');
        this.setState({isPingingApi: true});

        return axios.get(this.apiUrl);
    }

    render () {
        return (
            <div>
                { this.renderUI() }
            </div>
        );
    }
};
