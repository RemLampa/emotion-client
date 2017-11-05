import React, { Component } from 'react';
import axios from 'axios';

import API_ROOT from 'configs/api.config';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            isApiAwake: false,
            isPingingApi: false,
            error: null,
        };

        this.API_ROOT = API_ROOT;

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderError = this.renderError.bind(this);
    }

    handleButtonClick(e) {
        e.preventDefault();

        this.setState({
            isPingingApi: true,
            error: null,
        });

        return axios.get(this.API_ROOT)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ isApiAwake: true });
                } else {
                    throw new Error('Could not connect to server.');
                }
            })
            .catch(() => {
                this.setState({ error: 'Could not connect to server.' });
            })
            .then(() => {
                this.setState({ isPingingApi: false });
            });
    }

    renderUI() {
        const { isApiAwake } = this.state;

        return isApiAwake
            ? ''
            : this.renderButton();
    }

    renderButton() {
        const isDisabled = this.state.isPingingApi;

        return (
            <button onClick={this.handleButtonClick} disabled={isDisabled}>
                { isDisabled ? 'Contacting Server...' : 'Activate Emotion Server' }
            </button>
        );
    }

    renderError() {
        const { error } = this.state;

        return error
            ? <div className="error">{error}</div>
            : null;
    }

    render() {
        return (
            <div>
                { this.renderError() }
                { this.renderUI() }
            </div>
        );
    }
}
