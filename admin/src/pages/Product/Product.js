import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Container, Form,
  Input, FormGroup, Label, Row, FormFeedback,
  Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { User } from '../../utils/user';
import * as ProductServices from '../../services/ProductServices.js';

const initialCategory = {
  name: '',
};

const initialProduct = {
  name: '',
  price: '',
  desciption: '',
}

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      categories: [],
      modalCategory: false,
      modalProduct: false,
      currentCategory: {},
      editingCategory: initialCategory,
      editingProduct: initialProduct,
      isAdmin: User.role() === "admin",
    };
    this.getCategories = this.getCategories.bind(this);
    this.toggleModalCategory = this.toggleModalCategory.bind(this);
    this.toggleModalProduct = this.toggleModalProduct.bind(this);
    this.handleSubmitCategory = this.handleSubmitCategory.bind(this);
    this.handleSubmitProduct = this.handleSubmitProduct.bind(this);
  }

  getCategories = async () => {
    this.setState({ loading: true });
    try {
      const categories = await ProductServices.getCategories();
      this.setState({ categories, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  componentDidMount() {
    this.getCategories();
  }

  toggleModalCategory(e, editingCategory = initialCategory) {
    if(e) e.preventDefault();
    this.setState(prevState => ({
      modalCategory: !prevState.modalCategory,
      editingCategory: Object.assign({}, editingCategory),
    }));
  }

  toggleModalProduct(e, currentCategory = {}, editingProduct = initialProduct) {
    if(e) e.preventDefault();
    this.setState(prevState => ({
      modalProduct: !prevState.modalProduct,
      currentCategory,
      editingProduct: Object.assign({}, editingProduct),
    }));
  }

  onInputCategoryChange(value, field) {
    const { editingCategory } = this.state;
    editingCategory[field] = value;
    this.setState({ editingCategory });
  }

  onInputProductChange(value, field) {
    const { editingProduct } = this.state;
    editingProduct[field] = value;
    this.setState({ editingProduct });
  }

  handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      const { editingCategory } = this.state;
      let req = ProductServices.addCategory;
      if (editingCategory.id) {
        req = ProductServices.updateCategory;
      }
      const category = await req(editingCategory);
      if(category) this.getCategories();
      this.setState({ submitingCategory: false });
      this.toggleModalCategory();
    } catch(error) {
      this.setState({ error });
    }
  }

  handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const { editingProduct, currentCategory } = this.state;
      let req = ProductServices.addProduct;
      if (editingProduct.id) {
        req = ProductServices.updateProduct;
      }
      const product = await req(currentCategory.id, editingProduct);
      if(product) this.getCategories();
      this.setState({ submitingProduct: false });
      this.toggleModalProduct();
    } catch(error) {
      this.setState({ error });
    }
  }

  updateStatusProduct = async (e, category, product) => {
    e.preventDefault();
    try {
      const result = await ProductServices.updateProduct(
        category.id,
        Object.assign(
          {},
          product,
          { available: !product.available }
        )
      );
      if(result) this.getCategories();
    } catch(error) {
      this.setState({ error });
    }
  }

  handleDeleteCategory(e, category) {
    e.preventDefault();
    Swal({
      title: 'Are you sure?',
      text: `Did you want to remove category ${category.name} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then( async (result) => {
      if (result.value) {
        await ProductServices.deleteCategory(category);
        this.getCategories();
        Swal(
          'Done!',
          'Your category has been removed.',
          'success',
        );
      }
    });
  }

  handleDeleteProduct(e, category, product) {
    e.preventDefault();
    Swal({
      title: 'Are you sure?',
      text: `Did you want to remove ${product.name} out of ${category.name} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then( async (result) => {
      if (result.value) {
        await ProductServices.deleteProduct(category.id, product);
        this.getCategories();
        Swal(
          'Done!',
          'Your product has been removed.',
          'success',
        );
      }
    });
  }

  render() {
    const {
      categories, error, currentCategory, editingCategory, editingProduct, isAdmin,
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Row className="mb-3">
          <Col xs={12}>
            {isAdmin && <Button className="float-right" onClick={this.toggleModalCategory}>
              Add Category
            </Button>}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {error && <h6 className="text-center">An error occurred</h6>}
            {
              categories.map(category => (
                <Card key={category.id} className="animated fadeIn">
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> {category.name || 'N/A'}
                    {isAdmin && (
                      <div className="card-header-actions">
                        <a href="#" className="card-header-action" onClick={(e) => this.toggleModalProduct(e, category)}>Add Product</a>{` | `}
                        <a href="#" className="card-header-action" onClick={(e) => this.toggleModalCategory(e, category)}>Edit</a>{` | `}
                        <a href="#" className="card-header-action" onClick={(e) => this.handleDeleteCategory(e, category)}>Delete</a>
                      </div>
                    )}
                  </CardHeader>
                  <CardBody>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Price</th>
                          <th scope="col">Available</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {category.products.map((product, index) =>
                          <tr key={product.id}>
                            <td scope="col">{index + 1}</td>
                            <td scope="col">{product.name}</td>
                            <td scope="col">{product.description}</td>
                            <td scope="col">{product.price}</td>
                            <td scope="col">
                              {
                                product.available ? (
                                  <i className="fa fa-check" />
                                ):(
                                  <i className="fa fa-close" />
                                )
                              }
                            </td>
                            <td>
                              <Button className="btn-info text-white mr-1" size="sm" onClick={(e) => this.updateStatusProduct(e, category, product)}>
                                {product.available ? "Mark unavailable" : "Mark available"}
                              </Button>
                              {isAdmin && (
                                <Button className="btn-primary text-white mr-1" size="sm" onClick={(e) => this.toggleModalProduct(e, category, product)}>
                                  <i className="icons icon-pencil"/>
                                </Button>
                              )}
                              {isAdmin && (
                                <Button className="btn-danger" size="sm" onClick={(e) => this.handleDeleteProduct(e, category, product)}>
                                  <i className="icons icon-trash"/>
                                </Button>
                              )}
                            </td>
                          </tr>
                        )}
                        {category.products.length === 0 && (
                          <tr>
                            <td className="text-center" colSpan={6}>
                              This category has no product.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              ))
            }
          </Col>
        </Row>

        <Modal isOpen={this.state.modalCategory} toggle={this.toggleModalCategory}>
          <ModalHeader toggle={this.toggleModalCategory}>
            {editingCategory.id ? `Edit Category` : `Add Category`}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmitCategory}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="category-name"
                  placeholder="Enter Category Name"
                  value={editingCategory.name}
                  onChange={(e) => this.onInputCategoryChange(e.target.value, 'name')}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmitCategory}>Submit</Button>
            <Button color="secondary" onClick={this.toggleModalCategory}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalProduct} toggle={this.toggleModalProduct}>
          <ModalHeader toggle={this.toggleModalCategory}>
            {currentCategory.name} <small>- {editingProduct.id ? `Edit Product` : "Add Product"}</small>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmitProduct}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="product-name"
                  placeholder="Enter Product Name"
                  value={editingProduct.name}
                  onChange={(e) => this.onInputProductChange(e.target.value, 'name')}
                />
              </FormGroup>
              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="text"
                  name="product-price"
                  placeholder="Enter Product Price"
                  value={editingProduct.price}
                  onChange={(e) => this.onInputProductChange(e.target.value, 'price')}
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="textarea"
                  name="product-description"
                  placeholder="Enter Product Description"
                  value={editingProduct.description}
                  onChange={(e) => this.onInputProductChange(e.target.value, 'description')}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmitProduct}>Submit</Button>
            <Button color="secondary" onClick={this.toggleModalProduct}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Product;
