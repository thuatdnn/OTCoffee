import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Card, CardBody, CardHeader, Col,
  Row, Table, ListGroup, ListGroupItem, Badge
} from 'reactstrap';
import Swal from 'sweetalert2';
import { socketConnect } from 'socket.io-react';
import { User } from '../../utils/user';
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
      collapse: {},
      isCustomer: User.role() == "customer",
      user: User.getCurrent(),
    };
    this.getTransactions = this.getTransactions.bind(this);
  }

  getTransactions = async () => {
    try {
      const { collapse, isCustomer, user } = this.state;

      const filter = {
        where: {
          softDelete: false,
        },
        include: [{
          relation: 'orders',
          scope: {
            include: 'product'
          }
        }], 
        transaction: 'createdAt ASC' 
      };
      if(isCustomer) filter.where.customerId = user.id;

      const transactions = await TransactionServices.getTransactions(filter);
      transactions.map(transaction => {
        const { orders } = transaction;
        transaction.price = 0;
        orders.map(order => {
          transaction.price += order.product.price * order.quantity;
        })
        collapse[transaction.id] = true;
      })
      this.setState({ transactions, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  componentDidMount() {
    const { user } = this.state;
    const { socket } = this.props;
    socket.on('new-transaction', data => {
      this.getTransactions();
    })
    
    socket.on((user.id + '/track-transaction'), data => {
      this.getTransactions();
    })
    this.getTransactions();
  }

  updateStatusTransaction = async (e, transaction, status) => {
    e.preventDefault();
    try {
      const result = await TransactionServices.updateTransactionStatus(
        transaction.id,
        status
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
        return [
          <Button className="btn-info text-white mr-1" size="sm" onClick={(e) => this.updateStatusTransaction(e, transaction, transactionStatus.processing)}>
            Accept
          </Button>,
          <Button className="btn-danger text-white mr-1" size="sm" onClick={(e) => this.updateStatusTransaction(e, transaction, transactionStatus.rejected)}>
            Reject
          </Button>
        ]
      case transactionStatus.processing:
        return (
          <Button className="btn-info text-white mr-1" size="sm" onClick={(e) => this.updateStatusTransaction(e, transaction, transactionStatus.done)}>
            Done
          </Button>
        )
      default:
        return (
          <Button className="btn-danger" size="sm" onClick={(e) => this.handleDeleteTransaction(e, transaction)}>
            <i className="icons icon-trash"/>
          </Button>
        )
    }
  }

  handleDeleteTransaction(e, transaction) {
    e.preventDefault();
    Swal({
      title: 'Are you sure?',
      text: `Did you want to remove transaction #${transaction.tranCode} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then( async (result) => {
      if (result.value) {
        await TransactionServices.deleteTransaction(transaction);
        this.getTransactions();
        Swal(
          'Done!',
          'Your transaction has been removed.',
          'success',
        );
      }
    });
  }

  handleCollapse(e, id) {
    console.log(e)
    const { collapse } = this.state;
    collapse[id] = !collapse[id];
    this.setState({ collapse });
  }

  render() {
    const {
      transactions, error, loading, collapse, isCustomer
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
            {error && <h6 className="text-center">An error occurred</h6>}
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
                      <th scope="col">Customer</th>
                      <th scope="col">Staff</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  {transactions.map((transaction, index) =>
                    <tbody>
                      <tr key={transaction.id} onClick={(e) => this.handleCollapse(e, transaction.id)}>
                        <td scope="col">#{transaction.tranCode || index}</td>
                        <td scope="col">{transaction.price}</td>
                        <td scope="col">{transaction.customer ? transaction.customer.name : 'N/A'}</td>
                        <td scope="col">{transaction.staff ? transaction.staff.name : 'N/A'}</td>
                        <td scope="col">
                          {this.renderStatus(transaction.status)}
                        </td>
                        <td>
                          {!isCustomer && this.renderButtonUpdateStatus(transaction)}
                          {/* <Button className="btn-primary text-white mr-1" size="sm" onClick={(e) => this.toggleModalTransaction(e, transaction)}>
                            <i className="icons icon-pencil"/>
                          </Button> */}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5}>
                          <h6>Order details:</h6>
                        </td>
                      </tr>
                      {transaction.orders.map(item => (
                        <tr>
                          <td colSpan={5}>
                            <div key={item.id} className="d-flex justify-content-between">
                              <span>{item.product.name}</span>
                              <span>{item.quantity} x {item.product.price}</span>
                              <span>{item.quantity * item.product.price}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                  {(!loading && transactions.length === 0) && (
                    <tbody>
                      <tr>
                        <td className="text-center" colSpan={6}>
                          There is no data.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default socketConnect(Transaction);
