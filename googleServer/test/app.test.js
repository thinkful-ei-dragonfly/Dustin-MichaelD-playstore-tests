const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
  it('should return an array for GET /apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });
  it('should have a 400 status if an invalid genre is given', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'INVALID' })
      .expect(400);
  });

  it('should have a 400 status if an invalid sort is given', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'INVALID' })
      .expect(400);
  });

  it('each genre should include action if genres=action', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let it = true;
        let i = 0;
        while (i < res.body.length && it) {
          if (!res.body[i].Genres.toLowerCase().includes('action')) {
            it = false;
          }
          i++;
        }
        expect(it).to.be.true;
      });
  });

  it('should sort Rating in descending order', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let it = true;
        let i = 1;
        while(it && i < res.body.length){
          it = res.body[i].Rating <= res.body[i-1].Rating;
          i++;
        }
        expect(it).to.be.true;
      });
  });
});
