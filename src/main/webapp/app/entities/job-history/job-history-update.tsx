import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IJob } from 'app/shared/model/job.model';
import { getEntities as getJobs } from 'app/entities/job/job.reducer';
import { IDepartment } from 'app/shared/model/department.model';
import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { IEmployee } from 'app/shared/model/employee.model';
import { getEntities as getEmployees } from 'app/entities/employee/employee.reducer';
import { getEntity, updateEntity, createEntity, reset } from './job-history.reducer';
import { IJobHistory } from 'app/shared/model/job-history.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IJobHistoryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JobHistoryUpdate = (props: IJobHistoryUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { jobHistoryEntity, jobs, departments, employees, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/job-history');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getJobs();
    props.getDepartments();
    props.getEmployees();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.startDate = convertDateTimeToServer(values.startDate);
    values.endDate = convertDateTimeToServer(values.endDate);

    if (errors.length === 0) {
      const entity = {
        ...jobHistoryEntity,
        ...values,
        job: jobs.find(it => it.id.toString() === values.jobId.toString()),
        department: departments.find(it => it.id.toString() === values.departmentId.toString()),
        employee: employees.find(it => it.id.toString() === values.employeeId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="projectTemplatesApp.jobHistory.home.createOrEditLabel" data-cy="JobHistoryCreateUpdateHeading">
            Create or edit a JobHistory
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : jobHistoryEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="job-history-id">ID</Label>
                  <AvInput id="job-history-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="startDateLabel" for="job-history-startDate">
                  Start Date
                </Label>
                <AvInput
                  id="job-history-startDate"
                  data-cy="startDate"
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.jobHistoryEntity.startDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endDateLabel" for="job-history-endDate">
                  End Date
                </Label>
                <AvInput
                  id="job-history-endDate"
                  data-cy="endDate"
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.jobHistoryEntity.endDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="languageLabel" for="job-history-language">
                  Language
                </Label>
                <AvInput
                  id="job-history-language"
                  data-cy="language"
                  type="select"
                  className="form-control"
                  name="language"
                  value={(!isNew && jobHistoryEntity.language) || 'FRENCH'}
                >
                  <option value="FRENCH">FRENCH</option>
                  <option value="ENGLISH">ENGLISH</option>
                  <option value="SPANISH">SPANISH</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="job-history-job">Job</Label>
                <AvInput id="job-history-job" data-cy="job" type="select" className="form-control" name="jobId">
                  <option value="" key="0" />
                  {jobs
                    ? jobs.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="job-history-department">Department</Label>
                <AvInput id="job-history-department" data-cy="department" type="select" className="form-control" name="departmentId">
                  <option value="" key="0" />
                  {departments
                    ? departments.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="job-history-employee">Employee</Label>
                <AvInput id="job-history-employee" data-cy="employee" type="select" className="form-control" name="employeeId">
                  <option value="" key="0" />
                  {employees
                    ? employees.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/job-history" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  jobs: storeState.job.entities,
  departments: storeState.department.entities,
  employees: storeState.employee.entities,
  jobHistoryEntity: storeState.jobHistory.entity,
  loading: storeState.jobHistory.loading,
  updating: storeState.jobHistory.updating,
  updateSuccess: storeState.jobHistory.updateSuccess,
});

const mapDispatchToProps = {
  getJobs,
  getDepartments,
  getEmployees,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobHistoryUpdate);
