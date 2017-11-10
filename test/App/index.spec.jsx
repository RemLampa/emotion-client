import axios from 'axios';

import App from 'App';
import API_ROOT from 'configs/api.config';

import EmotionForm from 'EmotionForm';

const eventObj = { preventDefault: () => null };
const apiResponse = {
    success: {
        data: JSON.stringify({
            index: 'Hello World!',
        }),
        status: 200,
        statusText: 'OK',
    },
    fail: {
        data: null,
        status: 404,
        statusText: 'Not Found',
    },
};

describe('App', function () {
    beforeEach(function () {
        this.wrapper = shallow(<App />);
    });

    it('should be a div', function () {
        expect(this.wrapper).to.have.type('div');
    });

    context('Initial State', function () {
        it('should have proper initial state', function () {
            expect(this.wrapper).to.have.state('isApiAwake').equal(false);
            expect(this.wrapper).to.have.state('isPingingApi').equal(false);
            expect(this.wrapper).to.have.state('error').equal(null);
        });

        it('should render button to activate API', function () {
            this.button = this.wrapper.find('button').first();

            expect(this.wrapper).to.have.exactly(1).descendants('button');

            expect(this.button).to.have.id('activate-button');
            expect(this.button).to.have.prop('disabled').equal(false);
            expect(this.button).to.have.prop('onClick', this.wrapper.instance().handleButtonClick);
            expect(this.button).to.have.text('Activate Emotion Server');
        });

        it('should not render <EmotionForm />', function () {
            expect(this.wrapper).to.not.have.descendants(EmotionForm);
        });

        it('should not show errors', function () {
            expect(this.wrapper).to.not.have.descendants('.error');
        });
    });

    context('::button', function () {
        beforeEach(function () {
            this.clickSpy = spy(App.prototype, 'handleButtonClick');
            this.requestStub = stub(axios, 'get').resolves(apiResponse.success);
            this.wrapper = shallow(<App />);
            this.event = eventObj;
        });

        afterEach(function () {
            this.clickSpy.restore();
            this.requestStub.restore();
        });

        it('should call handleButtonClick method when clicked', function () {
            this.wrapper.find('button').simulate('click', this.event);

            expect(this.clickSpy).to.have.been.calledOnce;
        });

        it('should change text and be disabled when app is pinging API', function () {
            this.wrapper.setState({ isPingingApi: true });

            this.button = this.wrapper.find('button');

            expect(this.button).to.have.text('Contacting Server...');

            expect(this.button).to.have.prop('disabled').equal(true);
        });
    });

    context('::handleButtonClick()', function () {
        beforeEach(function () {
            this.instance = this.wrapper.instance();
            this.requestStub = stub(axios, 'get');
            this.event = eventObj;
        });

        afterEach(function () {
            this.requestStub.restore();
        });

        it('should set proper initial on-call state', function () {
            this.requestStub.resolves(apiResponse.success);

            this.instance.handleButtonClick(this.event);
            expect(this.wrapper).to.have.state('isPingingApi').equal(true);
        });

        it('should call backend API', function () {
            this.requestStub.resolves(apiResponse.success);

            this.instance.handleButtonClick(this.event);

            expect(this.requestStub).to.have.been.calledWith(API_ROOT);
        });

        it('should set proper success state', function () {
            this.requestStub.resolves(apiResponse.success);

            return this.instance.handleButtonClick(this.event).then(function () {
                expect(this.wrapper).to.have.state('isApiAwake').equal(true);
                expect(this.wrapper).to.have.state('isPingingApi').equal(false);
                expect(this.wrapper).to.have.state('error').equal(null);
            }.bind(this));
        });

        it('should set proper non-200 state', function () {
            this.requestStub.resolves(apiResponse.fail);

            return this.instance.handleButtonClick(this.event).then(function () {
                expect(this.wrapper).to.have.state('isApiAwake').equal(false);
                expect(this.wrapper).to.have.state('isPingingApi').equal(false);
                expect(this.wrapper).to.have.state('error').equal('Could not connect to server.');
            }.bind(this));
        });

        it('should set proper fail state', function () {
            this.requestStub.rejects();

            return this.instance.handleButtonClick(this.event).then(function () {
                expect(this.wrapper).to.have.state('isApiAwake').equal(false);
                expect(this.wrapper).to.have.state('isPingingApi').equal(false);
                expect(this.wrapper).to.have.state('error').equal('Could not connect to server.');
            }.bind(this));
        });
    });

    context('Error Handling', function () {
        it('should render error text', function () {
            const errorMessage = 'Error Message';

            this.wrapper.setState({ error: errorMessage });

            expect(this.wrapper).to.have.exactly(1).descendants('.error');
            expect(this.wrapper.find('.error')).to.have.text(errorMessage);
        });
    });

    context('API Server Awake', function () {
        beforeEach(function () {
            this.wrapper.setState({ isApiAwake: true });
        });

        it('should not render a button to activate api', function () {
            expect(this.wrapper).to.not.have.descendants('#activate-button');
        });

        it('should render <EmotionForm />', function () {
            expect(this.wrapper).to.have.exactly(1).descendants(EmotionForm);
        });
    });
});
