const { request, expect } = require("./config");
const dateUtility = require('../utility/dateUtility');

describe("GET /schedule", () => {
    it("Returns a 404 HTTP status code for no endpoint found", async () => {
        const response = await request.get("/schedule");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });
});

describe("GET /schedule//", () => {
    it("Returns a 404 HTTP status code for no endpoint found", async () => {
        const response = await request.get("/schedule//");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });
});

describe("GET /schedule/:class", () => {
    it("/schedule/%20 : Returns a 404 HTTP status code for the empty class parameter", async () => {
        const response = await request.get("/schedule/%20");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });

    it("/schedule/000_F : Returns a 404 HTTP status code for the unknown class", async () => {
        const response = await request.get("/schedule/000_F");

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });

    it("/schedule/Z_604_F : Returns a 200 HTTP status code with an empty object", async () => {
        const response = await request.get("/schedule/Z_604_F");

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object').that.is.empty;
    });

    it("/schedule/603_F : Returns the schedule of the 603_F class for the current day", async () => {
        const response = await request.get("/schedule/603_F");

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });

    it("/schedule/604_F : Returns the schedule of the 604_F class for the current day", async () => {
        const response = await request.get("/schedule/604_F");

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });
});

const currentDate = dateUtility.toApiParamFormat(new Date());

describe('GET /schedule/:class/:date', () => {
    it('/schedule/604_F/-- : returns 404 HTTP status', async () => {
        const response = await request.get('/schedule/604_F/--');

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it('/schedule/604_F/notADate : returns 404 HTTP status', async () => {
        const response = await request.get('/schedule/604_F/notADate');

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

     it('/schedule/604_F/06-02-2 : returns 404 HTTP status', async () => {
        const response = await request.get('/schedule/604_F/06-02-2');

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it('/schedule/604_F/06-02-2020 : returns 404 HTTP status', async () => {
        const response = await request.get('/schedule/604_F/06-02-2020');

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it('/schedule/604_F/2020-03-06 : returns 404 HTTP status', async () => {
        const response = await request.get('/schedule/604_F/2020-03-06');

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message');
    });

    it(`/schedule/604_F/${currentDate} : Returns the schedule of the 604_F class on the ${currentDate}`, async () => {
        const response = await request.get(`/schedule/604_F/${currentDate}`);

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });

    it(`/schedule/604_F/2021-04-15 : Returns the schedule of the 604_F class on the 2021-04-15`, async () => {
        const response = await request.get(`/schedule/604_F/2021-04-15`);

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

    it(`/schedule/604_F/ == GET /schedule/604_F/${currentDate} : Check if request with no parameter == request with default parameter`, async () => {
        const response1 = await request.get('/schedule/604_F');

        expect(response1.statusCode).to.eql(200);
        expect(response1.type).to.be.eql('application/json');

        const jsonData1 = response1.body;

        expect(jsonData1).to.be.an('object');
        expect(jsonData1).to.not.have.property('message');

        const response2 = await request.get(`/schedule/604_F/${currentDate}`);

        expect(response2.statusCode).to.eql(200);
        expect(response2.type).to.be.eql('application/json');

        const jsonData2 = response2.body;

        expect(jsonData2).to.be.an('object');
        expect(jsonData2).to.not.have.property('message');

        expect(jsonData1).to.eql(jsonData2);
    });

    it('/schedule/604_F/53 : Returns a 404 HTTP status code for the inexistant 53th week', async () => {
        const response = await request.get('/schedule/604_F/53');

        expect(response.statusCode).to.eql(404);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.have.property('message').that.is.a('string');
    });

    const currentWeekNumber = dateUtility.getWeek();

    it(`/schedule/604_F/${currentWeekNumber} : Returns the schedule of the 604_F class on the ${currentWeekNumber}th week`, async () => {
        const response = await request.get(`/schedule/604_F/${currentWeekNumber}`);

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('object');
        expect(jsonData).to.not.have.property('message');
    });
});
