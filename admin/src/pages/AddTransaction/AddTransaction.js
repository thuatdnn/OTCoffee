import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Container, Form,
  Input, FormGroup, Label, Row, FormFeedback,
  Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import randomstring from 'randomstring';
import { User } from '../../utils/user';
import * as TransactionServices from '../../services/TransactionServices.js';

const initialTransaction = {
  staffId: User.getCurrent().id,
  tranCode: randomstring.generate({ length: 6, charset: 'alphanumeric', capitalization: 'uppercase' }),
}

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      categories: [],
      orders: {},
      editingTransaction: initialTransaction,
    };
    this.getCategories = this.getCategories.bind(this);
    this.handleSubmitTransaction = this.handleSubmitTransaction.bind(this);
  }

  getCategories = async () => {
    try {
      const categories = await TransactionServices.getCategories();
      this.setState({ categories });
    } catch (error) {
      this.setState({ error });
    }
  }

  componentDidMount() {
    this.getCategories();
  }

  onInputChange(value, field) {
    const { editingTransaction } = this.state;
    editingTransaction[field] = value;
    this.setState({ editingTransaction });
  }

  handleSubmitTransaction = async (e) => {
    try {
      const { editingTransaction, orders } = this.state;
      const transaction = await TransactionServices.addTransaction(editingTransaction);
      if(transaction) {
        const linkOrderReqs = [];
        Object.keys(orders).map(async item => {
          const order = orders[item];
          linkOrderReqs.push(TransactionServices.linkOrder(transaction.id, order));
        })
        await Promise.all(linkOrderReqs);
        this.props.history.push('/transaction')
      }
    } catch(error) {
      this.setState({ error });
    }
  }

  increaseProduct(productId) {
    const { orders } = this.state;
    if(!orders[productId]) {
      orders[productId] = {
        quantity: 1,
        productId: productId
      }
    } else {
      orders[productId].quantity += 1;
    }
    this.setState({ orders });
  }

  decreaseProduct(productId) {
    const { orders } = this.state;
    if(!orders[productId]) {
      return;
    } else {
      orders[productId].quantity -= 1;
    }
    if(orders[productId].quantity == 0) {
      delete orders[productId];
    }
    this.setState({ orders });
  }

  render() {
    const {
      categories, error, orders, editingTransaction,
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12} style={{minHeight: 50}}>
            New Transaction #{editingTransaction.tranCode}
            {Object.keys(orders).length > 0 && (
              <Button className="btn-success float-right mb-3 animated fadeIn fadeOut" onClick={() => this.handleSubmitTransaction()}>
                Submit
              </Button>
            )}
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
                              <Button onClick={() => this.decreaseProduct(product.id)}>
                                -
                              </Button>
                              <input value={orders[product.id] ? orders[product.id].quantity : 0} type="number" style={{width: 32, height: 35}} />
                              <Button onClick={() => this.increaseProduct(product.id)}>
                                +
                              </Button>
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
      </div>
    );
  }
}

export default Transaction;
