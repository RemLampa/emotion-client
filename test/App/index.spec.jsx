import App from 'App';

describe('App', function () {
    let component;

    beforeEach(function () {
        component = shallow(<App />);
    });

    it('should render "Hello World"', function () {
        expect(component).to.have.type('h1');
        expect(component).to.have.text('Hello World!');
    });
});
