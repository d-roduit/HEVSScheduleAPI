const { request, expect } = require("./config");

describe("GET /classes/", () => {
    it("Returns an array of classes objects.", async () => {
        const response = await request.get("/classes");

        expect(response.statusCode).to.eql(200);
        expect(response.type).to.be.eql('application/json');

        const jsonData = response.body;

        expect(jsonData).to.be.an('array').that.is.not.empty;
        expect(jsonData[0]).to.be.an('object')
        expect(jsonData[0]).to.have.property('value').that.is.a('string');
        expect(jsonData[0]).to.have.property('text').that.is.a('string');
    });
});
