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

import { IEmployee, defaultValue } from 'app/shared/model/employee.model';

export const ACTION_TYPES = {
  FETCH_EMPLOYEE_LIST: 'employee/FETCH_EMPLOYEE_LIST',
  FETCH_EMPLOYEE: 'employee/FETCH_EMPLOYEE',
  CREATE_EMPLOYEE: 'employee/CREATE_EMPLOYEE',
  UPDATE_EMPLOYEE: 'employee/UPDATE_EMPLOYEE',
  PARTIAL_UPDATE_EMPLOYEE: 'employee/PARTIAL_UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'employee/DELETE_EMPLOYEE',
  RESET: 'employee/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEmployee>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EmployeeState = Readonly<typeof initialState>;

// Reducer

export default (state: EmployeeState = initialState, action): EmployeeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EMPLOYEE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EMPLOYEE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EMPLOYEE):
    case REQUEST(ACTION_TYPES.UPDATE_EMPLOYEE):
    case REQUEST(ACTION_TYPES.DELETE_EMPLOYEE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_EMPLOYEE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EMPLOYEE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EMPLOYEE):
    case FAILURE(ACTION_TYPES.CREATE_EMPLOYEE):
    case FAILURE(ACTION_TYPES.UPDATE_EMPLOYEE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_EMPLOYEE):
    case FAILURE(ACTION_TYPES.DELETE_EMPLOYEE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EMPLOYEE_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_EMPLOYEE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EMPLOYEE):
    case SUCCESS(ACTION_TYPES.UPDATE_EMPLOYEE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_EMPLOYEE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EMPLOYEE):
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

const apiUrl = 'api/employees';

// Actions

export const getEntities: ICrudGetAllAction<IEmployee> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EMPLOYEE_LIST,
    payload: axios.get<IEmployee>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEmployee> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EMPLOYEE,
    payload: axios.get<IEmployee>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEmployee> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EMPLOYEE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IEmployee> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EMPLOYEE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IEmployee> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_EMPLOYEE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEmployee> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EMPLOYEE,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
