const chai = require("chai");
const chaiHttp = require("chai-http");
const Product = require("../model/product.model");
const ProductInfo = require("../model/product_info.model");
const Lookup = require("../model/lookUp.model");
let should = chai.should();

let server = require("../index");

const sequelize = require("../sequelize");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);

const productKey = [
  "uuid",
  "name",
  "price",
  "description",
  "picture",
  "createdAt",
  "updatedAt",
];

const product_info_key = [
  "uuid",
  "title",
  "description",
  "description2",
  "description3",
  "picture",
  "picture2",
  "picture3",
  "createdAt",
  "updatedAt",
  "ProductUuid",
];

let product;
let token;

describe("PRODUCT", () => {
  before(async () => {
    await sequelize.sync({ force: true });

    admin = await Lookup.create({
      email: "anthonin64@lookup.fr",
      password: "toto",
    });
    token = jwt.sign(
      {
        id: admin.dataValues.uuid,
        email: admin.dataValues.email,
      },
      process.env.secret,
      { expiresIn: "1h" }
    );

    product = await Product.create({
      name: "test",
      price: "10.5",
      description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
      picture: "https//www.test.fr/test.jpg",
    });

    product_info = await ProductInfo.create({
      title: "test",
      description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
      picture: "https//www.test.fr/test.jpg",
      picture2: "https//www.test.fr/test.jpg",
      picture3: "https//www.test.fr/test.jpg",
      description2: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
      description3: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
      ProductUuid: product.uuid
    });
  });

  describe("get all product", () => {
    it("should return an array of products", async () => {
      try {
        const res = await chai.request(server).get("/products");
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body[0].should.have.keys(productKey);
        res.body.length.should.be.eql(1);
      } catch (err) {
        throw err;
      }
    });
  });

  describe("get unique product", () => {
    it("should return an unique product", async () => {
      try {
        const res = await chai.request(server).get(`/products/${product.uuid}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(productKey);
      } catch (err) {
        throw err;
      }
    });
  });

  describe("get product_info with unique product", () => {
    it("should return an array of product_info with unique product", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/products/${product.uuid}/products_info`);
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body[0].should.have.keys(product_info_key);
        res.body.length.should.be.eql(1);
      } catch (err) {
        throw err;
      }
    });
  });

  describe("post a new product", () => {
    it("should create a new product", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/products")
          .set("Authorization", ` Bearer ${token}`)
          .send({
            name: "test2",
            price: "13",
            description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
            picture: "https//www.test.fr/test2.jpg",
          });
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.keys(productKey);
      } catch (err) {
        throw err;
      }
    });
  });

  describe("modify a product", () => {
    it("should modify a product", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/products/${product.uuid}`)
          .set("Authorization", ` Bearer ${token}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });

  describe("delete a single product", () => {
    it("should delete a single product", async () => {
      try {
        const res = await chai
          .request(server)
          .delete(`/products/${product.uuid}`)
          .set("Authorization", ` Bearer ${token}`);
        res.should.have.status(204);
        res.body.should.be.a("object");
      } catch (err) {
        throw err;
      }
    });
  });
});
