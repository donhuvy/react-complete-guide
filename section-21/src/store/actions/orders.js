import actionTypes from './actionTypes';
import axios from '../../axios-order';

// sync actions
function fetchOrdersSync() {
    return {
        type: actionTypes.FETCH_ORDERS
    }
}

function fetchOrdersSuccess(orders) {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    }
}

function fetchOrdersFailure(error) {
    return {
        type: actionTypes.FETCH_ORDERS_FAILURE,
        error
    }
}

function deleteOrder(orderId) {
    return {
        type: actionTypes.DELETE_ORDER,
        orderId
    }
}

function deleteOrderSuccess(orderId) {
    return {
        type: actionTypes.DELETE_ORDER_SUCCESS,
        orderId
    }
}

function deleteOrderFailure(error) {
    return {
        type: actionTypes.DELETE_ORDER_FAILURE,
        error
    }
}

// async actions
export function deleteOrderAsync(orderId, token) {
    return dispatch => {
        dispatch(deleteOrder(orderId));

        axios
        .delete(`/orders/${orderId}.json?auth=${token}`)
        .then(order => {
            dispatch(deleteOrderSuccess(orderId));
            dispatch(fetchOrdersAsync(token));
        })
        .catch(err => {
            dispatch(deleteOrderFailure(err));
        })
    }
}

export function fetchOrdersAsync(token, userId) {
    return dispatch => {
        dispatch(fetchOrdersSync());
        const queryParams = '?auth='+token+'&orderBy="userId"&equalTo="'+userId+'"';

        axios
        .get('/orders.json'+queryParams)
        .then(orders => {
            if (orders.data) {
                dispatch(fetchOrdersSuccess(orders.data));
            } else {
                dispatch(fetchOrdersFailure({
                    message: 'Sorry, no orders to show at the moment.'
                }))
            }
        }, err => {
            dispatch(fetchOrdersFailure(err));
        })
        .catch(err => {
            dispatch(fetchOrdersFailure(err));
        })
    }
}