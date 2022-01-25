/*
    ------- WARNING -------

    Some test that involve dates could in certain particular cases fail.

    It is due to the fact that the tests don't cover all the edge cases,
    such as if you query against a weekend day and thus has no entry on the HEVS website,
    or if the schedule of the current day does not appear anymore on the HEVS website because
    you run the test after the work hours.

    Ideally, the edge cases should also be taken into account, but for the moment, this is sufficient to spot breaking changes.
*/

import { request, expect } from './config.mjs';
import dateUtility from '../utility/dateUtility.mjs';

const currentWeekNumber = dateUtility.getWeek();
const currentClass = (currentWeekNumber <= 30) ? 'HEG - 604_F' : 'HEG - 603_F';
const currentDate = new Date();
const dateInFuture = (currentWeekNumber <= 30) ? new Date(currentDate.getFullYear(), 4, 20) : new Date(currentDate.getFullYear(), 10, 20);
const dateInFutureApiFormat = dateUtility.toApiParamFormat(dateInFuture);
const currentDateApiFormat = dateUtility.toApiParamFormat(currentDate);

describe("GET /schedule", function() {
    it("Returns a 404 HTTP status code for no endpoint found", async function() {
        const response = await request.get("/schedule");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });
});

describe("GET /schedule//", function() {
    it("Returns a 404 HTTP status code for no endpoint found", async function() {
        const response = await request.get("/schedule//");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });
});

describe("GET /schedule/:class", function() {
    it("/schedule/%20 : Returns a 404 HTTP status code for the empty class parameter", async function() {
        const response = await request.get("/schedule/%20");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });

    it("/schedule/HEG - 000_F : Returns a 404 HTTP status code for the unknown class", async function() {
        const response = await request.get("/schedule/HEG - 000_F");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });

    it(`/schedule/${currentClass} : Returns the schedule of the ${currentClass} class for the current day`, async function() {
        const response = await request.get(`/schedule/${currentClass}`);

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });
});

describe('GET /schedule/:class/:date', function() {
    it(`/schedule/${currentClass}/-- : returns 404 HTTP status`, async function() {
        const response = await request.get(`/schedule/${currentClass}/--`);

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it(`/schedule/${currentClass}/notADate : returns 404 HTTP status`, async function() {
        const response = await request.get(`/schedule/${currentClass}/notADate`);

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

     it(`/schedule/${currentClass}/06-02-2 : returns 404 HTTP status`, async function() {
        const response = await request.get(`/schedule/${currentClass}/06-02-2`);

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it(`/schedule/${currentClass}/06-02-2020 : returns 404 HTTP status`, async function() {
        const response = await request.get(`/schedule/${currentClass}/06-02-2020`);

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it(`/schedule/${currentClass}/2020-03-06 : returns 404 HTTP status`, async function() {
        const response = await request.get(`/schedule/${currentClass}/2020-03-06`);

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it(`/schedule/${currentClass}/${currentDateApiFormat} : Returns the schedule of the ${currentClass} class on the ${currentDateApiFormat}`, async function() {
        const response = await request.get(`/schedule/${currentClass}/${currentDateApiFormat}`);

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });

    it(`/schedule/${currentClass}/${dateInFutureApiFormat} : Returns the schedule of the ${currentClass} class on the ${dateInFutureApiFormat}`, async function() {
        const response = await request.get(`/schedule/${currentClass}/${dateInFutureApiFormat}`);

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('date').that.is.a('string');
        expect(jsonData).to.have.property('courses').that.is.an('array');
        expect(jsonData['courses']).to.have.lengthOf.within(1,8);

        const firstCourseObject = jsonData['courses'][0];

        expect(firstCourseObject).to.be.an('object');
        expect(firstCourseObject).to.have.property('startTime').that.is.a('string');
        expect(firstCourseObject).to.have.property('endTime').that.is.a('string');
        expect(firstCourseObject).to.have.property('classes').that.is.an('array');
        expect(firstCourseObject['classes']).to.have.lengthOf.within(1,2);

        expect(firstCourseObject).to.have.property('teachers').that.is.an('array');
        expect(firstCourseObject['teachers']).to.have.lengthOf.within(1,3);

        expect(firstCourseObject).to.have.property('location').that.is.a('string');
        expect(firstCourseObject).to.have.property('courseTitle').that.is.a('string');
    });

    /*
        Warning : This test could fail if you run it the evening
        (evening = after the course are finished), because the HES-SO
        will only display the schedule for the next day.
    */

    it(`/schedule/${currentClass}/ == GET /schedule/${currentClass}/${currentDateApiFormat} : Check if request with no parameter == request with default parameter`, async function() {
        const response1 = await request.get(`/schedule/${currentClass}`);

        expect(response1.statusCode).to.eql(200);
        expect(response1.type).to.be.eql('application/json');

        const jsonData1 = response1.body;

        expect(jsonData1).to.be.an('object');
        expect(jsonData1).to.not.have.property('message');

        const response2 = await request.get(`/schedule/${currentClass}/${currentDateApiFormat}`);

        expect(response2.statusCode).to.eql(200);
        expect(response2.type).to.be.eql('application/json');

        const jsonData2 = response2.body;

        expect(jsonData2).to.be.an('object');
        expect(jsonData2).to.not.have.property('message');

        expect(jsonData1).to.eql(jsonData2);
    });

    it(`/schedule/${currentClass}/53 : Returns a 404 HTTP status code for the inexistant 53th week`, async function() {
        const response = await request.get(`/schedule/${currentClass}/53`);

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });

    it(`/schedule/${currentClass}/${currentWeekNumber} : Returns the schedule of the ${currentClass} class on the ${currentWeekNumber}th week`, async function() {
        const response = await request.get(`/schedule/${currentClass}/${currentWeekNumber}`);

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });
});
