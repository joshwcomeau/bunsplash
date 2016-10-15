/* eslint-disable no-unused-vars */
import { delay, takeEvery, takeLatest } from 'redux-saga';
import { take, call, race, put, fork, select } from 'redux-saga/effects';

import {
  FETCH_PHOTOS_SUCCESS,
  PAUSE_SLIDESHOW,
  SELECT_PHOTO,
  selectPhoto,
  updateSlideshowProgress,
} from '../actions';


const slideLength = 50; // The number of ticks to wait for each slide
const tickLength = 150; // The length of a tick, in ms

function* slideshow({ page }) {
  let ticks = 0;

  while (ticks < slideLength) {
    yield delay(tickLength);

    // Check to see if our slideshow is still running.
    // (it can be paused by mousing over the photo).
    const status = yield select(state => state.slideshow.status);

    if (status === 'RUNNING') {
      ticks += 1;

      // Calculate the percentage through this slide
      const progress = (ticks / slideLength) * 100;

      yield put(updateSlideshowProgress({ progress }));
    }
  }

  // Once that slide is done, select our next photo,
  // which will restart the process.
  const photos = yield select(state => state.photos);
  const currentPhotoIndex = photos.allIds.indexOf(photos.currentPhotoId);
  const nextPhotoId = photos.allIds[currentPhotoIndex + 1];

  yield put(selectPhoto({ photoId: nextPhotoId }));
}


// ///////////////////
// WATCHERS /////////
// /////////////////
export default function* watchSlideshow() {
  // The slideshow should begin when we select our first photo,
  // and will re-trigger on every subsequent photo.
  yield* takeEvery(SELECT_PHOTO, slideshow);
}
