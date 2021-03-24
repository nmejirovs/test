const should = require('should');
const { keyBy } = require('lodash');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const { expect } = require('chai');
const sinonChai = require('sinon-chai');



describe('blogs service test', () => {
	let blogsDbMock, usersDbMock, usersServiceMock, getAllBlogsStub, getUsersNamesStub;

	before(() => {
		getAllBlogsStub = sinon.stub();
		getUsersNamesStub = sinon.stub()
		blogsDbMock = {
			getAllBlogs: getAllBlogsStub
		};
		usersServiceMock = {};
		usersDbMock = {
			getUsersNames: getUsersNamesStub
		};
	});
	describe('Gett all blogs test', () => {

		it('should return right enriched blogs list', async () => {

			const sut = proxyquire('../lib/services/blogs_service', {
				'../db/blogs_db': blogsDbMock,
				'../db/users_db': usersDbMock,
				'./users_service': usersServiceMock
			});

			blogsDbMock.getAllBlogs.resolves([{
				title: 'someTitle',
				content: 'Blog content Blog content Blog content Blog content Blog content Blog content Blog content Blog content',
				author_id: 1,
				createdAt: '2021-03-23 08:00:00',
				updatedAt: '2021-03-24 08:00:00'
			},
			{
				title: 'someTitle1',
				content: 'Blog1 content Blog content Blog content Blog content Blog content Blog content Blog content Blog content',
				author_id: 2,
				createdAt: '2021-03-23 08:00:00',
				updatedAt: '2021-03-24 08:00:00'
			}]);

			usersDbMock.getUsersNames.resolves([{
				id: 1, 
				username: 'user one'
			},
			{
				id: 2, 
				username: 'user two'
			}]);

			const result = await sut.getAllBlogs(2);
			
			result.should.be.deepEqual([
				{
				  title: 'someTitle',
				  content: 'Blog content Blog content Blog content Blog content Blog content Blog content Blog content Blog content',
				  author: 'user one',
				  createdAt: '2021-03-23 08:00:00',
				  updatedAt: '2021-03-24 08:00:00'
				},
				{
				  title: 'someTitle1',
				  content: 'Blog1 content Blog content Blog content Blog content Blog content Blog content Blog content Blog content',
				  author: 'user two',
				  createdAt: '2021-03-23 08:00:00',
				  updatedAt: '2021-03-24 08:00:00'
				}
			  ]);
		});
	});
});
