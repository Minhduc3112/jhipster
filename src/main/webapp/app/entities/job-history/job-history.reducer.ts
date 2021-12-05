import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IJobHistory, defaultValue } from 'app/shared/model/job-history.model';

export const ACTION_TYPES = {
  FETCH_JOBHISTORY_LIST: 'jobHistory/FETCH_JOBHISTORY_LIST',
  FETCH_JOBHISTORY: 'jobHistory/FETCH_JOBHISTORY',
  CREATE_JOBHISTORY: 'jobHistory/CREATE_JOBHISTORY',
  UPDATE_JOBHISTORY: 'jobHistory/UPDATE_JOBHISTORY',
  PARTIAL_UPDATE_JOBHISTORY: 'jobHistory/PARTIAL_UPDATE_JOBHISTORY',
  DELETE_JOBHISTORY: 'jobHistory/DELETE_JOBHISTORY',
  RESET: 'jobHistory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IJobHistory>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type JobHistoryState = Readonly<typeof initialState>;

// Reducer

export default (state: JobHistoryState = initialState, action): JobHistoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_JOBHISTORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_JOBHISTORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_JOBHISTORY):
    case REQUEST(ACTION_TYPES.UPDATE_JOBHISTORY):
    case REQUEST(ACTION_TYPES.DELETE_JOBHISTORY):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_JOBHISTORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_JOBHISTORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_JOBHISTORY):
    case FAILURE(ACTION_TYPES.CREATE_JOBHISTORY):
    case FAILURE(ACTION_TYPES.UPDATE_JOBHISTORY):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_JOBHISTORY):
    case FAILURE(ACTION_TYPES.DELETE_JOBHISTORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOBHISTORY_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_JOBHISTORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_JOBHISTORY):
    case SUCCESS(ACTION_TYPES.UPDATE_JOBHISTORY):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_JOBHISTORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_JOBHISTORY):
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

const apiUrl = 'api/job-histories';

// Actions

export const getEntities: ICrudGetAllAction<IJobHistory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_JOBHISTORY_LIST,
    payload: axios.get<IJobHistory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IJobHistory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_JOBHISTORY,
    payload: axios.get<IJobHistory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IJobHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_JOBHISTORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IJobHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_JOBHISTORY,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IJobHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_JOBHISTORY,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IJobHistory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_JOBHISTORY,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
