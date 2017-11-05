import axios from 'axios';

import App from 'App';

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
        });

        it('should render <button />', function () {
            const buttonWrapper = wrapper.find('button').first();

            expect(wrapper).to.have.exactly(1).descendants('button');

            expect(buttonWrapper).to.have.prop('disabled').equal(false);
            expect(buttonWrapper).to.have.prop('onClick', wrapper.instance().handleButtonClick);
            expect(buttonWrapper).to.have.text('Activate Emotion Server');
        });
    });

    context('::button', function () {
        let buttonWrapper;
        let requestStub;
        let apiUrl;
        let successRes;
        let event;
        let clickSpy;

        beforeEach(function () {
            clickSpy = spy(App.prototype, 'handleButtonClick');
            wrapper = shallow(<App />);

            buttonWrapper = wrapper.find('button');
            requestStub = stub(axios, 'get');
            apiUrl = 'https://spooky-plague-26435.herokuapp.com/';
            successRes = JSON.stringify({index: "Hello World!"});
            event = { preventDefault: () => null };
        });

        afterEach(function () {
            requestStub.restore();
            clickSpy.restore();
        });

        it('should call handleButtonClick method when clicked', function () {
            buttonWrapper.simulate('click', event);

            expect(clickSpy).to.have.been.calledOnce;

            expect(wrapper).to.have.state('isPingingApi').equal(true);
            expect(wrapper.find('button').first()).text('Contacting Server...');

            expect(requestStub).to.have.been.calledWith(apiUrl);
        });

        it('should make HTTP request to API when clicked', function () {
            requestStub.withArgs(apiUrl).returns(successRes);

            buttonWrapper.simulate('click', event);

            // expect(wrapper).to.
        });
    });
});
