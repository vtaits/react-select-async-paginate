import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AVAILABLE_DELTA = 10;
export const CHECK_TIMEOUT = 300;

export default function wrapMenuList(MenuList) {
  class WrappedMenuList extends Component {
    static propTypes = {
      innerRef: PropTypes.func.isRequired,

      selectProps: PropTypes.shape({
        handleScrolledToBottom: PropTypes.func.isRequired,
      }).isRequired,
    }

    componentDidMount() {
      this.setCheckAndHandleTimeount();
    }

    componentWillUnmount() {
      if (this.checkTimeout) {
        clearTimeout(this.checkTimeout);
      }
    }

    innerRef = (ref) => {
      if (ref === this.menuListRef) {
        return;
      }

      const {
        innerRef,
      } = this.props;

      this.menuListRef = ref;

      innerRef(ref);
    }

    setCheckAndHandleTimeount = () => {
      this.checkAndHandle();

      this.checkTimeout = setTimeout(this.setCheckAndHandleTimeount, CHECK_TIMEOUT);
    }

    checkAndHandle() {
      if (this.shouldHandle()) {
        const {
          selectProps: {
            handleScrolledToBottom,
          },
        } = this.props;

        if (handleScrolledToBottom) {
          handleScrolledToBottom();
        }
      }
    }

    shouldHandle() {
      const el = this.menuListRef;

      // menu not rendered
      if (!el) {
        return false;
      }

      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = el;

      // menu hasn't scroll
      if (scrollHeight <= clientHeight) {
        return true;
      }

      return scrollHeight - AVAILABLE_DELTA < clientHeight + scrollTop;
    }

    render() {
      return (
        <MenuList
          {...this.props}
          innerRef={this.innerRef}
        />
      );
    }
  }

  return WrappedMenuList;
}
