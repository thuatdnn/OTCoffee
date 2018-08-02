import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Card, CardBody, CardHeader, Col, Container, Form,
  Input, FormGroup, Label, Row, FormFeedback,
  Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Swal from 'sweetalert2';
import * as TransactionServices from '../../services/TransactionServices.js';

const transactionStatus = {
  rejected: -1,
  pending: 0,
  processing: 1,
  done: 2
}

const initialTransaction = {
  name: '',
  price: '',
  desciption: '',
}

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      categories: [],
      transactions: [],
      modalTransaction: false,
      editingTransaction: initialTransaction,
    };
    this.getTransactions = this.getTransactions.bind(this);
  }

  getTransactions = async () => {
    try {
      const transactions = await TransactionServices.getTransactions();
      transactions.map(transaction => {
        const { orders } = transaction;
        transaction.price = 0;
        orders.map(order => {
          transaction.price += order.product.price * order.quantity;
        })
      })
      this.setState({ transactions });
    } catch (error) {
      this.setState({ error });
    }
  }

  componentDidMount() {
    this.getTransactions();
  }

  updateStatusTransaction = async (e, transaction, status) => {
    e.preventDefault();
    try {
      const result = await TransactionServices.updateTransaction(
        transaction.id,
        Object.assign(
          {},
          transaction,
          { status: status }
        )
      );
      if(result) this.getTransactions();
    } catch(error) {
      this.setState({ error });
    }
  }

  renderStatus(status) {
    switch(status) {
      case transactionStatus.rejected:
        return (
         "Rejected" 
        )
      case transactionStatus.done:
        return (
          "Done"
        )
      case transactionStatus.pending:
        return (
          "Pending"
        )
      case transactionStatus.processing:
        return (
          "Processing"
        )
    }
  }

  renderButtonUpdateStatus(transaction) {
    switch(transaction.status) {
      case transactionStatus.pending:
        return (
          <Button className="btn-info text-white mr-1" size="sm" onClick={(e) => this.updateStatusTransaction(e, transaction, transactionStatus.processing)}>
            Accept
          </Button>
        )
      case transactionStatus.processing:
        return (
          <Button className="btn-info text-white mr-1" size="sm" onClick={(e) => this.updateStatusTransaction(e, transaction, transactionStatus.done)}>
            Done
          </Button>
        )
    }
  }

  render() {
    const {
      transactions, error, currentCategory, editingTransaction,
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Row className="mb-3">
          <Col xs={12}>
            <Link to="/add-transaction">
              <Button className="float-right">
                Add Transaction
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {error && <h6 className="text-center">An error occurred when loading this page</h6>}
            <Card className="animated fadeIn">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Transactions
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) =>
                      <tr key={transaction.id}>
                        <td scope="col">#{transaction.tranCode || index}</td>
                        <td scope="col">{transaction.price}</td>
                        <td scope="col">
                          {this.renderStatus(transaction.status)}
                        </td>
                        <td>
                          {this.renderButtonUpdateStatus(transaction)}
                          {/* <Button className="btn-primary text-white mr-1" size="sm" onClick={(e) => this.toggleModalTransaction(e, transaction)}>
                            <i className="icons icon-pencil"/>
                          </Button> */}
                          {/* <Button className="btn-danger" size="sm" onClick={(e) => this.handleDeleteTransaction(e, transaction)}>
                            <i className="icons icon-trash"/>
                          </Button> */}
                        </td>
                      </tr>
                    )}
                    {transactions.length === 0 && (
                      <tr>
                        <td className="text-center" colSpan={6}>
                          There is no data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Transaction;
