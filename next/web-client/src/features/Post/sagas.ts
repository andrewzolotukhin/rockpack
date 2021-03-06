/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { LoggerInterface } from 'logrock';
import { call, put, takeEvery, takeLatest, getContext } from 'redux-saga/effects';
import { fetchPost, requestPost, requestPostError, requestPostSuccess, updatePost, postUpdated } from './actions';
import { ServicesInterface } from '../../services';
import { PostRes } from './service';

function* fetchPostSaga(logger: LoggerInterface, { payload: { postId } }: ReturnType<typeof fetchPost>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    yield put(requestPost());
    const { data }: PostRes = yield call(() => services.post.fetchPost(postId));
    yield put(requestPostSuccess(data));
  } catch (error) {
    yield put(requestPostError());
  }
}

function* updatePostHandler(logger: LoggerInterface, { payload: { post } }: ReturnType<typeof updatePost>) {
  try {
    const services: ServicesInterface = yield getContext('services');
    yield call(() => services.post.updatePost(post.postId, {
      title: post.title,
      text: post.text
    }));

    yield put(postUpdated({
      title: post.title,
      text: post.text
    }));
  } catch (error) {
    logger.error(error, false);
  }
}

function* updatePostSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeLatest(updatePost.type, updatePostHandler, logger);
}

function* watchPost(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(fetchPost.type, fetchPostSaga, logger);
}

export { watchPost, updatePostSaga };
