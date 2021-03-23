const should = require('should');
const { keyBy } = require('lodash');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const { expect } = require('chai');
const sinonChai = require('sinon-chai');


describe('some test', () => {
	describe('test', () => {
		it('should invoke stub with lowecased props', () => {
			let sut = {
                r: ()=>{}
            }
            should(sut.r).be.a.Function();
		});
	});
});
