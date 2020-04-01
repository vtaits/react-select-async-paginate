import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const CHECK_TIMEOUT = 300;

export default function wrapMenuList(MenuList) {
  class WrappedMenuList extends Component {
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

      const {
        selectProps: {
          shouldLoadMore,
        },
      } = this.props;

      return shouldLoadMore(scrollHeight, clientHeight, scrollTop);
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

  WrappedMenuList.propTypes = {
    innerRef: PropTypes.func.isRequired,

    selectProps: PropTypes.shape({
      handleScrolledToBottom: PropTypes.func.isRequired,
      shouldLoadMore: PropTypes.func.isRequired,
    }).isRequired,
  };

  return WrappedMenuList;
}
