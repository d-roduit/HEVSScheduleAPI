import api from "../api.mjs";
import supertest from "supertest";

const request = supertest(api);
export { request };
export { expect } from "chai";
