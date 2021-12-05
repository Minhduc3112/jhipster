import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IJob, defaultValue } from 'app/shared/model/job.model';

export const ACTION_TYPES = {
  FETCH_JOB_LIST: 'job/FETCH_JOB_LIST',
  FETCH_JOB: 'job/FETCH_JOB',
  CREATE_JOB: 'job/CREATE_JOB',
  UPDATE_JOB: 'job/UPDATE_JOB',
  PARTIAL_UPDATE_JOB: 'job/PARTIAL_UPDATE_JOB',
  DELETE_JOB: 'job/DELETE_JOB',
  RESET: 'job/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IJob>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type JobState = Readonly<typeof initialState>;

// Reducer

export default (state: JobState = initialState, action): JobState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_JOB_LIST):
    case REQUEST(ACTION_TYPES.FETCH_JOB):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_JOB):
    case REQUEST(ACTION_TYPES.UPDATE_JOB):
    case REQUEST(ACTION_TYPES.DELETE_JOB):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_JOB):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_JOB_LIST):
    case FAILURE(ACTION_TYPES.FETCH_JOB):
    case FAILURE(ACTION_TYPES.CREATE_JOB):
    case FAILURE(ACTION_TYPES.UPDATE_JOB):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_JOB):
    case FAILURE(ACTION_TYPES.DELETE_JOB):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOB_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOB):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_JOB):
    case SUCCESS(ACTION_TYPES.UPDATE_JOB):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_JOB):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_JOB):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/jobs';

// Actions

export const getEntities: ICrudGetAllAction<IJob> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_JOB_LIST,
    payload: axios.get<IJob>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IJob> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_JOB,
    payload: axios.get<IJob>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IJob> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_JOB,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IJob> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_JOB,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IJob> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_JOB,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IJob> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_JOB,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
