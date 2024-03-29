import mongoose from "mongoose";
import supertest from "supertest";
import 'dotenv/config'
import * as chai from "chai";
import assert from "assert";
import { describe, it, beforeEach } from 'mocha';
import userModel from "../../models/users.models.js";
import { generateToken } from "../../utils/jwt.js";

const app = await mongoose.connect("mongodb+srv://fzelionelenzi:coderhousefzelionelenzi@cluster0.z3ja11i.mongodb.net/?retryWrites=true&w=majority")

const {expect} = chai

const requester = supertest('http://localhost:4000')

describe("Tests de Productos", async function() {

    it('Test endpoint: GET /api/products/, se espera un array de productos', async () => {
        const response = await requester.get('/api/products/')
        expect(response._body.docs).to.be.an('array')
    })

})