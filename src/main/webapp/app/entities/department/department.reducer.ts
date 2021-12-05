import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDepartment, defaultValue } from 'app/shared/model/department.model';

export const ACTION_TYPES = {
  FETCH_DEPARTMENT_LIST: 'department/FETCH_DEPARTMENT_LIST',
  FETCH_DEPARTMENT: 'department/FETCH_DEPARTMENT',
  CREATE_DEPARTMENT: 'department/CREATE_DEPARTMENT',
  UPDATE_DEPARTMENT: 'department/UPDATE_DEPARTMENT',
  PARTIAL_UPDATE_DEPARTMENT: 'department/PARTIAL_UPDATE_DEPARTMENT',
  DELETE_DEPARTMENT: 'department/DELETE_DEPARTMENT',
  RESET: 'department/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDepartment>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type DepartmentState = Readonly<typeof initialState>;

// Reducer

export default (state: DepartmentState = initialState, action): DepartmentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DEPARTMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DEPARTMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DEPARTMENT):
    case REQUEST(ACTION_TYPES.UPDATE_DEPARTMENT):
    case REQUEST(ACTION_TYPES.DELETE_DEPARTMENT):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_DEPARTMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_DEPARTMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DEPARTMENT):
    case FAILURE(ACTION_TYPES.CREATE_DEPARTMENT):
    case FAILURE(ACTION_TYPES.UPDATE_DEPARTMENT):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_DEPARTMENT):
    case FAILURE(ACTION_TYPES.DELETE_DEPARTMENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_DEPARTMENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_DEPARTMENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_DEPARTMENT):
    case SUCCESS(ACTION_TYPES.UPDATE_DEPARTMENT):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_DEPARTMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DEPARTMENT):
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

const apiUrl = 'api/departments';

// Actions

export const getEntities: ICrudGetAllAction<IDepartment> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_DEPARTMENT_LIST,
  payload: axios.get<IDepartment>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IDepartment> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DEPARTMENT,
    payload: axios.get<IDepartment>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IDepartment> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DEPARTMENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDepartment> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DEPARTMENT,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IDepartment> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_DEPARTMENT,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDepartment> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DEPARTMENT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
