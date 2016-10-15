import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {
  FETCH_PHOTOS_REQUEST,
  FETCH_PHOTOS_SUCCESS,
  FETCH_PHOTOS_FAILURE,
} from '../actions';


const initialState = {
  byId: {},
  allIds: [],
  isFetching: false,
};


// ////////////////////
// Reducers //////////
// //////////////////
const byId = (state = initialState.byId, { type, ...payload }) => {
  switch (type) {
    case FETCH_PHOTOS_SUCCESS:
      return {
        ...state,
        ...payload.photos,
      };

    default:
      return state;
  }
};

const allIds = (state = initialState.allIds, { type, ...payload }) => {
  switch (type) {
    case FETCH_PHOTOS_SUCCESS:
      return [
        ...state,
        ...payload.photoIds,
      ];

    default:
      return state;
  }
};

const isFetching = (state = initialState.isFetching, { type }) => {
  switch (type) {
    case FETCH_PHOTOS_REQUEST:
      return true;

    case FETCH_PHOTOS_SUCCESS:
    case FETCH_PHOTOS_FAILURE:
      return false;

    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds,
  isFetching,
});


// ////////////////////
// Selectors /////////
// //////////////////
const byIdSelector = state => state.photos.byId;
const allIdsSelector = state => state.photos.allIds;

// Create an array of photos, for easy consumption.
// We need to take care to assign the ID to each object.
export const photosListSelector = createSelector(
  byIdSelector,
  allIdsSelector,
  (byId, allIds) => (
    allIds.map(id => ({
      ...byId[id],
      id,
    }))
  )
);
