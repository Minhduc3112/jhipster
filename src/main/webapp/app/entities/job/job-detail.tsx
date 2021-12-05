import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './job.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJobDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JobDetail = (props: IJobDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { jobEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="jobDetailsHeading">Job</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{jobEntity.id}</dd>
          <dt>
            <span id="jobTitle">Job Title</span>
          </dt>
          <dd>{jobEntity.jobTitle}</dd>
          <dt>
            <span id="minSalary">Min Salary</span>
          </dt>
          <dd>{jobEntity.minSalary}</dd>
          <dt>
            <span id="maxSalary">Max Salary</span>
          </dt>
          <dd>{jobEntity.maxSalary}</dd>
          <dt>Task</dt>
          <dd>
            {jobEntity.tasks
              ? jobEntity.tasks.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.title}</a>
                    {jobEntity.tasks && i === jobEntity.tasks.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>Employee</dt>
          <dd>{jobEntity.employee ? jobEntity.employee.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/job" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/job/${jobEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ job }: IRootState) => ({
  jobEntity: job.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobDetail);
