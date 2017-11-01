import raf from 'tempPolyfills';

import React from 'react';

import chai, { expect } from 'chai';
import sinon, { spy, stub, mock } from 'sinon';
import { mount, render, shallow, configure } from 'enzyme';

import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';

import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
chai.use(sinonChai);

configure({ adapter: new Adapter() });

global.raf = raf;

global.React = React;

global.expect = expect;

global.sinon = sinon;
global.spy = spy;
global.stub = stub;
global.mock = mock;

global.mount = mount;
global.render = render;
global.shallow = shallow;
