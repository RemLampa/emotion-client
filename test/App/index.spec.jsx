import axios from 'axios';

import App from 'App';
import API_ROOT from 'configs/api.config';

const eventObj = { preventDefault: () => null };
const apiResponse = {
    success: {
        data: JSON.stringify({
            index: 'Hello World!',
        }),
        status: 200,
        statusText: 'OK',
    },
    fail: null,
};

describe('App', function () {
    let wrapper;

    beforeEach(function () {
        wrapper = shallow(<App />);
    });

    it('should be a div', function () {
        expect(wrapper).to.have.type('div');
    });

    context('Initial State', function () {
        it('should have proper initial state', function () {
            expect(wrapper).to.have.state('isApiAwake').equal(false);
            expect(wrapper).to.have.state('isPingingApi').equal(false);
            expect(wrapper).to.have.state('error').equal(null);
        });

        it('should render <button />', function () {
            const button = wrapper.find('button').first();

            expect(wrapper).to.have.exactly(1).descendants('button');

            expect(button).to.have.prop('disabled').equal(false);
            expect(button).to.have.prop('onClick', wrapper.instance().handleButtonClick);
            expect(button).to.have.text('Activate Emotion Server');
        });

        it('should not show errors', function () {
            expect(wrapper).to.not.have.descendants('.error');
        });
    });

    context('::button', function () {
        let requestStub;
        let event;
        let clickSpy;

        beforeEach(function () {
            clickSpy = spy(App.prototype, 'handleButtonClick');
            requestStub = stub(axios, 'get').resolves(apiResponse.success);
            wrapper = shallow(<App />);
            event = eventObj;
        });

        afterEach(function () {
            clickSpy.restore();
            requestStub.restore();
        });

        it('should call handleButtonClick method when clicked', function () {
            wrapper.find('button').simulate('click', event);

            expect(clickSpy).to.have.been.calledOnce;
        });

        it('should change text and be disabled when app is pinging API', function () {
            wrapper.setState({ isPingingApi: true });

            const button = wrapper.find('button');

            expect(button).to.have.text('Contacting Server...');

            expect(button).to.have.prop('disabled').equal(true);
        });
    });

    context('::handleButtonClick()', function () {
        let instance;
        let requestStub;
        let event;

        beforeEach(function () {
            instance = wrapper.instance();
            requestStub = stub(axios, 'get');
            event = eventObj;
        });

        afterEach(function () {
            requestStub.restore();
        });

        it('should set proper initial on-call state', function () {
            requestStub.resolves(apiResponse.success);

            instance.handleButtonClick(event);
            expect(wrapper).to.have.state('isPingingApi').equal(true);
        });

        it('should call backend API', function () {
            requestStub.resolves(apiResponse.success);

            instance.handleButtonClick(event);

            expect(requestStub).to.have.been.calledWith(API_ROOT);
        });

        it('should set proper success state', function () {
            requestStub.resolves(apiResponse.success);

            return instance.handleButtonClick(event).then(function () {
                expect(wrapper).to.have.state('isApiAwake').equal(true);
                expect(wrapper).to.have.state('isPingingApi').equal(false);
                expect(wrapper).to.have.state('error').equal(null);
            });
        });

        it('should set proper fail state', function () {
            requestStub.rejects();

            return instance.handleButtonClick(event).then(function () {
                expect(wrapper).to.have.state('isApiAwake').equal(false);
                expect(wrapper).to.have.state('isPingingApi').equal(false);
                expect(wrapper).to.have.state('error').equal('Could not connect to server.');
            });
        });
    });

    context('Error Handling', function () {
        it('should render error text', function () {
            const errorMessage = 'Error Message';

            wrapper.setState({ error: errorMessage });

            expect(wrapper).to.have.exactly(1).descendants('.error');
            expect(wrapper.find('.error')).to.have.text(errorMessage);
        });
    });
});
