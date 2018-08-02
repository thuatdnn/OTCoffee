import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Container, Form,
  Input, FormGroup, Label, Row, FormFeedback,
  Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { User } from '../../utils/user';
import * as TableServices from '../../services/TableServices.js';

const initialTable = {
  name: '',
};

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      tables: [],
      modalTable: false,
      modalTable: false,
      currentTable: {},
      editingTable: initialTable,
      userRole: User.role()
    };
    this.getTables = this.getTables.bind(this);
    this.toggleModalTable = this.toggleModalTable.bind(this);
    this.toggleModalTable = this.toggleModalTable.bind(this);
    this.handleSubmitTable = this.handleSubmitTable.bind(this);
    this.handleSubmitTable = this.handleSubmitTable.bind(this);
  }

  getTables = async () => {
    this.setState({ loading: true });
    try {
      const tables = await TableServices.getTables();
      this.setState({ tables, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  componentDidMount() {
    this.getTables();
  }

  toggleModalTable(e, editingTable = initialTable) {
    if(e) e.preventDefault();
    this.setState(prevState => ({
      modalTable: !prevState.modalTable,
      editingTable: Object.assign({}, editingTable),
    }));
  }

  onInputTableChange(value, field) {
    const { editingTable } = this.state;
    editingTable[field] = value;
    this.setState({ editingTable });
  }

  handleSubmitTable = async (e) => {
    e.preventDefault();
    try {
      const { editingTable } = this.state;
      let req = TableServices.addTable;
      if (editingTable.id) {
        req = TableServices.updateTable;
      }
      const table = await req(editingTable);
      if(table) this.getTables();
      this.setState({ submitingTable: false });
      this.toggleModalTable();
    } catch(error) {
      this.setState({ error });
    }
  }

  handleSubmitTable = async (e) => {
    e.preventDefault();
    try {
      const { editingTable } = this.state;
      let req = TableServices.addTable;
      if (editingTable.id) {
        req = TableServices.updateTable;
      }
      const table = await req(editingTable);
      if(table) this.getTables();
      this.toggleModalTable();
    } catch(error) {
      this.setState({ error });
    }
  }

  updateStatusTable = async (e, table) => {
    e.preventDefault();
    try {
      const result = await TableServices.updateTable(
        table.id,
        Object.assign(
          {},
          table,
          { available: !table.available }
        )
      );
      if(result) this.getTables();
    } catch(error) {
      this.setState({ error });
    }
  }

  handleDeleteTable(e, table) {
    e.preventDefault();
    Swal({
      title: 'Are you sure?',
      text: `Did you want to remove table ${table.name} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then( async (result) => {
      if (result.value) {
        await TableServices.deleteTable(table);
        this.getTables();
        Swal(
          'Done!',
          'Your table has been removed.',
          'success',
        );
      }
    });
  }

  render() {
    const {
      tables, error, editingTable, userRole
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Row className="mb-3">
          <Col xs={12}>
            <Button className="float-right" onClick={this.toggleModalTable}>
              Add Table
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {error && <h6 className="text-center">An error occurred when loading this page</h6>}
            <Card className="animated fadeIn">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Tables
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table, index) =>
                      <tr key={table.id}>
                        <td scope="col">{index + 1}</td>
                        <td>Table {table.name}</td>
                        <td scope="col">
                          {
                            table.available ? (
                              "Empty"
                            ):(
                              "Serving"
                            )
                          }
                        </td>
                        <td>
                          <Button className="btn-info text-white mr-1" size="sm" onClick={(e) => this.updateStatusTable(e, table)}>
                            {table.available ? "Mark serving" : "Mark empty"}
                          </Button>
                          {userRole == "admin" && (
                            <Button className="btn-primary text-white mr-1" size="sm" onClick={(e) => this.toggleModalTable(e, table)}>
                              <i className="icons icon-pencil"/>
                            </Button>
                          )}
                          {userRole == "admin" && (
                            <Button className="btn-danger" size="sm" onClick={(e) => this.handleDeleteTable(e, table)}>
                              <i className="icons icon-trash"/>
                            </Button>
                          )}
                        </td>
                      </tr>
                    )}
                    {tables.length === 0 && (
                      <tr>
                        <td className="text-center" colSpan={4}>
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

        <Modal isOpen={this.state.modalTable} toggle={this.toggleModalTable}>
          <ModalHeader toggle={this.toggleModalTable}>
            {editingTable.id ? `Edit Table` : `Add Table`}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmitTable}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="table-name"
                  placeholder="Enter Table Number"
                  value={editingTable.name}
                  onChange={(e) => this.onInputTableChange(e.target.value, 'name')}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmitTable}>Submit</Button>
            <Button color="secondary" onClick={this.toggleModalTable}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Tables;
