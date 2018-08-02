import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Container, Form,
  Input, FormGroup, Label, Row, FormFeedback,
  Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { User } from '../../utils/user';
import * as StaffServices from '../../services/StaffServices.js';

const initialStaff = {
  name: '',
  username: '',
  password: '',
  role: 'staff'
};

const initialStaffToReset = {
  password: ''
}

class Staffs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      staffs: [],
      modalStaff: false,
      modalSetPassword: false,
      currentStaff: {},
      editingStaff: initialStaff,
      staffToReset: initialStaffToReset,
      userRole: User.role()
    };
    this.getStaffs = this.getStaffs.bind(this);
    this.toggleModalStaff = this.toggleModalStaff.bind(this);
    this.toggleModalSetPassword = this.toggleModalSetPassword.bind(this);
    this.handleSubmitStaff = this.handleSubmitStaff.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
    this.onInputSetPassChange = this.onInputSetPassChange.bind(this);
    this.onInputStaffChange = this.onInputStaffChange.bind(this);
  }

  getStaffs = async () => {
    this.setState({ loading: true });
    try {
      const staffs = await StaffServices.getStaffs();
      this.setState({ staffs, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  componentDidMount() {
    this.getStaffs();
  }

  toggleModalStaff(e, editingStaff = initialStaff) {
    if(e) e.preventDefault();
    this.setState(prevState => ({
      modalStaff: !prevState.modalStaff,
      editingStaff: Object.assign({}, editingStaff),
    }));
  }

  toggleModalSetPassword(e, staffToReset = initialStaffToReset) {
    if(e) e.preventDefault();
    this.setState(prevState => ({
      modalSetPassword: !prevState.modalSetPassword,
      staffToReset: Object.assign({}, staffToReset),
    }));
  }

  onInputStaffChange(value, field) {
    const { editingStaff } = this.state;
    editingStaff[field] = value;
    this.setState({ editingStaff });
  }

  onInputSetPassChange(value, field) {
    const { staffToReset } = this.state;
    staffToReset[field] = value;
    this.setState({ staffToReset });
  }

  handleSubmitStaff = async (e) => {
    e.preventDefault();
    try {
      const { editingStaff } = this.state;
      let req = StaffServices.addStaff;
      if (editingStaff.id) {
        req = StaffServices.updateStaff;
      }
      const staff = await req(editingStaff);
      if(staff) this.getStaffs();
      this.setState({ submitingStaff: false });
      this.toggleModalStaff();
    } catch(error) {
      this.setState({ error });
    }
  }

  handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const { staffToReset } = this.state;
      const staff = await StaffServices.updateStaff(staffToReset);
      if(staff) this.getStaffs();
      this.toggleModalSetPassword();
    } catch(error) {
      this.setState({ error });
    }
  }

  updateStatusStaff = async (e, staff) => {
    e.preventDefault();
    try {
      const result = await StaffServices.updateStaff(
        staff.id,
        Object.assign(
          {},
          staff,
          { available: !staff.available }
        )
      );
      if(result) this.getStaffs();
    } catch(error) {
      this.setState({ error });
    }
  }

  handleDeleteStaff(e, staff) {
    e.preventDefault();
    Swal({
      title: 'Are you sure?',
      text: `Did you want to remove staff ${staff.name} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then( async (result) => {
      if (result.value) {
        await StaffServices.deleteStaff(staff);
        this.getStaffs();
        Swal(
          'Done!',
          'Your staff has been removed.',
          'success',
        );
      }
    });
  }

  render() {
    const {
      staffs, error, editingStaff, userRole, loading, staffToReset
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Row className="mb-3">
          <Col xs={12}>
            <Button className="float-right" onClick={this.toggleModalStaff}>
              Add Staff
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {error && <h6 className="text-center">An error occurred</h6>}
            <Card className="animated fadeIn">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Staffs
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Username</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {staffs.map((staff, index) =>
                      <tr key={staff.id}>
                        <td scope="col">{index + 1}</td>
                        <td>{staff.name}</td>
                        <td scope="col">
                          {staff.username}
                        </td>
                        <td>
                          {userRole == "admin" && (
                            <Button className="btn-primary text-white mr-1" size="sm" onClick={(e) => this.toggleModalSetPassword(e, staff)}>
                              Set password
                            </Button>
                          )}
                          {userRole == "admin" && (
                            <Button className="btn-primary text-white mr-1" size="sm" onClick={(e) => this.toggleModalStaff(e, staff)}>
                              <i className="icons icon-pencil"/>
                            </Button>
                          )}
                          {userRole == "admin" && (
                            <Button className="btn-danger" size="sm" onClick={(e) => this.handleDeleteStaff(e, staff)}>
                              <i className="icons icon-trash"/>
                            </Button>
                          )}
                        </td>
                      </tr>
                    )}
                    {(!loading && staffs.length === 0) && (
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

        <Modal isOpen={this.state.modalStaff} toggle={this.toggleModalStaff}>
          <ModalHeader toggle={this.toggleModalStaff}>
            {editingStaff.id ? `Edit Staff` : `Add Staff`}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmitStaff}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="staff-name"
                  placeholder="Enter Staff Name"
                  value={editingStaff.name}
                  onChange={(e) => this.onInputStaffChange(e.target.value, 'name')}
                />
              </FormGroup>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  name="staff-name"
                  placeholder="Enter Staff Username"
                  value={editingStaff.username}
                  onChange={(e) => this.onInputStaffChange(e.target.value, 'username')}
                />
              </FormGroup>
              {!editingStaff.id && (
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="staff-name"
                    placeholder="Enter Staff Password"
                    value={editingStaff.password}
                    onChange={(e) => this.onInputStaffChange(e.target.value, 'password')}
                  />
                </FormGroup>
              )}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmitStaff}>Submit</Button>
            <Button color="secondary" onClick={this.toggleModalStaff}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalSetPassword} toggle={this.toggleModalSetPassword}>
          <ModalHeader toggle={this.toggleModalSetPassword}>
            Set new password for {staffToReset.name}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmitStaff}>
              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  name="staff-name"
                  placeholder="Enter New Password"
                  value={staffToReset.password}
                  onChange={(e) => this.onInputSetPassChange(e.target.value, 'password')}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmitPassword}>Submit</Button>
            <Button color="secondary" onClick={this.toggleModalSetPassword}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Staffs;
