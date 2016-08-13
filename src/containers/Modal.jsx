/* @flow */
/* global ReactClass */
import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import { modalForType, hideModal } from '../modules/modal';

type Props = {
  isOpen: boolean,
  Component: ReactClass,
  props: Object,
  close: Function,
};

const Modal = ({ isOpen, Component, props, close }: Props) => (
  <ReactModal isOpen={isOpen} onReqeustClose={close}>
    {isOpen ? <Component {...props} /> : null}
  </ReactModal>
);

const mapStateToProps = state => ({
  isOpen: state.ui.modal.type !== null,
  Component: modalForType(state.ui.modal.type),
  props: state.ui.modal.props,
});

const mapDispatchToProps = () => ({
  close: hideModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
