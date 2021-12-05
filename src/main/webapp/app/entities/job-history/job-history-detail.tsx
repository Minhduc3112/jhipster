import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './job-history.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJobHistoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JobHistoryDetail = (props: IJobHistoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { jobHistoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="jobHistoryDetailsHeading">JobHistory</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{jobHistoryEntity.id}</dd>
          <dt>
            <span id="startDate">Start Date</span>
          </dt>
          <dd>
            {jobHistoryEntity.startDate ? <TextFormat value={jobHistoryEntity.startDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endDate">End Date</span>
          </dt>
          <dd>{jobHistoryEntity.endDate ? <TextFormat value={jobHistoryEntity.endDate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="language">Language</span>
          </dt>
          <dd>{jobHistoryEntity.language}</dd>
          <dt>Job</dt>
          <dd>{jobHistoryEntity.job ? jobHistoryEntity.job.id : ''}</dd>
          <dt>Department</dt>
          <dd>{jobHistoryEntity.department ? jobHistoryEntity.department.id : ''}</dd>
          <dt>Employee</dt>
          <dd>{jobHistoryEntity.employee ? jobHistoryEntity.employee.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/job-history" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/job-history/${jobHistoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ jobHistory }: IRootState) => ({
  jobHistoryEntity: jobHistory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobHistoryDetail);
